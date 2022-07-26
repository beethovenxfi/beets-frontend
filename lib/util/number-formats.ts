import numeral from 'numeral';

export function numberFormatUSDValue(value: string | number) {
    const valueNum = typeof value === 'string' ? parseFloat(value) : value;

    if (valueNum < 0.0001) {
        return '$0.00';
    } else if (valueNum < 1) {
        return numeral(valueNum).format('$0.00[00]');
    } else if (valueNum > 10000) {
        return numeral(valueNum).format('$0,0');
    }

    return numeral(valueNum).format('$0,0.00');
}

export function numberLimitInputToNumDecimals(value: string, decimals = 18) {
    const split = value.split('.');

    if (split[1] && split[1].length > decimals) {
        return `${split[0]}.${split[1].slice(0, decimals)}`;
    }

    return value;
}

export function numberFormatLargeUsdValue(value: string | number) {
    const valueNum = typeof value === 'string' ? parseFloat(value) : value;

    if (valueNum < 0.001) {
        return '$0.00';
    }

    return numeral(value).format('$0.00a');
}

export function numberFormatLargeValue(value: string | number) {
    const valueNum = typeof value === 'string' ? parseFloat(value) : value;

    if (valueNum < 0.001) {
        return '0';
    } else if (valueNum < 1000) {
        return valueNum;
    }

    return numeral(value).format('0.00a');
}
