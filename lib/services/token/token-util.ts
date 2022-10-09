import {
    AmountHumanReadable,
    AmountHumanReadableMap,
    TokenAmountHumanReadable,
    TokenBase,
} from '~/lib/services/token/token-types';
import { map, pickBy } from 'lodash';
import numeral from 'numeral';
import { networkConfig } from '~/lib/config/network-config';
import { AddressZero } from '@ethersproject/constants';

export function tokenGetAmountForAddress(
    address: string,
    tokenAmounts: TokenAmountHumanReadable[],
    defaultValue: string = '0',
) {
    return tokenAmounts.find((amount) => amount.address === address.toLowerCase())?.amount || defaultValue;
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
        .filter((tokenAmount) => parseFloat(tokenAmount.amount) > 0)
        .map((tokenAmount) => {
            const token = tokens.find((token) => token.address === tokenAmount.address);

            return `${tokenFormatAmount(tokenAmount.amount)} ${token?.symbol}`;
        })
        .join(', ');
}

export function tokenAmountsGetArrayFromMap(amountMap: AmountHumanReadableMap): TokenAmountHumanReadable[] {
    return map(
        pickBy(amountMap, (amount) => amount !== ''),
        (amount, address) => ({ amount, address }),
    );
}

export function tokenFormatAmount(amount: AmountHumanReadable | number, isDust = true) {
    const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (typeof amount === 'string' && amount.includes('e') && !isDust) {
        const fixedNum = parseFloat(amount.split('-')[1]);
        return amountNum.toFixed(fixedNum);
    } else if (amountNum < 0.000001 && amountNum >= 0) {
        return '0.00';
    } else if (amountNum < 1) {
        return numeral(amount).format('0.[000000]');
    } else if (amountNum < 10) {
        return numeral(amount).format('0.0[000]');
    } else if (amountNum < 100) {
        return numeral(amount).format('0.[0000]');
    } else if (amountNum < 5000) {
        return numeral(amount).format('0,0.[00]');
    } else {
        return numeral(amount).format('0,0');
    }
}

export function tokenFormatAmountPrecise(amount: AmountHumanReadable | number, precision: number = 12) {
    const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (amountNum === 0) {
        return '0.0';
    }

    if (precision <= 4) {
        if (amountNum < 0.0001) {
            return '< 0.0001';
        }

        return numeral(amount).format('0,0.[0000]');
    } else if (precision <= 6) {
        if (amountNum < 0.000001) {
            return '< 0.000001';
        }

        return numeral(amount).format('0,0.[000000]');
    } else if (precision <= 8) {
        if (amountNum < 0.000001) {
            return amount;
        }

        return numeral(amount).format('0,0.[0000000000]');
    }

    return numeral(amount).format('0,0.[000000000000]');
}

export function isEth(address: string) {
    return address.toLowerCase() === networkConfig.eth.address.toLowerCase();
}

export function isWeth(address: string) {
    return address.toLowerCase() === networkConfig.wethAddress;
}

export function replaceEthWithWeth(address: string) {
    if (address.toLowerCase() === networkConfig.eth.address.toLowerCase()) {
        return networkConfig.wethAddress;
    }

    return address;
}

export function replaceWethWithEth(address: string) {
    if (address.toLowerCase() === networkConfig.wethAddress.toLowerCase()) {
        return networkConfig.eth.address.toLowerCase();
    }

    return address;
}

export function replaceWethWithZeroAddress(addresses: string[]): string[] {
    return addresses.map((address) => (address.toLowerCase() === networkConfig.wethAddress ? AddressZero : address));
}

export function replaceEthWithZeroAddress(addresses: string[]): string[] {
    return addresses.map((address) => (isEth(address) ? AddressZero : address));
}

export function replaceEthWithZeroAddressInTokenAmounts(
    tokenAmounts: TokenAmountHumanReadable[],
): TokenAmountHumanReadable[] {
    return tokenAmounts.map(({ address, amount }) => ({
        amount,
        address: isEth(address) ? AddressZero : address,
    }));
}
