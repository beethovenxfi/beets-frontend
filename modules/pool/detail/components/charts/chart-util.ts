export function chartGetPrimaryColor(chainId: string, opacity: number) {
    if (chainId === '10') {
        return `rgba(5, 214, 144, ${opacity})`;
    }

    return `rgba(5, 214, 144, ${opacity})`;
}

export function chartGetSecondaryColor(chainId: string, opacity: number) {
    if (chainId === '10') {
        return `rgba(0, 255, 255, ${opacity})`;
    }

    return `rgba(143, 147, 214, ${opacity})`;
}
