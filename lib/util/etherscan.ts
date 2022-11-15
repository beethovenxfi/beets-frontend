import { networkConfig } from '~/lib/config/network-config';

export function etherscanGetTokenUrl(tokenAddress: string): string {
    return `${networkConfig.etherscanUrl}/token/${tokenAddress}`;
}

export function etherscanGetAddressUrl(address: string): string {
    return `${networkConfig.etherscanUrl}/address/${address}`;
}

export function etherscanGetTxUrl(tx: string): string {
    return `${networkConfig.etherscanUrl}/tx/${tx}`;
}

export function etherscanGetBlockUrl(blockNumber: number): string {
    return `${networkConfig.etherscanUrl}/block/${blockNumber}`;
}

export function etherscanTxShortenForDisplay(txHash: string) {
    return txHash.slice(0, 12) + '...';
}

export function etherscanGetContractWriteUrl(address: string): string {
    return `${networkConfig.etherscanUrl}/address/${address}#writeContract`;
}

export function etherscanGetContractReadUrl(address: string): string {
    return `${networkConfig.etherscanUrl}/address/${address}#readContract`;
}
