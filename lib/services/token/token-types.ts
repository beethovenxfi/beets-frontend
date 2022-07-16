import { BigNumber } from 'ethers';

export interface TokenAmountHumanReadable {
    address: string;
    amount: string;
}

export interface TokenAmountScaled {
    address: string;
    amount: BigNumber;
}

export interface TokenBase {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
}

export interface TokenBaseWithAmount extends TokenBase {
    amount: string;
}

export type AmountHumanReadable = string;
export type AmountScaled = BigNumber;
export type AmountScaledString = string;

export type BalanceMap = Map<string, AmountHumanReadable>;

export interface AmountHumanReadableMap {
    [address: string]: AmountHumanReadable;
}
