import { makeVar, useReactiveVar } from '@apollo/client';
import { AmountHumanReadable, AmountHumanReadableMap } from '~/lib/services/token/token-types';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { merge, pickBy } from 'lodash';
import { poolGetServiceForPool } from '~/lib/services/pool/pool-util';
import { useGetTokens } from '~/modules/global/useToken';

interface InvestState {
    inputAmounts: AmountHumanReadableMap;
    priceImpact: number;
}

export const investStateVar = makeVar<InvestState>({ inputAmounts: {}, priceImpact: 0 });
export const investProportionalAmountsVar = makeVar<AmountHumanReadableMap>({});

export function useInvestState(pool: GqlPoolUnion) {
    const { priceFor } = useGetTokens();
    const investState = useReactiveVar(investStateVar);
    const proportionalAmounts = useReactiveVar(investProportionalAmountsVar);
    const service = poolGetServiceForPool(pool);
    const hasProportionalSuggestions = Object.keys(proportionalAmounts).length > 0;

    function getInputAmount(tokenAddress: string) {
        return investState.inputAmounts[tokenAddress] || '0';
    }

    async function setInputAmount(tokenAddress: string, amount: AmountHumanReadable) {
        investStateVar(merge({ ...investState }, { inputAmounts: { [tokenAddress]: amount } }));

        const inputAmountsWithValue = pickBy(investState.inputAmounts, (amount) => amount !== '');
        const addressesWithValue = Object.keys(inputAmountsWithValue);

        if (addressesWithValue.length > 0 && service.joinGetProportionalSuggestionForFixedAmount) {
            const address = addressesWithValue[0];
            //TODO: this won't work for suggestions that actually require async fetches
            const result = await service.joinGetProportionalSuggestionForFixedAmount({
                address,
                amount: inputAmountsWithValue[address],
            });
            const proportionalSuggestion = Object.fromEntries(result.map((item) => [item.address, item.amount]));

            if (isProportionalSuggestionValid(investState.inputAmounts, proportionalSuggestion)) {
                investProportionalAmountsVar(proportionalSuggestion);
            } else {
                investProportionalAmountsVar({});
            }
        } else if (
            addressesWithValue.length === 0 ||
            !isProportionalSuggestionValid(investState.inputAmounts, proportionalAmounts)
        ) {
            investProportionalAmountsVar({});
        }
    }

    return {
        inputAmounts: investState.inputAmounts,
        proportionalAmounts,
        priceImpact: investState.priceImpact,
        getInputAmount,
        setInputAmount,
        service,
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
