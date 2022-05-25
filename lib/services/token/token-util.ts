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

    if (amountNum < 1) {
        return numeral(amount).format('0.[000000]');
    } else if (amountNum < 10) {
        return numeral(amount).format('0.[0000]');
    } else if (amountNum < 100) {
        return numeral(amount).format('0.[0000]');
    } else if (amountNum < 1000) {
        return numeral(amount).format('0,0.[00]');
    }

    return numeral(amount).format('0,0');
}
