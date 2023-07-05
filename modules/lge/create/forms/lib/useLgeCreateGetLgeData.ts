import { useQuery } from 'react-query';
import { LgeFormData, TokenInfoMap, copperProxyService } from '~/lib/services/lge/copper-proxy.service';
import { useGetLgeToken } from '~/modules/lges/components/lib/useGetLgeToken';
import { useGetTokens } from '~/lib/global/useToken';
import { TokenAmountHumanReadable, TokenBase } from '~/lib/services/token/token-types';

export function useLGeCreateGetLgeData(data: LgeFormData) {
    const { token: launchToken } = useGetLgeToken(data.tokenAddress);
    const { getToken } = useGetTokens();

    const collateralToken = getToken(data.collateralAddress);

    const tokenInfoMap: TokenInfoMap = {
        [data.tokenAddress]: launchToken?.decimals,
        [collateralToken?.address || '']: collateralToken?.decimals,
    };

    const lgeTokens: TokenAmountHumanReadable[] = [
        {
            address: data.tokenAddress,
            amount: data.tokenAmount,
        },
        {
            address: data.collateralAddress,
            amount: data.collateralAmount,
        },
    ];

    const tokens: TokenBase[] = [
        {
            address: data.tokenAddress,
            name: launchToken?.name || '',
            symbol: launchToken?.symbol || '',
            decimals: launchToken?.decimals || 18,
        },
        {
            address: collateralToken?.address || '',
            name: collateralToken?.name || '',
            symbol: collateralToken?.symbol || '',
            decimals: collateralToken?.decimals || 18,
        },
    ];

    const query = useQuery(
        ['createLgeGetLgeData', data],
        () => {
            const lgeData = copperProxyService.createLgeGetLgeData(data, tokenInfoMap);

            return lgeData;
        },
        { enabled: !!data, staleTime: 0, cacheTime: 0 },
    );

    return {
        ...query,
        lgeTokens,
        tokens,
    };
}
