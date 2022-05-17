import { BigNumber } from 'ethers';

export interface TokenAmountHumanReadable {
    address: string;
    amount: string;
}

export interface TokenAmountScaled {
    address: string;
    amount: BigNumber;
}

export type AmountHumanReadable = string;
export type AmountScaled = BigNumber;
