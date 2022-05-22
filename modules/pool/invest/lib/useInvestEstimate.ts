import { usePool } from '~/modules/pool/lib/usePool';
import { useReactiveVar } from '@apollo/client';
import { investStateVar } from '~/modules/pool/invest/lib/useInvestState';
import { useAsyncEffect } from '~/lib/util/custom-hooks';
import { map, pickBy } from 'lodash';
import { AmountHumanReadableMap, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { useSlippage } from '~/lib/global/useSlippage';
import { PoolJoinContractCallData } from '~/lib/services/pool/pool-types';
import { useState } from 'react';

interface InvestEstimateData {
    priceImpact: number;
    minBptReceived: string;
    contractCallData: PoolJoinContractCallData | null;
    tokenAmountsIn: TokenAmountHumanReadable[];
}

export function useInvestEstimate() {
    const { poolService } = usePool();
    const { inputAmounts } = useReactiveVar(investStateVar);
    const { slippage } = useSlippage();
    const [investEstimateData, setInvestEstimateData] = useState<InvestEstimateData>({
        priceImpact: 0,
        minBptReceived: '0',
        contractCallData: null,
        tokenAmountsIn: [],
    });

    useAsyncEffect(async () => {
        const inputAmountsWithValue = pickBy(inputAmounts, (amount) => amount !== '');
        const addressesWithValue = Object.keys(inputAmountsWithValue);

        if (addressesWithValue.length > 0) {
            const tokenAmountsIn = getTokenAmounts(inputAmounts);
            const { priceImpact, minBptReceived } = await poolService.joinGetEstimate(tokenAmountsIn, slippage);

            const contractCallData = await poolService.joinGetContractCallData({
                kind: 'ExactTokensInForBPTOut',
                tokenAmountsIn,
                maxAmountsIn: tokenAmountsIn,
                minimumBpt: minBptReceived,
            });

            setInvestEstimateData({ priceImpact, minBptReceived, tokenAmountsIn, contractCallData });
        } else {
            setInvestEstimateData({ priceImpact: 0, minBptReceived: '0', contractCallData: null, tokenAmountsIn: [] });
        }
    }, [inputAmounts]);

    return {
        priceImpact: investEstimateData.priceImpact,
        contractCallData: investEstimateData.contractCallData,
        tokenAmountsIn: investEstimateData.tokenAmountsIn,
    };
}

function getTokenAmounts(amountMap: AmountHumanReadableMap): TokenAmountHumanReadable[] {
    return map(
        pickBy(amountMap, (amount) => amount !== ''),
        (amount, address) => ({ amount, address }),
    );
}
