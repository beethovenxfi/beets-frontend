import { sortBy, sum } from 'lodash';
import { GqlPoolWeighted } from '~/apollo/generated/graphql-codegen-generated';
import { TokenAmountHumanReadable } from '../../token/token-types';
import { replaceEthWithWeth } from '../../token/token-util';
import { getBptOutForToken, calculateAmountIn, calculateBptOut, calculateAmountInF, calculateBptOutF } from './util';
import { oldBnumSum, oldBnumToHumanReadable } from './old-big-number';

export class PoolProportionalInvestService {
    constructor(private pool: GqlPoolWeighted) {}

    public async getProportionalSuggestion(userInvestTokenBalances: TokenAmountHumanReadable[]) {
        // loop through the pool tokens to find out which token (and amount) would give the smallest bptOut amount
        // so we can use that as the base to calculate the proportions of the other tokens
        const smallestBptOutAmount = sortBy(
            this.pool.tokens.map((token) => {
                if (token.__typename === 'GqlPoolTokenPhantomStable') {
                    // another loop to find the smallest bptOut amount for the nested stable pool
                    // const nestedTokens = token.pool.tokens.map((poolToken) =>
                    //     getBptOutForToken(userInvestTokenBalances, poolToken, token.pool.totalShares),
                    // );

                    const nestedTokens = token.pool.tokens.map((poolToken) => {
                        const bptOut = getBptOutForToken(userInvestTokenBalances, poolToken, token.pool.totalShares);
                        return {
                            ...bptOut,
                            // need to sort on bptOutFloat
                            bptOutFloat: parseFloat(oldBnumToHumanReadable(bptOut.bptOut)),
                        };
                    });

                    const smallestNestedBptOutAmountArray = sortBy(nestedTokens, 'bptOutFloat');
                    //const smallestNestedBptOutAmountArray = sortBy(nestedTokens, 'bptOut');

                    // calculate the proportional amounts based on the smallest bpt token amount
                    // and sum them to get the 'amountIn' for the nested stable pool bptOut calculation

                    // const amount = sum(
                    //     smallestNestedBptOutAmountArray.map((nestedToken) =>
                    //         calculateAmountInF(
                    //             token.pool.totalShares,
                    //             smallestNestedBptOutAmountArray[0].bptOut.toString(),
                    //             nestedToken.token.balance,
                    //         ),
                    //     ),
                    // ).toFixed(smallestNestedBptOutAmountArray[0].token.decimals);

                    const amount = oldBnumSum(
                        smallestNestedBptOutAmountArray.map((nestedToken) =>
                            calculateAmountIn(
                                token.pool.totalShares,
                                smallestNestedBptOutAmountArray[0].bptOut,
                                nestedToken.token.balance,
                            ).toString(),
                        ),
                    ).toFixed(smallestNestedBptOutAmountArray[0].token.decimals || 18);

                    // return {
                    //     bptOut: calculateBptOutF(
                    //         this.pool.dynamicData.totalShares,
                    //         amount,
                    //         token.balance,
                    //         token.priceRate,
                    //     ),
                    //     token: {
                    //         address: smallestNestedBptOutAmountArray[0].token.address,
                    //         amount,
                    //     },
                    // };

                    return {
                        // need to sort on bptOut
                        bptOut: parseFloat(
                            oldBnumToHumanReadable(
                                calculateBptOut(this.pool.dynamicData.totalShares, amount, token.balance),
                            ),
                        ),
                        token: {
                            address: smallestNestedBptOutAmountArray[0].token.address,
                            amount,
                        },
                    };
                } else {
                    // the function will take either 'GqlPoolToken' or 'GqlPoolTokenLinear'
                    //return getBptOutForToken(userInvestTokenBalances, token, this.pool.dynamicData.totalShares);

                    const bptOut = getBptOutForToken(userInvestTokenBalances, token, this.pool.dynamicData.totalShares);
                    return {
                        ...bptOut,
                        // need to sort on bptOut
                        bptOut: parseFloat(oldBnumToHumanReadable(bptOut.bptOut)),
                    };
                }
            }),
            'bptOut',
        );

        const fixedAmount = {
            amount: smallestBptOutAmount[0].token.amount,
            address: replaceEthWithWeth(smallestBptOutAmount[0].token.address || ''),
        };

        return fixedAmount;
    }
}
