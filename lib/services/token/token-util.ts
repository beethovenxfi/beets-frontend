import { AmountHumanReadableMap, TokenAmountHumanReadable, TokenBase } from '~/lib/services/token/token-types';
import { map, pickBy } from 'lodash';

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
