import { networkConfig } from '~/lib/config/network-config';

export function etherscanGetTokenUrl(tokenAddress: string): string {
    return `${networkConfig.etherscanUrl}/token/${tokenAddress}`;
}
