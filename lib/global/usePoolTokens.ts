import { useQuery } from 'react-query';
import { useProvider } from 'wagmi';
import { vaultService } from '~/lib/services/vault.service';
import { useGetTokens } from './useToken';
import { formatFixed } from '@ethersproject/bignumber';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';

export function usePoolTokens(poolId: string) {
    const provider = useProvider();
    const { getToken } = useGetTokens();

    const query = useQuery(['usePoolTokens', poolId], async () => {
        return vaultService.getPoolTokens({
            poolId,
            provider,
        });
    });

    const poolTokens: TokenAmountHumanReadable[] = (query?.data || []).map((item) => {
        const token = getToken(item.address || '');
        const decimals = token ? token.decimals : 18;

        return {
            address: token?.address || '',
            amount: formatFixed(item.balanceScaled, decimals),
        };
    });

    return {
        ...query,
        poolTokens,
    };
}
