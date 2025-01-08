import { NetworkConfig } from '~/lib/config/network-config-type';
import { AddressZero } from '@ethersproject/constants';

export const sonicNetworkConfig: NetworkConfig = {
    appName: 'beets',
    chainId: '146',
    networkName: 'Sonic',
    networkShortName: 'Sonic',
    chainName: 'SONIC',
    etherscanName: 'Sonic Scan',
    etherscanUrl: 'https://sonicscan.org',
    testnet: false,
    eth: {
        name: 'Sonic',
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        symbol: 'S',
        decimals: 18,
        iconUrl: 'https://beethoven-assets.s3.eu-central-1.amazonaws.com/sonic.png',
        minGasAmount: '0.1',
    },
    wethAddress: '0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38',
    wethAddressFormatted: '0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38',
    coingecko: {
        nativeAssetId: 'sonic',
        platformId: 'sonic',
    },
    rpcUrl: 'https://rpc.soniclabs.com',
    multicall: '0xc07500b9fe7bea9efd5b54341d0aa3658a33d39a',
    beets: {
        address: '0x2d0e0814e62d80056181f5cd932274405966e4f0',
        migration: '0x5f9a5cd0b77155ac1814ef6cd9d82da53d05e386',
        oldAddress: '0x1e5fe95fb90ac0530f581c617272cd0864626795',
    },
    fbeets: {
        address: '0x10ac2f9dae6539e77e372adb14b1bf8fbd16b3e8', // not on sonic
        farmId: '0', // not on sonic
        poolId: '0x10ac2f9dae6539e77e372adb14b1bf8fbd16b3e8000200000000000000000005',
        poolAddress: '0x10ac2f9dae6539e77e372adb14b1bf8fbd16b3e8',
    },
    reliquary: {
        address: '0x973670ce19594f857a7cd85ee834c7a74a941684',
        fbeets: {
            poolId: '0x10ac2f9dae6539e77e372adb14b1bf8fbd16b3e8000200000000000000000005',
            poolAddress: '0x10ac2f9dae6539e77e372adb14b1bf8fbd16b3e8',
            farmId: 0,
            maxLevel: 10,
        },
    },
    sftmx: {
        address: '0xe5da20f15420ad15de0fa650600afc998bbe3955',
        ftmStakingProxyAddress: AddressZero,
    },
    snapshot: {
        contractAddress: '0x469788fe6e9e9681c6ebf3bf78e7fd26fc015446',
        delegateAddress: '0x641e10Cd6132D3e3FA01bfd65d2e0afCf64b136A', // MD delegator address case sensitive!
        id: '0x62656574732D6761756765732E65746800000000000000000000000000000000', // BeethovenX Snapshot id
    },
    balancer: {
        vault: '0xba12222222228d8ba445958a75a0704d566bf2c8',
        batchRelayer: '0x7b52d5ef006e59e3227629f97f182d6442380bb6',
        balToken: AddressZero,
        weightedPoolFactory: '0x22f5b7fdd99076f1f20f8118854ce3984544d56d',
        linearFactories: {
            erc4626: [],
            reaper: [],
        },
        linearRebalancers: {},
        reaperManualRebalancer: AddressZero,
        sorQueries: '0x2f4799933c34127e715839445ebc90d62cb3e4e6',
        balancerQueries: '0x4b29db997ec0efdfef13baee2a2d7783bcf67f17',
        unwrapExceptions: {
            reaper: [],
        },
        minimumBoost: 1.0,
    },
    rateproviders: { '0xe5da20f15420ad15de0fa650600afc998bbe3955': '0xe5da20f15420ad15de0fa650600afc998bbe3955' },
    beetsPoolOwnerAddress: '0x97079F7E04B535FE7cD3f972Ce558412dFb33946',
    masterChefContractAddress: '0x8166994d9ebBe5829EC86Bd81258149B87faCfd3',
    defaultTokenIn: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    defaultTokenOut: '0xf24bcf4d1e507740041c9cfd2dddb29585adce1e',
    farmTypeName: 'farm',
    additionalLinks: [],
    priceImpact: {
        invest: {
            noticeable: 0.005,
            high: 0.01,
        },
        trade: {
            noticeable: 0.01,
            high: 0.05,
        },
        withdraw: {
            noticeable: 0.005,
            high: 0.01,
        },
    },
    gauge: {
        rewardHelperAddress: AddressZero,
        balancerPseudoMinterAddress: AddressZero,
        veBALDelegationProxyAddress: AddressZero,
        workingBalanceHelperAddress: AddressZero,
        checkpointHelper: AddressZero,
    },
    createPoolUrl: 'https://v1.beets.fi/#/pool-create',
    stakeUrl: 'https://beets.fi/#/stake',
    warnings: {
        poolList: {},
        poolDetail: {},
        poolInvest: {},
        poolWithdraw: {},
    },
    poolBadgeTypes: {},
    thirdPartyStakingPools: [],
    rehypePools: [],
    pointsPools: [],
    investDisabled: {},
    maBeetsEnabled: true,
    claimAllRewardsEnabled: true,
    layerZeroChainId: -1,
    beetsMigrationEnabled: true,
    gaugeEnabled: false,
    sftmxEnabled: false,
};
