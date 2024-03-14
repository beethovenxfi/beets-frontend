import { makeVar, useReactiveVar } from '@apollo/client';
import { AmountHumanReadable, AmountHumanReadableMap } from '~/lib/services/token/token-types';
import { keyBy, mapValues } from 'lodash';
import { usePool } from '../../lib/usePool';

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

export function useInvestState() {
    const { pool } = usePool();
    const poolId = pool.id;

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

    // only used for 'proportional'
    function setInputAmounts(inputAmounts: AmountHumanReadableMap) {
        const state = investStateVar();

        investStateVar(
            state.map((state) => {
                if (state.poolId === poolId) {
                    return {
                        ...state,
                        proportional: { inputAmounts },
                        inputAmounts,
                    };
                } else {
                    return state;
                }
            }),
        );
    }

    // only used for 'custom'
    function setInputAmount(tokenAddress: string, amount: AmountHumanReadable) {
        const state = investStateVar();

        investStateVar(
            state.map((state) => {
                if (state.poolId === poolId) {
                    const inputAmount = { [tokenAddress]: amount };
                    return {
                        ...state,
                        custom: {
                            inputAmounts: {
                                ...state.custom.inputAmounts,
                                ...inputAmount,
                            },
                        },
                        inputAmounts: { ...state.inputAmounts, ...inputAmount },
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

    function toggleZapEnabled(value?: boolean) {
        const state = investStateVar();

        investStateVar(
            state.map((state) => {
                const zapEnabled = value ?? !state.zapEnabled;

                if (state.poolId === poolId) {
                    return {
                        ...state,
                        zapEnabled,
                    };
                } else {
                    return state;
                }
            }),
        );
    }

    function setInputAmountsForType(investType: string) {
        const state = investStateVar();

        investStateVar(
            state.map((state) => {
                if (state.poolId === poolId) {
                    return {
                        ...state,
                        inputAmounts:
                            investType === 'custom' ? state.custom.inputAmounts : state.proportional.inputAmounts,
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
        setInputAmountsForType,
        zapEnabled: investState?.zapEnabled,
        selectedOptions: investState?.selectedOptions,
        inputAmounts: investState?.inputAmounts,
        customInputAmounts: investState?.custom.inputAmounts,
        proportionalInputAmounts: investState?.proportional.inputAmounts,
    };
}
