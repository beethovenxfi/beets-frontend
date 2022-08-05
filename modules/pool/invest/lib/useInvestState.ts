import { makeVar, useReactiveVar } from '@apollo/client';
import { AmountHumanReadable, AmountHumanReadableMap } from '~/lib/services/token/token-types';

interface InvestState {
    inputAmounts: AmountHumanReadableMap;
    selectedOptions: { [poolTokenIndex: string]: string };
    zapEnabled: boolean;
}

export const investStateVar = makeVar<InvestState>({
    inputAmounts: {},
    selectedOptions: {},
    zapEnabled: false,
});

export function useInvestState() {
    function setInputAmounts(inputAmounts: AmountHumanReadableMap) {
        const state = investStateVar();

        investStateVar({
            ...state,
            inputAmounts,
        });
    }

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

    function toggleZapEnabled() {
        const state = investStateVar();
        investStateVar({
            ...state,
            zapEnabled: !state.zapEnabled,
        });
    }

    function clearInvestState() {
        investStateVar({
            inputAmounts: {},
            selectedOptions: {},
            zapEnabled: false,
        });
    }

    return {
        setInputAmounts,
        setInputAmount,
        setSelectedOption,
        clearInvestState,
        ...useReactiveVar(investStateVar),
        toggleZapEnabled,
    };
}
