import { KeyboardEvent } from 'react';

export function tokenInputBlockInvalidCharacters(event: KeyboardEvent<HTMLInputElement>): void {
    ['e', 'E', '+', '-'].includes(event.key) && event.preventDefault();
}

export function tokenInputTruncateDecimalPlaces(value: string, decimalPlaces: number): string {
    const maxChars = 21;
    if (value.includes('.')) {
        const [leftDigits, rightDigits] = value.split('.');

        const rightDigitsNew =
            rightDigits && rightDigits.length > decimalPlaces ? rightDigits.slice(0, decimalPlaces) : rightDigits;

        if (leftDigits.length + rightDigitsNew.length + 1 > maxChars) {
            return value.slice(0, maxChars);
        } else {
            return `${leftDigits}.${rightDigitsNew}`;
        }
    }

    return value.slice(0, maxChars);
}
