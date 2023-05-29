import { makeVar, useReactiveVar } from '@apollo/client';
import { AmountHumanReadable, AmountHumanReadableMap } from '~/lib/services/token/token-types';
import { keyBy, mapValues } from 'lodash';

interface InvestTypeAmounts {
    inputAmounts: AmountHumanReadableMap;
}
interface InvestState {
    poolId: string;
    proportional: InvestTypeAmounts;
    custom: InvestTypeAmounts;
    selectedOptions: { [poolTokenIndex: string]: string };
    inputAmounts: AmountHumanReadableMap;
    zapEnabled: boolean;
}

export const investStateVar = makeVar<InvestState[]>([]);

export function useInvestState(poolId: string) {
    function setInitialInvestState() {
        const state = investStateVar();
        const isPoolInState = state.findIndex((state) => state.poolId === poolId) !== -1;

        if (isPoolInState) {
            return;
        } else {
            investStateVar([
                ...state,
                {
                    poolId,
                    proportional: {
                        inputAmounts: {},
                    },
                    custom: {
                        inputAmounts: {},
                    },
                    inputAmounts: {},
                    selectedOptions: {},
                    zapEnabled: false,
                },
            ]);
        }
    }

    function setInputAmounts(investType: string, inputAmounts: AmountHumanReadableMap) {
        const state = investStateVar();

        investStateVar(
            state.map((state) => {
                const proportional =
                    investType === 'proportional'
                        ? { proportional: { ...state.proportional, inputAmounts } }
                        : { proportional: { ...state.proportional } };
                const custom =
                    investType === 'custom'
                        ? { custom: { ...state.custom, inputAmounts } }
                        : { custom: { ...state.custom } };
                if (state.poolId === poolId) {
                    return {
                        ...state,
                        ...proportional,
                        ...custom,
                        inputAmounts,
                    };
                } else {
                    return state;
                }
            }),
        );
    }

    function setInputAmount(investType: string, tokenAddress: string, amount: AmountHumanReadable) {
        const state = investStateVar();

        investStateVar(
            state.map((state) => {
                const proportional =
                    investType === 'proportional'
                        ? {
                              ...state.proportional,
                              inputAmounts: {
                                  ...state.proportional.inputAmounts,
                                  [tokenAddress]: amount,
                              },
                          }
                        : { ...state.proportional };
                const custom =
                    investType === 'custom'
                        ? {
                              ...state.custom,
                              inputAmounts: {
                                  ...state.custom.inputAmounts,
                                  [tokenAddress]: amount,
                              },
                          }
                        : { ...state.custom };
                if (state.poolId === poolId) {
                    return {
                        ...state,
                        ...proportional,
                        ...custom,
                    };
                } else {
                    return state;
                }
            }),
        );
    }

    function setSelectedOption(poolTokenIndex: number, tokenAddress: string) {
        const state = investStateVar();

        investStateVar(
            state.map((state) => {
                if (state.poolId === poolId) {
                    return {
                        ...state,
                        selectedOptions: {
                            ...state.selectedOptions,
                            [`${poolTokenIndex}`]: tokenAddress,
                        },
                    };
                } else {
                    return state;
                }
            }),
        );
    }

    function setSelectedOptions(options: { poolTokenIndex: number; tokenAddress: string }[]) {
        const state = investStateVar();

        investStateVar(
            state.map((state) => {
                if (state.poolId === poolId) {
                    return {
                        ...state,
                        selectedOptions: mapValues(
                            keyBy(options, ({ poolTokenIndex }) => `${poolTokenIndex}`),
                            'tokenAddress',
                        ),
                    };
                } else {
                    return state;
                }
            }),
        );
    }

    function toggleZapEnabled() {
        const state = investStateVar();

        investStateVar(
            state.map((state) => {
                if (state.poolId === poolId) {
                    return {
                        ...state,
                        zapEnabled: !state.zapEnabled,
                    };
                } else {
                    return state;
                }
            }),
        );
    }

    function clearInvestState() {
        const state = investStateVar();

        investStateVar(state.filter((state) => state.poolId !== poolId));
    }

    const state = useReactiveVar(investStateVar);
    const investState = state.find((state) => state.poolId === poolId);

    return {
        setInitialInvestState,
        setInputAmounts,
        setInputAmount,
        setSelectedOption,
        setSelectedOptions,
        clearInvestState,
        toggleZapEnabled,
        ...state,
        zapEnabled: investState?.zapEnabled,
        selectedOptions: investState?.selectedOptions,
        inputAmounts: investState?.inputAmounts,
        customInputAmounts: investState?.custom.inputAmounts,
        proportionalInputAmounts: investState?.proportional.inputAmounts,
    };
}
