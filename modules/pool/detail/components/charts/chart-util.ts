import { networkConfig } from '~/lib/config/network-config';

export function chartGetPrimaryColor(opacity: number) {
    if (networkConfig.chainId === '10') {
        return `rgba(119, 119, 119, ${opacity})`;
    }

    return `rgba(88, 95, 198, ${opacity})`;
}

export function chartGetSecondaryColor(opacity: number) {
    if (networkConfig.chainId === '10') {
        return `rgba(0, 255, 255, ${opacity})`;
    }

    return `rgba(143, 147, 214, ${opacity})`;
}
