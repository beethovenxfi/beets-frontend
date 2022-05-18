import { makeVar, useReactiveVar } from '@apollo/client';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';

interface InvestState {
    inputAmounts: { [address: string]: AmountHumanReadable };
}

export const investStateVar = makeVar<InvestState>({ inputAmounts: {} });

export function useInvestState() {
    const investState = useReactiveVar(investStateVar);

    function getInputAmount(tokenAddress: string) {
        return investState.inputAmounts[tokenAddress] || '0';
    }

    function setInputAmount(tokenAddress: string, amount: AmountHumanReadable) {
        investStateVar({
            ...investState,
            inputAmounts: {
                ...investState.inputAmounts,
                [tokenAddress]: amount,
            },
        });
    }

    return {
        investState,
        getInputAmount,
        setInputAmount,
    };
}
