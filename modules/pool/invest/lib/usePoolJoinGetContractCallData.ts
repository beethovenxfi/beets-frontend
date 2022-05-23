import { usePool } from '~/modules/pool/lib/usePool';
import { useQuery } from 'react-query';
import { useReactiveVar } from '@apollo/client';
import { investStateVar } from '~/modules/pool/invest/lib/useInvestState';
import { tokenAmountsGetArrayFromMap } from '~/lib/services/token/token-util';
import { PoolJoinData } from '~/lib/services/pool/pool-types';
import { AmountHumanReadable } from '~/lib/services/token/token-types';

export function usePoolJoinGetContractCallData(minimumBpt: AmountHumanReadable | null) {
    const { poolService, pool } = usePool();
    const { inputAmounts } = useReactiveVar(investStateVar);
    const tokenAmountsIn = tokenAmountsGetArrayFromMap(inputAmounts);

    const data: PoolJoinData = {
        kind: 'ExactTokensInForBPTOut',
        tokenAmountsIn,
        maxAmountsIn: tokenAmountsIn,
        minimumBpt: minimumBpt || '0',
    };

    return useQuery(
        ['joinGetContractCallData', data],
        () => {
            return poolService.joinGetContractCallData(data);
        },
        { enabled: tokenAmountsIn.length > 0 && minimumBpt !== null, staleTime: 0, cacheTime: 0 },
    );
}
