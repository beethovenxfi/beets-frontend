import { makeVar, useReactiveVar } from '@apollo/client';
import { AmountHumanReadable, AmountHumanReadableMap } from '~/lib/services/token/token-types';

interface InvestState {
    inputAmounts: AmountHumanReadableMap;
}

export const investStateVar = makeVar<InvestState>({
    inputAmounts: {},
});

export function useInvestState() {
    const investState = useReactiveVar(investStateVar);

    function setInputAmount(tokenAddress: string, amount: AmountHumanReadable) {
        investStateVar({
            inputAmounts: {
                ...investState.inputAmounts,
                [tokenAddress]: amount,
            },
        });
    }

    return {
        setInputAmount,
        inputAmounts: investState.inputAmounts,
    };
}
