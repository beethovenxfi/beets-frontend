import OldBigNumber from 'bignumber.js';
import { parseUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { BigNumberish } from '@ethersproject/bignumber';

export function oldBnum(val: string | number | OldBigNumber): OldBigNumber {
    const number = typeof val === 'string' ? val : val ? val.toString() : '0';
    return new OldBigNumber(number);
}

export function oldBnumZero(): OldBigNumber {
    return oldBnum(0);
}

export function oldBnumScale(input: OldBigNumber | string, decimalPlaces: number): OldBigNumber {
    const unscaled = typeof input === 'string' ? new OldBigNumber(input) : input;
    const scalePow = new OldBigNumber(decimalPlaces.toString());
    const scaleMul = new OldBigNumber(10).pow(scalePow);
    return unscaled.times(scaleMul);
}

export function oldBnumScaleDown(input: OldBigNumber, decimalPlaces: number): OldBigNumber {
    const scalePow = new OldBigNumber(decimalPlaces.toString());
    const scaleMul = new OldBigNumber(10).pow(scalePow);
    return input.dividedBy(scaleMul);
}

/**
 * Sums and array of string numbers and returns as OldBigNumber
 */
export function oldBnumSum(amounts: string[]): OldBigNumber {
    return amounts.reduce((a, b) => oldBnum(a).plus(b), oldBnum(0));
}

export function oldBnumDenormAmount(amountHumanReadable: AmountHumanReadable, decimals: number = 18): OldBigNumber {
    return oldBnum(parseUnits(amountHumanReadable, decimals).toString());
}

export function oldBnumToBnum(num: OldBigNumber): BigNumber {
    return BigNumber.from(num.toString());
}

export function oldBnumFromBnum(num: BigNumber): OldBigNumber {
    return oldBnum(num.toString());
}

export function oldBnumsToBigNumberish(nums: OldBigNumber[]) {
    return nums.map((num) => num.toString());
}
