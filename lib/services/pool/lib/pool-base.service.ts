import { GqlPoolBase, GqlPoolTokenBase, GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import OldBigNumber from 'bignumber.js';
import { oldBnum, oldBnumScaleAmount, oldBnumFromBnum, oldBnumZero } from '~/lib/services/pool/lib/old-big-number';
import { poolGetRequiredToken, poolScaleAmp } from '~/lib/services/pool/lib/util';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { parseUnits } from 'ethers/lib/utils';
import { isSameAddress } from '@balancer-labs/sdk';
import { AddressZero } from '@ethersproject/constants';

export class PoolBaseService {
    constructor(private pool: GqlPoolUnion, private readonly wethAddress: string) {}

    public updatePool(pool: GqlPoolUnion) {
        this.pool = pool;
    }

    public get totalSharesScaled(): OldBigNumber {
        return oldBnumScaleAmount(this.pool.dynamicData.totalShares);
    }

    public get swapFeeScaled(): OldBigNumber {
        return oldBnumScaleAmount(this.pool.dynamicData.swapFee);
    }

    public get tokenBalancesScaled(): OldBigNumber[] {
        return this.pool.tokens.map((token) => oldBnumScaleAmount(token.balance, token.decimals));
    }

    public get tokenWeightsScaled(): OldBigNumber[] {
        return this.pool.tokens.map((token) => oldBnumScaleAmount(token.weight || '0', 18));
    }

    public get priceRatesScaled(): OldBigNumber[] {
        return this.pool.tokens.map((token) => oldBnumScaleAmount(token.priceRate, 18));
    }

    public get ampScaled(): OldBigNumber {
        if (
            this.pool.__typename === 'GqlPoolPhantomStable' ||
            this.pool.__typename === 'GqlPoolStable' ||
            this.pool.__typename === 'GqlPoolMetaStable'
        ) {
            return oldBnumFromBnum(poolScaleAmp(this.pool.amp));
        }

        return oldBnumZero();
    }

    public get tokenBalancesScaledTo18Decimals(): OldBigNumber[] {
        return this.pool.tokens.map((token) =>
            this.scaleTo18AndApplyPriceRate({
                address: token.address,
                amount: token.balance,
            }),
        );
    }

    public scaleTokenAmountsTo18Decimals(tokenAmounts: TokenAmountHumanReadable[]): OldBigNumber[] {
        return this.pool.tokens.map((poolToken) => {
            const tokenAmount = tokenAmounts.find((amount) => amount.address === poolToken.address);

            if (!tokenAmount) {
                return oldBnumZero();
            }

            return tokenAmount ? this.scaleTo18AndApplyPriceRate(tokenAmount) : oldBnumZero();
        });
    }

    public scaleTo18AndApplyPriceRate(tokenAmount: TokenAmountHumanReadable): OldBigNumber {
        const token = poolGetRequiredToken(tokenAmount.address, this.pool.tokens);

        const denormAmount = oldBnum(parseUnits(tokenAmount.amount, 18).toString())
            .times(token.priceRate)
            .toFixed(0, OldBigNumber.ROUND_UP);

        return oldBnum(denormAmount);
    }

    public scaleTokenAmountDownFrom18Decimals(
        token: GqlPoolTokenBase,
        tokenAmount18decimals: OldBigNumber,
        rounding: OldBigNumber.RoundingMode,
    ): OldBigNumber {
        const amountAfterPriceRate = oldBnum(tokenAmount18decimals).div(token.priceRate).toString();

        const normalizedAmount = oldBnum(amountAfterPriceRate)
            .div(parseUnits('1', 18).toString())
            .toFixed(token.decimals, rounding);
        const scaledAmount = parseUnits(normalizedAmount, token.decimals);

        return oldBnum(scaledAmount.toString());
    }

    public wethToZero(address: string) {
        return isSameAddress(address, this.wethAddress) ? AddressZero : address;
    }
}
