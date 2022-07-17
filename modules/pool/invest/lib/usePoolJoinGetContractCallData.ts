import { usePool } from '~/modules/pool/lib/usePool';
import { useQuery } from 'react-query';
import { useReactiveVar } from '@apollo/client';
import { investStateVar } from '~/modules/pool/invest/lib/useInvestState';
import {
    replaceEthWithWeth,
    replaceWethWithZeroAddress,
    tokenAmountsGetArrayFromMap,
} from '~/lib/services/token/token-util';
import { PoolJoinData } from '~/lib/services/pool/pool-types';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { networkConfig } from '~/lib/config/network-config';

export function usePoolJoinGetContractCallData(minimumBpt: AmountHumanReadable | null) {
    const { poolService } = usePool();
    const { inputAmounts } = useReactiveVar(investStateVar);
    const inputAmountsArray = tokenAmountsGetArrayFromMap(inputAmounts);
    const hasEth = networkConfig.eth.address.toLowerCase() in inputAmounts;
    const tokenAmountsIn = hasEth
        ? inputAmountsArray.map(({ amount, address }) => ({ address: replaceEthWithWeth(address), amount }))
        : inputAmountsArray;

    const data: PoolJoinData = {
        kind: 'ExactTokensInForBPTOut',
        tokenAmountsIn,
        maxAmountsIn: tokenAmountsIn,
        minimumBpt: minimumBpt || '0',
    };

    return useQuery(
        ['joinGetContractCallData', data],
        async () => {
            const contractCallData = await poolService.joinGetContractCallData(data);

            return {
                ...contractCallData,
                assets: hasEth ? replaceWethWithZeroAddress(contractCallData.assets) : contractCallData.assets,
            };
        },
        { enabled: tokenAmountsIn.length > 0 && minimumBpt !== null, staleTime: 0, cacheTime: 0 },
    );
}
