import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';

export function tokenGetAmountForAddress(
    address: string,
    tokenAmounts: TokenAmountHumanReadable[],
    defaultValue: string = '0',
) {
    return tokenAmounts.find((amount) => amount.address === address)?.amount || defaultValue;
}
