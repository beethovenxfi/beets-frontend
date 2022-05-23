import { usePool } from '~/modules/pool/lib/usePool';
import { useQuery } from 'react-query';
import { useReactiveVar } from '@apollo/client';
import { investStateVar } from '~/modules/pool/invest/lib/useInvestState';
import { tokenAmountsGetArrayFromMap } from '~/lib/services/token/token-util';
import { useSlippage } from '~/lib/global/useSlippage';

export function usePoolJoinGetBptOutAndPriceImpactForTokensIn() {
    const { poolService } = usePool();
    const { inputAmounts } = useReactiveVar(investStateVar);
    const { slippage } = useSlippage();
    const tokenAmountsIn = tokenAmountsGetArrayFromMap(inputAmounts);

    return useQuery(
        ['joinGetBptOutAndPriceImpactForTokensIn', tokenAmountsIn, slippage],
        () => {
            return poolService.joinGetBptOutAndPriceImpactForTokensIn(tokenAmountsIn, slippage);
        },
        { enabled: tokenAmountsIn.length > 0, staleTime: 0, cacheTime: 0 },
    );
}
