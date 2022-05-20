import { makeVar, useReactiveVar } from '@apollo/client';
import {
    AmountHumanReadable,
    AmountHumanReadableMap,
    TokenAmountHumanReadable,
} from '~/lib/services/token/token-types';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { map, merge, pickBy } from 'lodash';
import { poolGetServiceForPool } from '~/lib/services/pool/pool-util';
import { PoolJoinContractCallData } from '~/lib/services/pool/pool-types';
import { useSlippage } from '~/modules/global/useSlippage';

interface InvestState {
    inputAmounts: AmountHumanReadableMap;
    priceImpact: number;
    minBptReceived: string;
    contractCallData: PoolJoinContractCallData | null;
    tokenAmountsIn: TokenAmountHumanReadable[];
}

export const investStateVar = makeVar<InvestState>({
    inputAmounts: {},
    priceImpact: 0,
    minBptReceived: '0',
    contractCallData: null,
    tokenAmountsIn: [],
});
export const investProportionalAmountsVar = makeVar<AmountHumanReadableMap>({});

export function useInvestState(pool: GqlPoolUnion) {
    const investState = useReactiveVar(investStateVar);
    const proportionalAmounts = useReactiveVar(investProportionalAmountsVar);
    const service = poolGetServiceForPool(pool);
    const hasProportionalSuggestions = Object.keys(proportionalAmounts).length > 0;
    const { slippage } = useSlippage();

    async function setInputAmount(tokenAddress: string, amount: AmountHumanReadable) {
        const inputAmounts = { ...investState.inputAmounts, [tokenAddress]: amount };

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
                investProportionalAmountsVar(proportionalSuggestion);
            } else {
                investProportionalAmountsVar({});
            }
        } else if (
            addressesWithValue.length === 0 ||
            !isProportionalSuggestionValid(inputAmounts, proportionalAmounts)
        ) {
            investProportionalAmountsVar({});
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

            investStateVar({
                ...investState,
                inputAmounts,
                priceImpact,
                minBptReceived,
                contractCallData,
                tokenAmountsIn,
            });
        } else {
            investStateVar({
                ...investState,
                inputAmounts,
                priceImpact: 0,
                minBptReceived: '0',
                contractCallData: null,
                tokenAmountsIn: [],
            });
        }
    }

    return {
        setInputAmount,
        inputAmounts: investState.inputAmounts,
        proportionalAmounts,
        priceImpact: investState.priceImpact,
        contractCallData: investState.contractCallData,
        tokenAmountsIn: investState.tokenAmountsIn,
        hasProportionalSuggestions,
    };
}

function isProportionalSuggestionValid(
    inputAmounts: AmountHumanReadableMap,
    proportionalAmounts: AmountHumanReadableMap,
) {
    if (Object.keys(proportionalAmounts).length === 0) {
        //there is no proportional suggestion
        return true;
    }

    const addresses = Object.keys(inputAmounts);

    for (const address of addresses) {
        if (inputAmounts[address] !== '' && inputAmounts[address] !== proportionalAmounts[address]) {
            return false;
        }
    }

    return true;
}

function getTokenAmounts(amountMap: AmountHumanReadableMap): TokenAmountHumanReadable[] {
    return map(
        pickBy(amountMap, (amount) => amount !== ''),
        (amount, address) => ({ amount, address }),
    );
}
