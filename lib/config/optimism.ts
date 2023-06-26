import { NetworkConfig } from '~/lib/config/network-config-type';

export const optimismNetworkConfig: NetworkConfig = {
    appName: 'Beethoven X',
    chainId: '10',
    networkName: 'Optimism Mainnet',
    networkShortName: 'Optimism',
    chainName: 'OPTIMISM',
    etherscanName: 'The Optimistic Explorer',
    etherscanUrl: 'https://optimistic.etherscan.io',
    testnet: false,
    eth: {
        name: 'Ether',
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        symbol: 'ETH',
        decimals: 18,
        iconUrl: 'https://optimistic.etherscan.io/images/svg/brands/optimism.svg?v=1.3',
        minGasAmount: '0.0005',
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
        batchRelayer: '0x03f1ab8b19bce21eb06c364aec9e40322572a1e9',
        balToken: '0xfe8b128ba8c78aabc59d4c64cee7ff28e9379921',
        composableStableFactories: [
            '0xf145cafb67081895ee80eb7c04a30cf87f07b745',
            '0xe2e901ab09f37884ba31622df3ca7fc19aa443be',
        ],
        composableStableV1Factory: '0xf145cafb67081895ee80eb7c04a30cf87f07b745',
        weightedPoolV2PlusFactories: [
            '0xad901309d9e9dbc5df19c84f729f429f0189a633',
            '0x230a59f4d9adc147480f03b0d3fffecd56c3289a',
        ],
        linearFactories: {
            erc4626: ['0x4c4287b07d293e361281bceee8715c8cdeb64e34'],
            reaper: [
                '0x19968d4b7126904fd665ed25417599df9604df83',
                '0x0473136b0732606e826ffeb42f3abc81a7a766d5',
                '0xe4b88e745dce9084b9fc2439f85a9a4c5cd6f361',
            ],
        },
        linearRebalancers: {
            '0xba7834bb3cd2db888e6a06fb45e82b4225cd0c71': '0xdc9d37d76e7a782460f94ffd811d4e0579f04756', // usdc
            '0x9253d7e1b42fa01ede2c53f3a21b3b4d13239cd4': '0x1491b1bcb8e5b6608a984a3b56ad783bb4c5df49', // usdt
            '0x888a6195d42a95e80d81e1c506172772a80b80bc': '0x4065e8da096917987d99bce9c8e78a74c6abc7f1', // dai
            '0xdd89c7cd0613c1557b2daac6ae663282900204f1': '0x842afe129dcd4d2e1046a6491502e9495286d21e', // weth
            '0xd0d334b6cfd77acc94bab28c7783982387856449': '0x9b5eaeacee3b2121afed32238015f37ea4dc6f7e', // bal
            '0xa4e597c1bd01859b393b124ce18427aa4426a871': '0xfa0081569a9e5c80385f2ffb301db93288e53684', // op
            '0xa1a77e5d7d769bfbb790a08ec976dc738bf795b9': '0x2bce16d9e5bbaa737be124f7da16a5a7bc699bcb', // wbtc
            '0xc0d7013a05860271a1edb52415cf74bc85b2ace7': '0x87b57d325bc066890a400a5c88f34084a2454d91', // susd
            '0x62ec8b26c08ffe504f22390a65e6e3c1e45e9877': '0x573f1fbde18ab2926a5e3fb80467ae50cf91d3f6', // soDAI
            '0xb96c5bada4bf6a70e71795a3197ba94751dae2db': '0xbac75e5e03c68c3a9e0c200462d38440d8ffea45', // soUSDT
            '0xedcfaf390906a8f91fb35b7bac23f3111dbaee1c': '0xe61b872d223362facb9fcbce359a56764bccfa36', // soUSDC
            '0xdc2007d9e9a33f50630f26069faab69c25f7758c': '0xd01e860e811a2942c1222586971a71d764bdd8c1', // rfUSDC
            '0xbef1ccaada458a570c37b11a8872988ba1e4fdb9': '0xcb1ab294279078c5cf65406dd32083100c015325', // rfUSDT
            '0x8fe33d737484ca194dedf64aafa8485327fc5372': '0xe243be0c0ec53f74ed0ee2171fd070e656f4b48f', // rfDAI
            '0x8003eec4add35c6d23eb1ef61b4fa6bbbb23a41a': '0xc2bf5c38ebbcb9a710822f1ba2235e88ce51bc3a', // rfWETH
            '0xb85245929dc65b5eddb56c4b4e84b20bce69db35': '0x46a76217415fd83ebb9e1f0ddf6b4f4f18fc5518', // rfWSETH
            '0xd32f78f5ae235269c6d2cabbd26a57ff9fd62967': '0xa15abbf609133662a6794efaf12fbb0fdad647ac', // rfWBTC
            '0x55b1f937b1335be355c82e207fd437182c986ba1': '0xa832e597273cf056d71490f6ea6f17218ba285df', // rfOP
        },
        reaperManualRebalancer: '0xf070996cf89cd3d2582705fc269f2c800e9a6a21',
        sorQueries: '0x1814a3b3e4362caf4eb54cd85b82d39bd7b34e41',
        balancerQueries: '0xe39b5e3b6d74016b2f6a9673d7d7493b6df549d5',
        unwrapExceptions: {
            reaper: [],
        },
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
            url: 'https://discord.gg/beethovenx',
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
        balancerPseudoMinterAddress: '0x4fb47126fa83a8734991e41b942ac29a3266c968',
        veBALDelegationProxyAddress: '0x9da18982a33fd0c7051b19f0d7c76f2d5e7e017c',
    },
    createPoolUrl: 'https://opv1.beets.fi/#/pool-create',
    warnings: {
        poolList: {
            '0x1f131ec1175f023ee1534b16fa8ab237c00e238100000000000000000000004a':
                'A vulnerability has been discovered that effects this pool. Existing liquidity providers should remove liquidity immediately, and no new deposits should be made.',
            '0x479a7d1fcdd71ce0c2ed3184bfbe9d23b92e8337000000000000000000000049':
                'A vulnerability has been discovered that effects this pool. Existing liquidity providers should remove liquidity immediately, and no new deposits should be made.',
        },
        poolDetail: {
            '0x1f131ec1175f023ee1534b16fa8ab237c00e238100000000000000000000004a': {
                id: 'composable-nested-vulnerability',
                message:
                    'A vulnerability has been discovered that effects this pool. Existing liquidity providers should remove liquidity immediately, and no new deposits should be made.',
                type: 'warning',
                link: {
                    url: 'https://twitter.com/beethoven_x/status/1611363903744937985?s=20&t=tiOYA-4RINQzF4eMbR4HgA',
                    text: 'Read more',
                },
            },
            '0x479a7d1fcdd71ce0c2ed3184bfbe9d23b92e8337000000000000000000000049': {
                id: 'composable-nested-vulnerability',
                message:
                    'A vulnerability has been discovered that effects this pool. Existing liquidity providers should remove liquidity immediately, and no new deposits should be made.',
                type: 'warning',
                link: {
                    url: 'https://twitter.com/beethoven_x/status/1611363903744937985?s=20&t=tiOYA-4RINQzF4eMbR4HgA',
                    text: 'Read more',
                },
            },
        },
        poolInvest: {
            '0xb1c9ac57594e9b1ec0f3787d9f6744ef4cb0a02400000000000000000000006e':
                'To account for the USD+ and DAI+ deposit/withdraw fee, this pool will charge a fee on both invest and withdraw of up to 0.06%.',

            '0x43da214fab3315aa6c02e0b8f2bfb7ef2e3c60a50000000000000000000000ae':
                'To account for the USD+ and DAI+ deposit/withdraw fee, this pool will charge a fee on both invest and withdraw of up to 0.06%.',
        },

        poolWithdraw: {
            '0xb1c9ac57594e9b1ec0f3787d9f6744ef4cb0a02400000000000000000000006e':
                'To account for the USD+ and DAI+ deposit/withdraw fee, this pool will charge a fee on both invest and withdraw of up to 0.06%.',

            '0x43da214fab3315aa6c02e0b8f2bfb7ef2e3c60a50000000000000000000000ae':
                'To account for the USD+ and DAI+ deposit/withdraw fee, this pool will charge a fee on both invest and withdraw of up to 0.06%.',
        },
    },
    poolBadgeTypes: {
        '0xde45f101250f2ca1c0f8adfc172576d10c12072d00000000000000000000003f': 'reaper-aave',
        '0x6222ae1d2a9f6894da50aa25cb7b303497f9bebd000000000000000000000046': 'reaper-aave',
        '0x1f131ec1175f023ee1534b16fa8ab237c00e238100000000000000000000004a': 'reaper-aave',
        '0x05e7732bf9ae5592e6aa05afe8cd80f7ab0a7bea00020000000000000000005a': 'reaper-aave',
        '0x479a7d1fcdd71ce0c2ed3184bfbe9d23b92e8337000000000000000000000049': 'reaper-aave',
        '0x981fb05b738e981ac532a99e77170ecb4bc27aef00010000000000000000004b': 'reaper-aave',
        '0xb0de49429fbb80c635432bbad0b3965b2856017700010000000000000000004e': 'reaper-aave-granary',
        '0x359ea8618c405023fc4b98dab1b01f373792a12600010000000000000000004f': 'reaper-aave-granary',
        '0xb1c9ac57594e9b1ec0f3787d9f6744ef4cb0a02400000000000000000000006e': 'overnight',
        '0x43da214fab3315aa6c02e0b8f2bfb7ef2e3c60a50000000000000000000000ae': 'overnight',
        '0x428e1cc3099cf461b87d124957a0d48273f334b100000000000000000000007f': 'reaper-sonne',
        '0x23ca0306b21ea71552b148cf3c4db4fc85ae19290000000000000000000000ac': 'reaper-sonne',
        '0x3c74c4ed512050eb843d89fb9dcd5ebb4668eb6d0002000000000000000000cc': 'beefy-exactly',
        '0x098f32d98d0d64dba199fc1923d3bf4192e787190001000000000000000000d2': 'reaper-sonne',
        '0x58910d5bd045a20a37de147f8acea75b2d881f610002000000000000000000d3': 'gyroscope',
    },
    investDisabled: {
        '0x1f131ec1175f023ee1534b16fa8ab237c00e238100000000000000000000004a': true,
        '0x479a7d1fcdd71ce0c2ed3184bfbe9d23b92e8337000000000000000000000049': true,
    },
    maBeetsEnabled: false,
    claimAllRewardsEnabled: false,
};
