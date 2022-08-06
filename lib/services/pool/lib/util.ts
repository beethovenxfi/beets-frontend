import { GqlPoolTokenBase } from '~/apollo/generated/graphql-codegen-generated';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { oldBnum, oldBnumScaleAmount, oldBnumZero } from '~/lib/services/pool/lib/old-big-number';
import OldBigNumber from 'bignumber.js';
import { BigNumber } from 'ethers';
import { formatUnits, parseUnits } from '@ethersproject/units';

export function poolScaleAmp(amp: string): BigNumber {
    // amp is stored with 3 decimals of precision
    return parseUnits(amp, 3);
}

export function oldBnumPoolScaleTokenAmounts(
    tokenAmounts: TokenAmountHumanReadable[],
    poolTokens: GqlPoolTokenBase[],
): OldBigNumber[] {
    return poolTokens.map((poolToken) => {
        const amount = tokenAmounts.find((amount) => amount.address === poolToken.address);

        return amount ? oldBnumScaleAmount(amount.amount, poolToken.decimals) : oldBnumZero();
    });
}

export function poolScaleTokenAmounts(
    tokenAmounts: TokenAmountHumanReadable[],
    poolTokens: GqlPoolTokenBase[],
): BigNumber[] {
    return poolTokens.map((poolToken) => {
        const amount = tokenAmounts.find((amount) => amount.address === poolToken.address);

        return amount ? parseUnits(amount.amount, poolToken.decimals) : BigNumber.from(0);
    });
}

export function poolGetRequiredToken(address: string, tokens: GqlPoolTokenBase[]): GqlPoolTokenBase {
    const token = tokens.find((token) => token.address === address.toLowerCase());

    if (!token) {
        throw new Error(`Token with address does not exist in pool: ${address}`);
    }

    return token;
}

export function poolGetProportionalJoinAmountsForFixedAmount(
    fixedTokenAmount: TokenAmountHumanReadable,
    poolTokens: GqlPoolTokenBase[],
): TokenAmountHumanReadable[] {
    const fixedToken = poolGetRequiredToken(fixedTokenAmount.address, poolTokens);
    const fixedAmountScaled = parseUnits(fixedTokenAmount.amount, fixedToken.decimals);
    const fixedTokenBalance = parseUnits(fixedToken.balance, fixedToken.decimals);

    return poolTokens.map((token) => {
        if (token.address === fixedTokenAmount.address) {
            return { address: token.address, amount: fixedTokenAmount.amount };
        }

        const tokenBalance = parseUnits(token.balance, token.decimals);
        const tokenProportionalAmount = fixedAmountScaled.mul(tokenBalance).div(fixedTokenBalance);

        return {
            address: token.address,
            amount: formatUnits(tokenProportionalAmount, token.decimals),
        };
    });
}

export function poolGetProportionalExitAmountsForBptIn(
    bptInHumanReadable: AmountHumanReadable,
    poolTokens: GqlPoolTokenBase[],
    poolTotalShares: AmountHumanReadable,
): TokenAmountHumanReadable[] {
    const bptInAmountScaled = parseUnits(bptInHumanReadable, 18);
    const bptTotalSupply = parseUnits(poolTotalShares, 18);

    return poolTokens.map((token) => {
        const tokenBalance = parseUnits(token.balance, token.decimals);
        const tokenProportionalAmount = bptInAmountScaled.mul(tokenBalance).div(bptTotalSupply);

        return {
            address: token.address,
            amount: formatUnits(tokenProportionalAmount, token.decimals),
        };
    });
}
