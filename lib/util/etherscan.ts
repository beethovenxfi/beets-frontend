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
