import { KeyboardEvent } from 'react';

export function tokenInputBlockInvalidCharacters(event: KeyboardEvent<HTMLInputElement>): void {
    ['e', 'E', '+', '-'].includes(event.key) && event.preventDefault();
}

export function tokenInputTruncateDecimalPlaces(value: string, decimalPlaces: number): string {
    if (value.includes('.')) {
        const [leftDigits, rightDigits] = value.split('.');

        if (rightDigits && rightDigits.length > decimalPlaces) {
            const maxLength = leftDigits.length + decimalPlaces + 1;

            return value.slice(0, maxLength);
        }
    }

    return value;
}
