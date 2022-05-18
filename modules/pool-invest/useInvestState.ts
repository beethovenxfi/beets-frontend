import { makeVar, useReactiveVar } from '@apollo/client';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { GqlPoolUnion, GqlPoolWeighted } from '~/apollo/generated/graphql-codegen-generated';
import { PoolWeightedService } from '~/lib/services/pool/pool-weighted.service';

interface InvestState {
    inputAmounts: { [address: string]: AmountHumanReadable };
    proportionalAmounts: { [address: string]: AmountHumanReadable };
}

export const investStateVar = makeVar<InvestState>({ inputAmounts: {}, proportionalAmounts: {} });

export function useInvestState(pool: GqlPoolUnion) {
    const investState = useReactiveVar(investStateVar);
    const service = new PoolWeightedService(pool as GqlPoolWeighted);

    function getInputAmount(tokenAddress: string) {
        return investState.inputAmounts[tokenAddress] || '0';
    }

    function setInputAmount(tokenAddress: string, amount: AmountHumanReadable) {
        investStateVar({
            ...investState,
            inputAmounts: {
                ...investState.inputAmounts,
                [tokenAddress]: amount,
            },
        });

        //TODO: this is fugly and a race condition
        if (pool.__typename === 'GqlPoolWeighted') {
            if (amount.length > 0) {
                service
                    .joinGetProportionalSuggestionForFixedAmount({ address: tokenAddress, amount })
                    .then((result) => {
                        investStateVar({
                            ...investState,
                            inputAmounts: {
                                ...investState.inputAmounts,
                                [tokenAddress]: amount,
                            },
                            proportionalAmounts: Object.fromEntries(result.map((item) => [item.address, item.amount])),
                        });
                    });
            } else {
                investStateVar({
                    ...investState,
                    inputAmounts: {
                        ...investState.inputAmounts,
                        [tokenAddress]: amount,
                    },
                    proportionalAmounts: {},
                });
            }
        }
    }

    return {
        investState,
        getInputAmount,
        setInputAmount,
        service,
    };
}
