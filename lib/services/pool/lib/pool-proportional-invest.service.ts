import { sortBy } from 'lodash';
import {
    GqlPoolGyro,
    GqlPoolTokenComposableStableNestedUnion,
    GqlPoolTokenUnion,
    GqlPoolWeighted,
} from '~/apollo/generated/graphql-codegen-generated';
import { TokenAmountHumanReadable } from '../../token/token-types';
import { replaceEthWithWeth, replaceWethWithEth } from '../../token/token-util';
import { oldBnum, oldBnumScale, oldBnumSum, oldBnumToHumanReadable } from './old-big-number';
import OldBigNumber from 'bignumber.js';

export class PoolProportionalInvestService {
    constructor(private pool: GqlPoolWeighted | GqlPoolGyro) {}

    public updatePool(pool: GqlPoolWeighted | GqlPoolGyro) {
        this.pool = pool;
    }

    public async getProportionalSuggestion(userInvestTokenBalances: TokenAmountHumanReadable[]) {
        // loop through the pool tokens to find out which token (and amount) would give the smallest bptOut amount
        // so we can use that as the base to calculate the proportions of the other tokens
        const smallestBptOutAmount = sortBy(
            this.pool.tokens.map((token) => {
                if (token.__typename === 'GqlPoolTokenComposableStable') {
                    // another loop to find the smallest bptOut amount for the nested stable pool
                    const nestedTokens = token.pool.tokens.map((poolToken) => {
                        const bptOut = this.getBptOutForToken(
                            userInvestTokenBalances,
                            poolToken,
                            token.pool.totalShares,
                        );
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
                            this.calculateAmountIn(
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
                                this.calculateBptOut(this.pool.dynamicData.totalShares, amount, token.balance),
                            ),
                        ),
                        token: {
                            address: smallestNestedBptOutAmountArray[0].token?.address,
                            amount,
                        },
                    };
                } else {
                    // the function will take a 'GqlPoolToken'
                    const bptOut = this.getBptOutForToken(
                        userInvestTokenBalances,
                        token,
                        this.pool.dynamicData.totalShares,
                    );

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

    private getBptOutForToken(
        userInvestTokenBalances: TokenAmountHumanReadable[],
        poolToken: GqlPoolTokenUnion | GqlPoolTokenComposableStableNestedUnion,
        bptTotalSupply: string,
    ) {
        const investToken = userInvestTokenBalances.find(
            (balance) =>
                balance.address === poolToken.address || balance.address === replaceWethWithEth(poolToken.address),
        )!;

        // for the old weighted boosted pools only the 'selected' token is in the userInvestBalances
        // so we return null to filter out the other tokens in the invest service
        if (!investToken) {
            return null;
        }

        const decimals = poolToken.decimals;

        return {
            bptOut: this.calculateBptOut(
                bptTotalSupply,
                investToken.amount,
                poolToken.balance,
                poolToken.decimals,
                poolToken.priceRate,
            ),
            token: {
                ...investToken,
                decimals,
                balance: poolToken.balance,
            },
        };
    }

    private calculateBptOut(
        bptTotalSupply: string,
        amountIn: string,
        balance: string,
        decimals: number = 18,
        priceRate: string = '1.0',
    ) {
        const balanceScaled = oldBnumScale(balance, decimals).times(priceRate);
        const amountRatio = oldBnumScale(amountIn, decimals).div(balanceScaled);

        return oldBnumScale(bptTotalSupply, 18).times(amountRatio);
    }

    private calculateAmountIn(bptTotalSupply: string, bptIn: OldBigNumber, balance: string) {
        const bptRatio = bptIn.div(oldBnumScale(bptTotalSupply, 18));
        const amountIn = oldBnumScale(balance, 18).times(bptRatio);

        // return human readable so we can convert a sum to the correct decimals again (alternative?)
        return oldBnumToHumanReadable(amountIn);
    }
}
