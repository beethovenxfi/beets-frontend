export function chartGetPrimaryColor(chainId: string, opacity: number) {
    if (chainId === '10') {
        return `rgba(119, 119, 119, ${opacity})`;
    }

    return `rgba(88, 95, 198, ${opacity})`;
}

export function chartGetSecondaryColor(chainId: string, opacity: number) {
    if (chainId === '10') {
        return `rgba(0, 255, 255, ${opacity})`;
    }

    return `rgba(143, 147, 214, ${opacity})`;
}
