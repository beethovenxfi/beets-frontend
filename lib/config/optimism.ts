import { NetworkConfig } from '~/lib/config/network-config-type';

export const optimismNetworkConfig: NetworkConfig = {
    appName: 'Beethoven X',
    chainId: '10',
    networkName: 'Optimism Mainnet',
    networkShortName: 'Optimism',
    etherscanName: 'The Optimistic Explorer',
    etherscanUrl: 'https://optimistic.etherscan.io/',
    testnet: false,
    eth: {
        name: 'Ether',
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        symbol: 'ETH',
        decimals: 18,
    },
    wethAddress: '0x4200000000000000000000000000000000000006',
    wethAddressFormatted: '0x4200000000000000000000000000000000000006',
    coingecko: {
        nativeAssetId: 'optimism',
        platformId: 'optimism',
    },
    rpcUrl: 'https://mainnet.optimism.io',
    multicall: '0x2DC0E2aa608532Da689e89e237dF582B783E552C',
    beets: {
        address: '0x97513e975a7fA9072c72C92d8000B0dB90b163c5',
    },
    fbeets: {
        address: '',
        farmId: '',
        poolId: '',
    },
    balancer: {
        vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
        batchRelayer: '0x0000000000000000000000000000000000000000',
    },
    beetsPoolOwnerAddress: '0xd9e2889ac8c6fff8e94c7c1beeade1352df1a513',
    masterChefContractAddress: '',
    defaultTokenIn: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    defaultTokenOut: '0x4200000000000000000000000000000000000006',
    farmTypeName: 'gauge',
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
        rewardHelperAddress: '0x299dcDF14350999496204c141A0c20A29d71AF3E',
    },
};
