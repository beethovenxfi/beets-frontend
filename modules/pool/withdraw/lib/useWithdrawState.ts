import { makeVar, useReactiveVar } from '@apollo/client';
import {
    AmountHumanReadable,
    AmountHumanReadableMap,
    TokenAmountHumanReadable,
} from '~/lib/services/token/token-types';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { poolGetServiceForPool } from '~/lib/services/pool/pool-util';
import { useSlippage } from '~/lib/global/useSlippage';

type WithdrawType = 'PROPORTIONAL' | 'SINGLE_ASSET';

interface WithrdawState {
    type: WithdrawType;
    singleAsset: string | null;
    singleAssetAmount: AmountHumanReadable;
    proportionalPercent: number;
    priceImpact: number;
    minBptReceived: string;

    contractCallData: null;
    tokenAmountsOut: TokenAmountHumanReadable[];
}

export const withdrawStateVar = makeVar<WithrdawState>({
    type: 'PROPORTIONAL',
    singleAsset: null,
    singleAssetAmount: '0',
    proportionalPercent: 100,
    priceImpact: 0,
    minBptReceived: '0',
    tokenAmountsOut: [],
    contractCallData: null,
});
export const withdrawProportionalAmountsVar = makeVar<AmountHumanReadableMap>({});

export function useWithdrawState(pool: GqlPoolUnion, userBptBalance: AmountHumanReadable) {
    const withrdawState = useReactiveVar(withdrawStateVar);
    const proportionalAmounts = useReactiveVar(withdrawProportionalAmountsVar);
    const service = poolGetServiceForPool(pool);
    const { slippage } = useSlippage();

    async function setProportionalPercent(value: number) {
        withdrawStateVar({ ...withrdawState, proportionalPercent: value });
    }

    /*async function setInputAmount(tokenAddress: string, amount: AmountHumanReadable) {
        const inputAmounts = { ...withrdawState.inputAmounts, [tokenAddress]: amount };

        const inputAmountsWithValue = pickBy(inputAmounts, (amount) => amount !== '');
        const addressesWithValue = Object.keys(inputAmountsWithValue);

        if (addressesWithValue.length > 0 && service.joinGetProportionalSuggestionForFixedAmount) {
            const address = addressesWithValue[0];
            //TODO: this won't work for suggestions that actually require async fetches
            const result = await service.joinGetProportionalSuggestionForFixedAmount({
                address,
                amount: inputAmountsWithValue[address],
            });
            const proportionalSuggestion = Object.fromEntries(result.map((item) => [item.address, item.amount]));

            if (isProportionalSuggestionValid(inputAmounts, proportionalSuggestion)) {
                withdrawProportionalAmountsVar(proportionalSuggestion);
            } else {
                withdrawProportionalAmountsVar({});
            }
        } else if (
            addressesWithValue.length === 0 ||
            !isProportionalSuggestionValid(inputAmounts, proportionalAmounts)
        ) {
            withdrawProportionalAmountsVar({});
        }

        if (addressesWithValue.length > 0) {
            const tokenAmountsIn = getTokenAmounts(inputAmounts);
            const { priceImpact, minBptReceived } = await service.joinGetEstimate(tokenAmountsIn, slippage);

            const contractCallData = await service.joinGetContractCallData({
                kind: 'ExactTokensInForBPTOut',
                tokenAmountsIn,
                maxAmountsIn: tokenAmountsIn,
                minimumBpt: minBptReceived,
            });

            withdrawStateVar({
                ...withrdawState,
                inputAmounts,
                priceImpact,
                minBptReceived,
                contractCallData,
                tokenAmountsIn,
            });
        } else {
            withdrawStateVar({
                ...withrdawState,
                inputAmounts,
                priceImpact: 0,
                minBptReceived: '0',
                contractCallData: null,
                tokenAmountsIn: [],
            });
        }
    }*/

    return {
        setProportionalPercent,
        proportionalPercent: withrdawState.proportionalPercent,
        proportionalAmounts,
        selectedWithdrawType: withrdawState.type,
        priceImpact: withrdawState.priceImpact,
        contractCallData: withrdawState.contractCallData,
        tokenAmountsOut: withrdawState.tokenAmountsOut,
    };
}
