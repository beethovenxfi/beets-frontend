export interface NetworkConfig {
    appName: string;
    chainId: string;
    networkName: string;
    etherscanName: string;
    etherscanUrl: string;
    testnet: boolean;
    eth: {
        name: string;
        address: string;
        symbol: string;
        decimals: number;
    };
    wethAddress: string;
    wethAddressFormatted: string;
    rpcUrl: string;
    coingecko: {
        nativeAssetId: string;
        platformId: string;
    };
    multicall: string;
    /*subgraphs: {
        balancer: string;
        blocks: string;
        masterchef: string;
        beetsBar: string;
        changelog: string;
        locking: string;
    };*/
    beets: {
        address: string;
    };
    fbeets: {
        address: string;
        farmId: string;
        poolId: string;
    };
    balancer: {
        vault: string;
        batchRelayer: string;
    };
    beetsPoolOwnerAddress: string;
    masterChefContractAddress: string;
    defaultTokenIn: string;
    defaultTokenOut: string;
}
