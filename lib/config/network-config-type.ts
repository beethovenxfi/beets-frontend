export interface NetworkConfig {
    appName: string;
    chainId: string;
    networkName: string;
    networkShortName: string;
    etherscanName: string;
    etherscanUrl: string;
    testnet: boolean;
    eth: {
        name: string;
        address: string;
        symbol: string;
        decimals: number;
        iconUrl: string;
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
        composableStableFactory: string;
        weightedPoolV2Factory: string;
        linearFactories: {
            erc4626: string[];
            reaper: string[];
        };
        linearRebalancers: { [poolAddress: string]: string };
        reaperManualRebalancer?: string;
    };
    beetsPoolOwnerAddress: string;
    masterChefContractAddress: string;
    defaultTokenIn: string;
    defaultTokenOut: string;
    additionalLinks: { url: string; title: string; subTitle?: string }[];
    farmTypeName: string;
    priceImpact: {
        invest: {
            noticeable: number;
            high: number;
        };
        trade: {
            noticeable: number;
            high: number;
        };
        withdraw: {
            noticeable: number;
            high: number;
        };
    };
    gauge: {
        rewardHelperAddress: string;
    };

    createPoolUrl: string;
    launchUrl?: string;
    stakeUrl?: string;
    warnings: {
        poolDetail: { [poolId: string]: string };
        poolInvest: { [poolId: string]: string };
        poolWithdraw: { [poolId: string]: string };
    };
}
