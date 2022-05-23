import { makeVar, useReactiveVar } from '@apollo/client';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';

type WithdrawType = 'PROPORTIONAL' | 'SINGLE_ASSET';

interface WithdrawState {
    type: WithdrawType;
    singleAsset: TokenAmountHumanReadable | null;
    proportionalPercent: number;
}

export const withdrawStateVar = makeVar<WithdrawState>({
    type: 'PROPORTIONAL',
    proportionalPercent: 100,
    singleAsset: null,
});

export function useWithdrawState() {
    const withdrawState = useReactiveVar(withdrawStateVar);

    async function setProportionalPercent(value: number) {
        withdrawStateVar({ ...withdrawState, proportionalPercent: value });
    }

    function setProportionalWithdraw() {
        withdrawStateVar({ ...withdrawState, type: 'PROPORTIONAL', singleAsset: null });
    }

    function setSingleAssetWithdraw(tokenAddress: string) {
        withdrawStateVar({
            ...withdrawState,
            type: 'SINGLE_ASSET',
            singleAsset: { address: tokenAddress, amount: '' },
        });
    }

    function setSingleAssetWithdrawAmount(tokenAmount: TokenAmountHumanReadable) {
        withdrawStateVar({
            ...withdrawState,
            singleAsset: tokenAmount,
        });
    }

    return {
        setProportionalPercent,
        selectedWithdrawType: withdrawState.type,
        singleAssetWithdraw: withdrawState.singleAsset,
        proportionalPercent: withdrawState.proportionalPercent,
        setProportionalWithdraw,
        setSingleAssetWithdraw,
        setSingleAssetWithdrawAmount,
    };
}
