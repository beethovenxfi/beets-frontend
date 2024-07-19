import { GqlChain } from '~/apollo/generated/graphql-codegen-generated';
export type PoolBadgeType =
    | 'reaper-aave'
    | 'reaper-aave-granary'
    | 'yearn'
    | 'reaper-sonne'
    | 'overnight'
    | 'reaper'
    | 'beefy-exactly'
    | 'gyroscope'
    | 'experimental';

export interface PoolDetailWarning {
    id: string;
    message: string;
    type: 'info' | 'warning' | 'error';
    link?: {
        url: string;
        text: string;
    };
}

export interface ThirdPartyStakingPool {
    poolId: string;
    url: string;
    name: string;
}

export interface rehypePool {
    poolId: string;
    url: string;
    buttonText: string;
}

export interface PointsPool {
    poolId: string;
    textString: string;
}

export interface NetworkConfig {
    appName: string;
    chainId: string;
    networkName: string;
    chainName: GqlChain;
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
        minGasAmount: string;
    };
    wethAddress: string;
    wethAddressFormatted: string;
    rpcUrl: string;
    coingecko: {
        nativeAssetId: string;
        platformId: string;
    };
    multicall: string;
    beets: {
        address: string;
        migration: string;
        oldAddress: string;
    };
    fbeets: {
        address: string;
        farmId: string;
        poolId: string;
        poolAddress: string;
    };
    reliquary: {
        address: string;
        fbeets: {
            poolAddress: string;
            poolId: string;
            farmId: number;
            maxLevel: number;
        };
    };
    sftmx: {
        address: string;
        ftmStakingProxyAddress: string;
    };
    snapshot: {
        contractAddress: string;
        delegateAddress: string;
        id: string;
    };
    balancer: {
        vault: string;
        batchRelayer: string;
        balToken: string;
        weightedPoolFactory: string;
        linearFactories: {
            erc4626: string[];
            reaper: string[];
        };
        linearRebalancers: { [poolAddress: string]: string };
        reaperManualRebalancer?: string;
        sorQueries: string;
        balancerQueries: string;
        unwrapExceptions: {
            reaper: string[];
        };
        minimumBoost: number;
    };
    rateproviders: { [tokenAddress: string]: string };
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
        balancerPseudoMinterAddress: string;
        veBALDelegationProxyAddress: string;
        workingBalanceHelperAddress: string;
        checkpointHelper: string;
    };
    createPoolUrl: string;
    stakeUrl?: string;
    warnings: {
        poolDetail: { [poolId: string]: PoolDetailWarning };
        poolInvest: { [poolId: string]: string };
        poolWithdraw: { [poolId: string]: string };
        poolList: { [poolId: string]: string };
    };
    investDisabled: { [poolId: string]: boolean };
    poolBadgeTypes: {
        [poolId: string]: PoolBadgeType;
    };
    thirdPartyStakingPools: ThirdPartyStakingPool[];
    rehypePools: rehypePool[];
    pointsPools: PointsPool[];
    maBeetsEnabled: boolean;
    claimAllRewardsEnabled: boolean;
    layerZeroChainId: number;
    beetsMigrationEnabled: boolean;
    gaugeEnabled: boolean;
    sftmxEnabled: boolean;
}
