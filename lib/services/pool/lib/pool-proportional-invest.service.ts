import { sortBy } from 'lodash';
import { GqlPoolWeighted } from '~/apollo/generated/graphql-codegen-generated';
import { TokenAmountHumanReadable } from '../../token/token-types';
import { replaceEthWithWeth } from '../../token/token-util';
import { getBptOutForToken, calculateAmountIn, calculateBptOut } from './util';
import { oldBnum, oldBnumSum, oldBnumToHumanReadable } from './old-big-number';

export class PoolProportionalInvestService {
    constructor(private pool: GqlPoolWeighted) {}

    public async getProportionalSuggestion(userInvestTokenBalances: TokenAmountHumanReadable[]) {
        // loop through the pool tokens to find out which token (and amount) would give the smallest bptOut amount
        // so we can use that as the base to calculate the proportions of the other tokens
        const smallestBptOutAmount = sortBy(
            this.pool.tokens.map((token) => {
                if (token.__typename === 'GqlPoolTokenPhantomStable') {
                    // another loop to find the smallest bptOut amount for the nested stable pool
                    const nestedTokens = token.pool.tokens.map((poolToken) => {
                        const bptOut = getBptOutForToken(userInvestTokenBalances, poolToken, token.pool.totalShares);
                        return {
                            ...bptOut,
                            // need to sort on bptOutFloat
                            bptOutFloat: bptOut && parseFloat(oldBnumToHumanReadable(bptOut.bptOut)),
                        };
                    });

                    // need to sort on bptOutFloat
                    const smallestNestedBptOutAmountArray = sortBy(nestedTokens, 'bptOutFloat').filter(Boolean);

                    // calculate the proportional amounts based on the smallest bpt token amount
                    // and sum them to get the 'amountIn' for the nested stable pool bptOut calculation
                    const amount = oldBnumSum(
                        smallestNestedBptOutAmountArray.map((nestedToken) =>
                            calculateAmountIn(
                                token.pool.totalShares,
                                smallestNestedBptOutAmountArray[0].bptOut || oldBnum(0),
                                nestedToken.token?.balance || '0',
                            ).toString(),
                        ),
                    ).toFixed(smallestNestedBptOutAmountArray[0].token?.decimals || 18);

                    return {
                        // need to sort on bptOut
                        bptOut: parseFloat(
                            oldBnumToHumanReadable(
                                calculateBptOut(this.pool.dynamicData.totalShares, amount, token.balance),
                            ),
                        ),
                        token: {
                            address: smallestNestedBptOutAmountArray[0].token?.address,
                            amount,
                        },
                    };
                } else {
                    // the function will take either 'GqlPoolToken' or 'GqlPoolTokenLinear'
                    const bptOut = getBptOutForToken(userInvestTokenBalances, token, this.pool.dynamicData.totalShares);

                    return {
                        ...bptOut,
                        // need to sort on bptOut
                        bptOut: bptOut && parseFloat(oldBnumToHumanReadable(bptOut.bptOut)),
                    };
                }
            }),
            'bptOut',
        );

        const fixedAmount = {
            amount: smallestBptOutAmount[0].token?.amount || '0',
            address: replaceEthWithWeth(smallestBptOutAmount[0].token?.address || ''),
        };

        return fixedAmount;
    }
}
