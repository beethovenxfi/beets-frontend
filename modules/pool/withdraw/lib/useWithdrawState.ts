import { makeVar, useReactiveVar } from '@apollo/client';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';

type WithdrawType = 'PROPORTIONAL' | 'SINGLE_ASSET';

interface WithdrawState {
    type: WithdrawType;
    singleAsset: TokenAmountHumanReadable | null;
    proportionalPercent: number;
    selectedOptions: { [poolTokenIndex: string]: string };
    proportionalAmounts: TokenAmountHumanReadable[] | null;
    isReliquaryWithdraw: boolean;
}

export const withdrawStateVar = makeVar<WithdrawState>({
    type: 'PROPORTIONAL',
    proportionalPercent: 50,
    singleAsset: null,
    selectedOptions: {},
    proportionalAmounts: null,
    isReliquaryWithdraw: false,
});

export function useWithdrawState() {
    async function setProportionalPercent(value: number) {
        withdrawStateVar({ ...withdrawStateVar(), proportionalPercent: value });
    }

    function setProportionalWithdraw() {
        withdrawStateVar({ ...withdrawStateVar(), type: 'PROPORTIONAL', singleAsset: null });
    }

    function setProportionalAmounts(proportionalAmounts: TokenAmountHumanReadable[]) {
        withdrawStateVar({ ...withdrawStateVar(), proportionalAmounts });
    }

    function setSingleAssetWithdraw(tokenAddress: string) {
        withdrawStateVar({
            ...withdrawStateVar(),
            type: 'SINGLE_ASSET',
            singleAsset: { address: tokenAddress, amount: '' },
        });
    }

    function setSingleAssetWithdrawAmount(tokenAmount: TokenAmountHumanReadable) {
        withdrawStateVar({
            ...withdrawStateVar(),
            singleAsset: tokenAmount,
        });
    }

    function setSelectedOption(poolTokenIndex: number, tokenAddress: string) {
        const state = withdrawStateVar();

        withdrawStateVar({
            ...state,
            selectedOptions: {
                ...state.selectedOptions,
                [`${poolTokenIndex}`]: tokenAddress,
            },
        });
    }

    function setIsReliquaryWithdraw(isReliquaryWithdraw: boolean) {
        withdrawStateVar({ ...withdrawStateVar(), isReliquaryWithdraw });
    }

    function clearWithdrawState() {
        withdrawStateVar({
            type: 'PROPORTIONAL',
            proportionalPercent: 50,
            singleAsset: null,
            selectedOptions: {},
            proportionalAmounts: null,
            isReliquaryWithdraw: false,
        });
    }

    const withdrawState = useReactiveVar(withdrawStateVar);

    return {
        setProportionalPercent,
        selectedWithdrawType: withdrawState.type,
        singleAssetWithdraw: withdrawState.singleAsset,
        proportionalPercent: withdrawState.proportionalPercent,
        selectedOptions: withdrawState.selectedOptions,
        proportionalAmounts: withdrawState.proportionalAmounts,
        isReliquaryWithdraw: withdrawState.isReliquaryWithdraw,
        setProportionalWithdraw,
        setSingleAssetWithdraw,
        setSingleAssetWithdrawAmount,
        setSelectedOption,
        clearWithdrawState,
        setProportionalAmounts,
        setIsReliquaryWithdraw,
    };
}
