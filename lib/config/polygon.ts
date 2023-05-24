import { NetworkConfig } from '~/lib/config/network-config-type';
import { AddressZero } from '@ethersproject/constants';

export const polygonNetworkConfig: NetworkConfig = {
    appName: 'Balancer',
    chainId: '137',
    networkName: 'Polygon Mainnet',
    networkShortName: 'Polygon',
    chainName: 'POLYGON',
    etherscanName: 'polygonscan',
    etherscanUrl: 'https://polygonscan.com',
    testnet: false,
    eth: {
        name: 'Matic',
        address: '0x0000000000000000000000000000000000001010',
        symbol: 'MATIC',
        decimals: 18,
        iconUrl: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
    },
    wethAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    wethAddressFormatted: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    coingecko: {
        nativeAssetId: 'polygon-pos',
        platformId: 'polygon-pos',
    },
    rpcUrl: 'https://rpc.ankr.com/polygon',
    multicall: '0x275617327c958bd06b5d6b871e7f491d76113dd8',
    beets: {
        address: '',
    },
    fbeets: {
        address: '',
        farmId: '',
        poolId: '',
        poolAddress: '',
    },
    reliquary: {
        address: '',
        fbeets: {
            poolId: '',
            poolAddress: '',
            farmId: 0,
            maxLevel: 0,
        },
    },
    balancer: {
        vault: '0xba12222222228d8ba445958a75a0704d566bf2c8',
        batchRelayer: '0x1a58897ab366082028ced3740900ecbd765af738',
        composableStableFactories: ['0x7bc6c0e73edaa66ef3f6e2f27b0ee8661834c6c9'],
        composableStableV1Factory: '0x136fd06fa01ecf624c7f2b3cb15742c1339dc2c4',
        weightedPoolV2PlusFactories: [
            '0x0e39c3d9b2ec765efd9c5c70bb290b1fcd8536e3',
            '0x82e4cfaef85b1b6299935340c964c942280327f4',
            '0xfc8a407bba312ac761d8bfe04ce1201904842b76',
        ],
        linearFactories: {
            erc4626: [],
            reaper: [],
        },
        linearRebalancers: {},
        balancerQueries: '0xe39b5e3b6d74016b2f6a9673d7d7493b6df549d5',
        sorQueries: '',
        unwrapExceptions: {
            reaper: [],
        },
    },
    beetsPoolOwnerAddress: '0xcd983793adb846dce4830c22f30c7ef0c864a776',
    masterChefContractAddress: '0x8166994d9ebBe5829EC86Bd81258149B87faCfd3',
    defaultTokenIn: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    defaultTokenOut: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    farmTypeName: 'farm',
    additionalLinks: [
        {
            title: 'Vote',
            url: 'https://snapshot.org/#/beets.eth',
        },
        {
            title: 'Analytics',
            url: 'https://info.beets.fi',
        },
        {
            title: 'Docs & Help',
            url: 'https://docs.beets.fi',
        },
        {
            title: 'Github',
            url: 'https://github.com/beethovenxfi',
        },
        {
            title: 'Twitter',
            url: 'https://twitter.com/beethoven_x',
        },
        {
            title: 'Medium',
            url: 'https://beethovenxio.medium.com/',
        },
        {
            title: 'Discord',
            url: 'https://discord.gg/jedS4zGk28',
        },
        {
            title: 'Olympus Bonds',
            url: 'https://pro.olympusdao.finance/#/bond',
        },
        {
            title: 'Multichain Bridge',
            subTitle: 'ETH / AVAX / BSC / MATIC',
            url: 'https://app.multichain.org/#/router',
        },
        {
            title: 'AllBridge',
            subTitle: 'SOL / MATIC / CELO',
            url: 'https://app.allbridge.io/bridge?from=SOL&to=FTM&asset=SOL',
        },
    ],
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
    },
    createPoolUrl: 'https://v1.beets.fi/#/pool-create',
    //launchUrl: 'https://v1.beets.fi/#/launch',
    stakeUrl: 'https://beets.fi/#/stake',
    warnings: {
        poolList: {},
        poolDetail: {},
        poolInvest: {},
        poolWithdraw: {},
    },
    boostedByTypes: {},
    investDisabled: {},
    maBeetsEnabled: false,
    claimAllRewardsEnabled: false,
};
