import { usePool } from '~/modules/pool/lib/usePool';
import { useQuery } from 'react-query';
import { useReactiveVar } from '@apollo/client';
import { investStateVar } from '~/modules/pool/invest/lib/useInvestState';
import { tokenAmountsGetArrayFromMap } from '~/lib/services/token/token-util';
import { useSlippage } from '~/lib/global/useSlippage';
import { HIGH_PRICE_IMPACT, MEDIUM_PRICE_IMPACT } from '~/modules/constants';
import numeral from 'numeral';

export function usePoolJoinGetBptOutAndPriceImpactForTokensIn() {
    const { poolService } = usePool();
    const { inputAmounts } = useReactiveVar(investStateVar);
    const { slippage } = useSlippage();
    const tokenAmountsIn = tokenAmountsGetArrayFromMap(inputAmounts);

    const { data: bptOutAndPriceImpact, isLoading } = useQuery(
        ['joinGetBptOutAndPriceImpactForTokensIn', tokenAmountsIn, slippage],
        () => {
            return poolService.joinGetBptOutAndPriceImpactForTokensIn(tokenAmountsIn, slippage);
        },
        { enabled: tokenAmountsIn.length > 0, staleTime: 0, cacheTime: 0 },
    );

    const hasHighPriceImpact = Math.abs(bptOutAndPriceImpact?.priceImpact || 0) > HIGH_PRICE_IMPACT;
    const hasMediumPriceImpact =
        !hasHighPriceImpact && Math.abs(bptOutAndPriceImpact?.priceImpact || 0) > MEDIUM_PRICE_IMPACT;

    const formattedPriceImpact = numeral(Math.abs(bptOutAndPriceImpact?.priceImpact || 0)).format('0.00%');

    return {
        bptOutAndPriceImpact,
        hasHighPriceImpact,
        hasMediumPriceImpact,
        formattedPriceImpact,
        isLoading,
    };
}
