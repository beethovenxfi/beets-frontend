import { getAddress } from 'ethers/lib/utils';

export function addressesMatch(address1: string, address2: string) {
    return address1.toLowerCase() === address2.toLowerCase();
}

export function addressShortDisplayName(address: string) {
    const formatted = getAddress(address);

    return `${formatted.slice(0, 4)}...${formatted.slice(-4)}`;
}
