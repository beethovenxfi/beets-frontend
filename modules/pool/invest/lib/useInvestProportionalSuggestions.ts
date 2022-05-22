import { usePool } from '~/modules/pool/lib/usePool';
import { useReactiveVar } from '@apollo/client';
import { investStateVar } from '~/modules/pool/invest/lib/useInvestState';
import { AmountHumanReadableMap } from '~/lib/services/token/token-types';
import { useState } from 'react';
import { pickBy } from 'lodash';
import { useAsyncEffect } from '~/lib/util/custom-hooks';

export function useInvestProportionalSuggestions() {
    const { poolService } = usePool();
    const { inputAmounts } = useReactiveVar(investStateVar);
    const [proportionalAmounts, setProportionalAmounts] = useState<AmountHumanReadableMap>({});
    const [loading, setLoading] = useState(false);
    const hasProportionalSuggestions = Object.keys(proportionalAmounts).length > 0;

    useAsyncEffect(async () => {
        const inputAmountsWithValue = pickBy(inputAmounts, (amount) => amount !== '');
        const addressesWithValue = Object.keys(inputAmountsWithValue);

        if (addressesWithValue.length > 0 && poolService.joinGetProportionalSuggestionForFixedAmount) {
            const address = addressesWithValue[0];

            try {
                setLoading(true);
                const result = await poolService.joinGetProportionalSuggestionForFixedAmount({
                    address,
                    amount: inputAmountsWithValue[address],
                });

                const proportionalSuggestion = Object.fromEntries(result.map((item) => [item.address, item.amount]));

                if (isProportionalSuggestionValid(inputAmounts, proportionalSuggestion)) {
                    setProportionalAmounts(proportionalSuggestion);
                } else {
                    setProportionalAmounts({});
                }
            } catch {}
            setLoading(false);
        } else if (
            addressesWithValue.length === 0 ||
            !isProportionalSuggestionValid(inputAmounts, proportionalAmounts)
        ) {
            setProportionalAmounts({});
        }
    }, [inputAmounts]);

    return {
        proportionalAmounts,
        hasProportionalSuggestions,
        loading,
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
