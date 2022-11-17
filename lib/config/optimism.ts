import { NetworkConfig } from '~/lib/config/network-config-type';

export const optimismNetworkConfig: NetworkConfig = {
    appName: 'Beethoven X',
    chainId: '10',
    networkName: 'Optimism Mainnet',
    networkShortName: 'Optimism',
    etherscanName: 'The Optimistic Explorer',
    etherscanUrl: 'https://optimistic.etherscan.io',
    testnet: false,
    eth: {
        name: 'Ether',
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        symbol: 'ETH',
        decimals: 18,
        iconUrl: 'https://optimistic.etherscan.io/images/svg/brands/optimism.svg?v=1.3',
    },
    wethAddress: '0x4200000000000000000000000000000000000006',
    wethAddressFormatted: '0x4200000000000000000000000000000000000006',
    coingecko: {
        nativeAssetId: 'optimism',
        platformId: 'optimism',
    },
    rpcUrl: 'https://rpc.ankr.com/optimism',
    multicall: '0x2dc0e2aa608532da689e89e237df582b783e552c',
    beets: {
        address: '0x97513e975a7fa9072c72c92d8000b0db90b163c5',
    },
    fbeets: {
        address: '',
        farmId: '',
        poolId: '',
    },
    balancer: {
        vault: '0xba12222222228d8ba445958a75a0704d566bf2c8',
        batchRelayer: '0x1a58897ab366082028ced3740900ecbd765af738',
        composableStableFactory: '0xf145cafb67081895ee80eb7c04a30cf87f07b745',
        weightedPoolV2Factory: '0xad901309d9e9dbc5df19c84f729f429f0189a633',
        linearFactories: {
            erc4626: ['0x4c4287b07d293e361281bceee8715c8cdeb64e34'],
            reaper: ['0x19968d4b7126904fd665ed25417599df9604df83', '0x0473136b0732606e826ffeb42f3abc81a7a766d5'],
        },
        linearRebalancers: {
            '0xba7834bb3cd2db888e6a06fb45e82b4225cd0c71': '0xdc9d37d76e7a782460f94ffd811d4e0579f04756', //usdc
            '0x9253d7e1b42fa01ede2c53f3a21b3b4d13239cd4': '0x1491b1bcb8e5b6608a984a3b56ad783bb4c5df49', //usdt
            '0x888a6195d42a95e80d81e1c506172772a80b80bc': '0x4065e8da096917987d99bce9c8e78a74c6abc7f1', //dai
            '0xdd89c7cd0613c1557b2daac6ae663282900204f1': '0x842afe129dcd4d2e1046a6491502e9495286d21e', //weth
            '0xd0d334b6cfd77acc94bab28c7783982387856449': '0x9b5eaeacee3b2121afed32238015f37ea4dc6f7e', //bal
            '0xa4e597c1bd01859b393b124ce18427aa4426a871': '0xfa0081569a9e5c80385f2ffb301db93288e53684', //op
            '0xa1a77e5d7d769bfbb790a08ec976dc738bf795b9': '0x2bce16d9e5bbaa737be124f7da16a5a7bc699bcb', //wbtc
            '0xc0d7013a05860271a1edb52415cf74bc85b2ace7': '0x87b57d325bc066890a400a5c88f34084a2454d91', //susd
        },
        reaperManualRebalancer: '0xf070996cf89cd3d2582705fc269f2c800e9a6a21',
    },
    beetsPoolOwnerAddress: '0xd9e2889ac8c6fff8e94c7c1beeade1352df1a513',
    masterChefContractAddress: '',
    defaultTokenIn: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
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
        rewardHelperAddress: '0x299dcdf14350999496204c141a0c20a29d71af3e',
    },
    createPoolUrl: 'https://opv1.beets.fi/#/pool-create',
    warnings: {
        poolDetail: {},
        poolInvest: {
            '0xb1c9ac57594e9b1ec0f3787d9f6744ef4cb0a02400000000000000000000006e':
                'To account for the USD+ and DAI+ deposit/withdraw fee, this pool will charge a fee on both invest and withdraw of up to 0.06%.',
        },
        poolWithdraw: {
            '0xb1c9ac57594e9b1ec0f3787d9f6744ef4cb0a02400000000000000000000006e':
                'To account for the USD+ and DAI+ deposit/withdraw fee, this pool will charge a fee on both invest and withdraw of up to 0.06%.',
        },
    },
};
