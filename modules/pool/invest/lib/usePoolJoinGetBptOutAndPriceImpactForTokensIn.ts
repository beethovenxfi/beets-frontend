import { usePool } from '~/modules/pool/lib/usePool';
import { useQuery } from 'react-query';
import { useReactiveVar } from '@apollo/client';
import { investStateVar } from '~/modules/pool/invest/lib/useInvestState';
import { tokenAmountsGetArrayFromMap } from '~/lib/services/token/token-util';
import { useSlippage } from '~/lib/global/useSlippage';
import numeral from 'numeral';
import { networkConfig } from '~/lib/config/network-config';

export function usePoolJoinGetBptOutAndPriceImpactForTokensIn() {
    const { poolService, pool } = usePool();
    const { inputAmounts, selectedOptions } = useReactiveVar(investStateVar);
    const { slippage } = useSlippage();
    //map the input amounts to the token being invested
    const tokenAmountsIn = tokenAmountsGetArrayFromMap(inputAmounts).map(({ amount, address }) => {
        const poolTokenIndex = pool.tokens.find((token) => token.address === address)?.index || -1;
        const investOption = pool.investConfig.options.find((option) => option.poolTokenIndex === poolTokenIndex);

        return {
            amount,
            address: selectedOptions[`${poolTokenIndex}`] || investOption?.tokenOptions[0].address || address,
        };
    });

    const query = useQuery(
        ['joinGetBptOutAndPriceImpactForTokensIn', tokenAmountsIn, slippage],
        async () => {
            if (
                !tokenAmountsIn ||
                tokenAmountsIn.every((tokenAmount) => !tokenAmount.amount || parseFloat(tokenAmount.amount) === 0)
            ) {
                return { minBptReceived: '0', priceImpact: 0 };
            }

            return poolService.joinGetBptOutAndPriceImpactForTokensIn(tokenAmountsIn, slippage);
        },
        { enabled: tokenAmountsIn.length > 0, staleTime: 0, cacheTime: 0 },
    );

    const bptOutAndPriceImpact = query.data;
    const priceImpact = Math.abs(bptOutAndPriceImpact?.priceImpact || 0);
    const hasHighPriceImpact = priceImpact > networkConfig.priceImpact.invest.high;
    const hasMediumPriceImpact = !hasHighPriceImpact && priceImpact > networkConfig.priceImpact.invest.noticeable;

    const formattedPriceImpact = numeral(priceImpact > 0.000001 ? priceImpact : 0).format('0.00%');

    return {
        ...query,
        bptOutAndPriceImpact,
        hasHighPriceImpact,
        hasMediumPriceImpact,
        formattedPriceImpact,
    };
}
