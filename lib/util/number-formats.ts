import numeral from 'numeral';

export function numberFormatUSDValue(value: string | number) {
    const valueNum = typeof value === 'string' ? parseFloat(value) : value;

    if (valueNum < 0.01) {
        return '$0.00';
    }

    return numeral(valueNum).format('$0,0.00');
}
