import { useQuery } from 'react-query';
import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';
import { replaceEthWithWeth, tokenAmountsGetArrayFromMap } from '~/lib/services/token/token-util';
import {
    PoolJoinAllTokensInForExactBPTOut,
    PoolJoinData,
    PoolJoinExactTokensInForBPTOut,
} from '~/lib/services/pool/pool-types';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useSlippage } from '~/lib/global/useSlippage';
import { usePool } from '~/modules/pool/lib/usePool';

export function usePoolJoinGetContractCallData(minimumBpt: AmountHumanReadable | null, zapEnabled?: boolean) {
    const { userAddress } = useUserAccount();
    const networkConfig = useNetworkConfig();
    const { slippage } = useSlippage();
    const { poolService, pool } = usePool();
    const { inputAmounts } = useInvestState();
    const inputAmountsArray = inputAmounts ? tokenAmountsGetArrayFromMap(inputAmounts) : [];
    const hasEth = inputAmounts && networkConfig.eth.address.toLowerCase() in inputAmounts;
    const tokenAmountsIn = hasEth
        ? inputAmountsArray.map(({ amount, address }) => ({ address: replaceEthWithWeth(address), amount }))
        : inputAmountsArray;

    const baseData = {
        maxAmountsIn: tokenAmountsIn,
        userAddress: userAddress || '',
        wethIsEth: !!hasEth,
        slippage,
    };

    const poolData =
        pool.__typename === 'GqlPoolGyro'
            ? ({
                  kind: 'AllTokensInForExactBPTOut',
                  bptAmountOut: minimumBpt,
                  ...baseData,
              } as PoolJoinAllTokensInForExactBPTOut)
            : ({
                  kind: 'ExactTokensInForBPTOut',
                  tokenAmountsIn,
                  minimumBpt: minimumBpt || '0',
                  ...baseData,
              } as PoolJoinExactTokensInForBPTOut);

    const data: PoolJoinData = {
        zapIntoMasterchefFarm: !!pool.staking?.farm && zapEnabled,
        zapIntoGauge: !!pool.staking?.gauge && zapEnabled,
        ...poolData,
    };

    return useQuery(
        ['joinGetContractCallData', data],
        async () => {
            const contractCallData = await poolService.joinGetContractCallData(data);

            return contractCallData;
        },
        { enabled: tokenAmountsIn.length > 0 && minimumBpt !== null, staleTime: 0, cacheTime: 0 },
    );
}
