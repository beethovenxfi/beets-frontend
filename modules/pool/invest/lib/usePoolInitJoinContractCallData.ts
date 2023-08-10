import { useQuery } from 'react-query';
import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';
import { replaceEthWithWeth, tokenAmountsGetArrayFromMap } from '~/lib/services/token/token-util';
import { PoolJoinData } from '~/lib/services/pool/pool-types';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useSlippage } from '~/lib/global/useSlippage';
import { usePool } from '~/modules/pool/lib/usePool';
import { PoolCreationToken } from '~/modules/compose/ComposeProvider';

// This is a separate hook as the main contract call data hook relies on the pool context,
// which will not exist at the time of pool creation
export function usePoolJoinGetContractCallData(tokens: PoolCreationToken[]) {
    const networkConfig = useNetworkConfig();
    const inputAmountsArray = tokens.map((token) => {
        return {
            address: token.address,
            amount: token.amount,
        } as TokenAmountHumanReadable;
    });

    const joinData: PoolJoinData = {
        kind: 'Init',
        tokenAmountsIn: inputAmountsArray,
    } as PoolJoinData;

    return useQuery(
        ['joinGetContractCallData', joinData],
        async () => {
            const contractCallData = await poolService.joinGetContractCallData(joinData);
            return contractCallData;
        },
        { enabled: tokenAmountsIn.length > 0 && minimumBpt !== null, staleTime: 0, cacheTime: 0 },
    );
}
