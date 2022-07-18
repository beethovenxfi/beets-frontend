import { makeVar, useReactiveVar } from '@apollo/client';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';

type WithdrawType = 'PROPORTIONAL' | 'SINGLE_ASSET';

interface WithdrawState {
    type: WithdrawType;
    singleAsset: TokenAmountHumanReadable | null;
    proportionalPercent: number;
    selectedOptions: { [poolTokenIndex: string]: string };
}

export const withdrawStateVar = makeVar<WithdrawState>({
    type: 'PROPORTIONAL',
    proportionalPercent: 100,
    singleAsset: null,
    selectedOptions: {},
});

export function useWithdrawState() {
    async function setProportionalPercent(value: number) {
        withdrawStateVar({ ...withdrawStateVar(), proportionalPercent: value });
    }

    function setProportionalWithdraw() {
        withdrawStateVar({ ...withdrawStateVar(), type: 'PROPORTIONAL', singleAsset: null });
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

    return {
        ...useReactiveVar(withdrawStateVar),
        setProportionalPercent,
        setProportionalWithdraw,
        setSingleAssetWithdraw,
        setSingleAssetWithdrawAmount,
        setSelectedOption,
    };
}
