import { makeVar, useReactiveVar } from '@apollo/client';
import { AmountHumanReadable, AmountHumanReadableMap } from '~/lib/services/token/token-types';
import { usePool } from '~/modules/pool/lib/usePool';

interface InvestState {
    inputAmounts: AmountHumanReadableMap;
    selectedOptions: { [poolTokenIndex: string]: string };
}

export const investStateVar = makeVar<InvestState>({
    inputAmounts: {},
    selectedOptions: {},
});

export function useInvestState() {
    const investState = useReactiveVar(investStateVar);

    function setInputAmount(tokenAddress: string, amount: AmountHumanReadable) {
        const state = investStateVar();

        investStateVar({
            ...state,
            inputAmounts: {
                ...state.inputAmounts,
                [tokenAddress]: amount,
            },
        });
    }

    function setSelectedOption(poolTokenIndex: number, tokenAddress: string) {
        const state = investStateVar();

        investStateVar({
            ...state,
            selectedOptions: {
                ...state.selectedOptions,
                [`${poolTokenIndex}`]: tokenAddress,
            },
        });
    }

    return {
        setInputAmount,
        setSelectedOption,
        inputAmounts: investState.inputAmounts,
        selectedOptions: investState.selectedOptions,
    };
}
