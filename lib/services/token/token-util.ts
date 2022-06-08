import {
    AmountHumanReadable,
    AmountHumanReadableMap,
    TokenAmountHumanReadable,
    TokenBase,
} from '~/lib/services/token/token-types';
import { map, pickBy } from 'lodash';
import numeral from 'numeral';

export function tokenGetAmountForAddress(
    address: string,
    tokenAmounts: TokenAmountHumanReadable[],
    defaultValue: string = '0',
) {
    return tokenAmounts.find((amount) => amount.address === address)?.amount || defaultValue;
}

export function tokenFindTokenAmountForAddress(
    address: string,
    tokenAmounts: TokenAmountHumanReadable[],
    defaultValue: string = '0',
): TokenAmountHumanReadable {
    return tokenAmounts.find((amount) => amount.address === address) || { address, amount: defaultValue };
}

export function tokenAmountsConcatenatedString(tokenAmounts: TokenAmountHumanReadable[], tokens: TokenBase[]): string {
    return tokenAmounts
        .map((tokenAmount) => {
            const token = tokens.find((token) => token.address === tokenAmount.address);

            return `${token?.symbol}: ${tokenAmount.amount}`;
        })
        .join(', ');
}

export function tokenAmountsGetArrayFromMap(amountMap: AmountHumanReadableMap): TokenAmountHumanReadable[] {
    return map(
        pickBy(amountMap, (amount) => amount !== ''),
        (amount, address) => ({ amount, address }),
    );
}

export function tokenFormatAmount(amount: AmountHumanReadable | number) {
    const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (amountNum < 0.000001 && amountNum >= 0) {
        return '0.00';
    } else if (amountNum < 1) {
        return numeral(amount).format('0.[000000]');
    } else if (amountNum < 10) {
        return numeral(amount).format('0.0[000]');
    } else if (amountNum < 100) {
        return numeral(amount).format('0.[0000]');
    } else if (amountNum < 5000) {
        return numeral(amount).format('0,0.[00]');
    }

    return numeral(amount).format('0,0');
}

export function tokenFormatAmountPrecise(amount: AmountHumanReadable | number, precision: 4 | 12 = 12) {
    const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (precision === 4) {
        if (amountNum < 0.0001) {
            return '< 0.0001';
        }

        return numeral(amount).format('0,0.[0000]');
    }

    return numeral(amount).format('0,0.[000000000000]');
}
