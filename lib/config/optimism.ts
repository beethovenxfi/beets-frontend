import { NetworkConfig, PoolDetailWarning } from '~/lib/config/network-config-type';
import { AddressZero } from '@ethersproject/constants';

// warnings
const poolListWarningString =
    'A vulnerability has been discovered that effects this pool. Existing liquidity providers should remove liquidity immediately, and no new deposits should be made.';
const PoolDetailWarningObject: PoolDetailWarning = {
    id: 'composable-nested-vulnerability',
    message:
        'A vulnerability has been discovered that effects this pool. Existing liquidity providers should remove liquidity immediately, and no new deposits should be made.',
    type: 'warning',
    link: {
        url: 'https://twitter.com/Balancer/status/1694014645378724280',
        text: 'Read more',
    },
};

export const optimismNetworkConfig: NetworkConfig = {
    appName: 'Beets',
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
        iconUrl: 'https://raw.githubusercontent.com/ethereum-optimism/brand-kit/main/assets/images/Profile-Logo.png',
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
        oldAddress: '0x97513e975a7fa9072c72c92d8000b0db90b163c5',
        migration: '0x9300c7eb7e3e16ba916a7d6aafee3891236ac5fc',
        address: '0xb4bc46bc6cb217b59ea8f4530bae26bf69f677f0',
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
    sftmx: {
        address: '',
        ftmStakingProxyAddress: '',
    },
    snapshot: {
        contractAddress: AddressZero,
        delegateAddress: AddressZero,
        id: '0x0000000000000000000000000000000000000000000000000000000000000000',
    },
    balancer: {
        vault: '0xba12222222228d8ba445958a75a0704d566bf2c8',
        batchRelayer: '0x015aca20a1422f3c729086c17f15f10e0cfbc75a',
        balToken: '0xfe8b128ba8c78aabc59d4c64cee7ff28e9379921',
        weightedPoolFactory: '0x230a59F4d9ADc147480f03B0D3fFfeCd56c3289a',
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
            '0xf970659221bb9d01b615321b63a26e857ffc030b': '0x42fe737ba23d172542d6c079952cafcd9b4a5256', // rfusdc multi strat
            '0x20715545c15c76461861cb0d6ba96929766d05a5': '0xa9d40f2aa0121105ce763f13166fd19c4b964d3d', // rfusdt multi strat
            '0xa5d4802b4ce6b745b0c9e1b4a79c093d197869c8': '0xed8f7907195e050411a6a7824bca6acc5c37806c', // rfdai multi strat
            '0x2e2b8b82123789d895fd79913f6dfa51f5b5a0e6': '0x072c30dc3c2f7ce3b8f50600e6e57fb1e9bdf409', // rfweth multi strat
            '0x48ace81c09382bfc08ed102e7eadd37e3b049752': '0xa20f3951d881b98ceb17149ba88ddb94ccd4cc16', // rfwsteth multi strat
            '0x8025586ac5fb265a23b9492e7414beccc2059ec3': '0x6344dfaabe0635fc19aa599a772a3182878c32f4', // rfwbtc multi strat
            '0x3e9cbffd270ae67abb09d28988e7e785498c7373': '0xee5e347e679ed3d86d8280a92b99bb6c09fbb374', // rfop multi strat
        },
        reaperManualRebalancer: '0xf070996cf89cd3d2582705fc269f2c800e9a6a21',
        sorQueries: '0x1814a3b3e4362caf4eb54cd85b82d39bd7b34e41',
        balancerQueries: '0xe39b5e3b6d74016b2f6a9673d7d7493b6df549d5',
        unwrapExceptions: {
            reaper: [],
        },
        minimumBoost: 1.0,
    },
    rateproviders: { AddressZero: AddressZero },
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
            url: 'https://x.com/beets_fi',
        },
        {
            title: 'Medium',
            url: 'https://beethovenxio.medium.com/',
        },
        {
            title: 'Discord',
            url: 'https://op.beets.fi/discord',
        },
        {
            title: 'Olympus Bonds',
            url: 'https://pro.olympusdao.finance/#/bond',
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
        workingBalanceHelperAddress: '0x9129e834e15ea19b6069e8f08a8ecfc13686b8dc',
        checkpointHelper: '0xca4cdc9eed85d9ce0b8eef74457480364068af9e',
    },
    createPoolUrl: 'https://opv1.beets.fi/#/pool-create',
    warnings: {
        poolList: {
            '0x1f131ec1175f023ee1534b16fa8ab237c00e238100000000000000000000004a': poolListWarningString,
            '0x479a7d1fcdd71ce0c2ed3184bfbe9d23b92e8337000000000000000000000049': poolListWarningString,
            '0x23ca0306b21ea71552b148cf3c4db4fc85ae19290000000000000000000000ac': poolListWarningString,
            '0x43da214fab3315aa6c02e0b8f2bfb7ef2e3c60a50000000000000000000000ae': poolListWarningString,
            '0x62cf35db540152e94936de63efc90d880d4e241b0000000000000000000000ef': poolListWarningString,
            '0x098f32d98d0d64dba199fc1923d3bf4192e787190001000000000000000000d2': poolListWarningString,
            '0xb1c9ac57594e9b1ec0f3787d9f6744ef4cb0a02400000000000000000000006e': poolListWarningString,
            '0x05e7732bf9ae5592e6aa05afe8cd80f7ab0a7bea00020000000000000000005a': poolListWarningString,
            '0xde45f101250f2ca1c0f8adfc172576d10c12072d00000000000000000000003f': poolListWarningString,
            '0x981fb05b738e981ac532a99e77170ecb4bc27aef00010000000000000000004b': poolListWarningString,
            '0x6222ae1d2a9f6894da50aa25cb7b303497f9bebd000000000000000000000046': poolListWarningString,
            '0x3c74c4ed512050eb843d89fb9dcd5ebb4668eb6d0002000000000000000000cc': poolListWarningString,
            '0x7fe29a818438ed2759e30f65c2302295711d66fc0000000000000000000000e5': poolListWarningString,
            '0xb0de49429fbb80c635432bbad0b3965b2856017700010000000000000000004e': poolListWarningString,
            '0x428e1cc3099cf461b87d124957a0d48273f334b100000000000000000000007f': poolListWarningString,
            '0x359ea8618c405023fc4b98dab1b01f373792a12600010000000000000000004f': poolListWarningString,
            '0x62de5ca16a618e22f6dfe5315ebd31acb10c44b6000000000000000000000037': poolListWarningString,
            '0x7d6bff131b359da66d92f215fd4e186003bfaa42000000000000000000000058': poolListWarningString,
            '0x9964b1bd3cc530e5c58ba564e45d45290f677be2000000000000000000000036': poolListWarningString,
            '0x2c4a83f98d1cdbeeec825fabacd09c46e2dd3c570002000000000000000000de': poolListWarningString,
            '0x8b6d3aa69c1cf47677281691b1abf3831ba1329d0001000000000000000000d0': poolListWarningString,
            '0x64cee2338369aa9b36fc756ea231eb9bc242926f0000000000000000000000df': poolListWarningString,
            '0xe0b50b0635b90f7021d2618f76ab9a31b92d009400010000000000000000003a': poolListWarningString,
            '0x8a2872fd28f42bd9f6559907235e83fbf4167f480001000000000000000000f2': poolListWarningString,
            '0x362715c164d606682c4ea7e479633e419d9345eb0001000000000000000000e7': poolListWarningString,
            '0xcd7b2232b7435595bbc7fd7962f1f352fc2cc61a0000000000000000000000f0': poolListWarningString,
            '0xf572649606db4743d217a2fa6e8b8eb79742c24a000000000000000000000039': poolListWarningString,
            '0xbec621c9ab4ceddcc2a157ca9b5c475fab65f6a40000000000000000000000f3': poolListWarningString,
            '0x5470f064a19c65263b3033da3a6124fdf0a9bab80000000000000000000000e6': poolListWarningString,
            '0xcb89e89d798a4563d1599ea5508282e13b225b520000000000000000000000e4': poolListWarningString,
            '0xe94c45de980f914904fdcfa9fbbe7c4a0ffe6ac70000000000000000000000e0': poolListWarningString,
            '0x435272180a4125f3b47c92826f482fc6cc165958000200000000000000000059': poolListWarningString,
            '0x96a78983932b8739d1117b16d30c15607926b0c500000000000000000000006d': poolListWarningString,
            '0x593acbfb1eaf3b6ec86fa60325d816996fdcbc0d000000000000000000000038': poolListWarningString,
            '0xd1af4974fcc995cf36ba40b189caa92964a9126d0000000000000000000000f1': poolListWarningString,
        },
        poolDetail: {
            '0x23ca0306b21ea71552b148cf3c4db4fc85ae19290000000000000000000000ac': PoolDetailWarningObject,
            '0x43da214fab3315aa6c02e0b8f2bfb7ef2e3c60a50000000000000000000000ae': PoolDetailWarningObject,
            '0x62cf35db540152e94936de63efc90d880d4e241b0000000000000000000000ef': PoolDetailWarningObject,
            '0x098f32d98d0d64dba199fc1923d3bf4192e787190001000000000000000000d2': PoolDetailWarningObject,
            '0xb1c9ac57594e9b1ec0f3787d9f6744ef4cb0a02400000000000000000000006e': PoolDetailWarningObject,
            '0x05e7732bf9ae5592e6aa05afe8cd80f7ab0a7bea00020000000000000000005a': PoolDetailWarningObject,
            '0xde45f101250f2ca1c0f8adfc172576d10c12072d00000000000000000000003f': PoolDetailWarningObject,
            '0x981fb05b738e981ac532a99e77170ecb4bc27aef00010000000000000000004b': PoolDetailWarningObject,
            '0x6222ae1d2a9f6894da50aa25cb7b303497f9bebd000000000000000000000046': PoolDetailWarningObject,
            '0x3c74c4ed512050eb843d89fb9dcd5ebb4668eb6d0002000000000000000000cc': PoolDetailWarningObject,
            '0x7fe29a818438ed2759e30f65c2302295711d66fc0000000000000000000000e5': PoolDetailWarningObject,
            '0xb0de49429fbb80c635432bbad0b3965b2856017700010000000000000000004e': PoolDetailWarningObject,
            '0x428e1cc3099cf461b87d124957a0d48273f334b100000000000000000000007f': PoolDetailWarningObject,
            '0x359ea8618c405023fc4b98dab1b01f373792a12600010000000000000000004f': PoolDetailWarningObject,
            '0x62de5ca16a618e22f6dfe5315ebd31acb10c44b6000000000000000000000037': PoolDetailWarningObject,
            '0x7d6bff131b359da66d92f215fd4e186003bfaa42000000000000000000000058': PoolDetailWarningObject,
            '0x9964b1bd3cc530e5c58ba564e45d45290f677be2000000000000000000000036': PoolDetailWarningObject,
            '0x2c4a83f98d1cdbeeec825fabacd09c46e2dd3c570002000000000000000000de': PoolDetailWarningObject,
            '0x8b6d3aa69c1cf47677281691b1abf3831ba1329d0001000000000000000000d0': PoolDetailWarningObject,
            '0x64cee2338369aa9b36fc756ea231eb9bc242926f0000000000000000000000df': PoolDetailWarningObject,
            '0xe0b50b0635b90f7021d2618f76ab9a31b92d009400010000000000000000003a': PoolDetailWarningObject,
            '0x8a2872fd28f42bd9f6559907235e83fbf4167f480001000000000000000000f2': PoolDetailWarningObject,
            '0x362715c164d606682c4ea7e479633e419d9345eb0001000000000000000000e7': PoolDetailWarningObject,
            '0xcd7b2232b7435595bbc7fd7962f1f352fc2cc61a0000000000000000000000f0': PoolDetailWarningObject,
            '0xf572649606db4743d217a2fa6e8b8eb79742c24a000000000000000000000039': PoolDetailWarningObject,
            '0xbec621c9ab4ceddcc2a157ca9b5c475fab65f6a40000000000000000000000f3': PoolDetailWarningObject,
            '0x5470f064a19c65263b3033da3a6124fdf0a9bab80000000000000000000000e6': PoolDetailWarningObject,
            '0xcb89e89d798a4563d1599ea5508282e13b225b520000000000000000000000e4': PoolDetailWarningObject,
            '0xe94c45de980f914904fdcfa9fbbe7c4a0ffe6ac70000000000000000000000e0': PoolDetailWarningObject,
            '0x435272180a4125f3b47c92826f482fc6cc165958000200000000000000000059': PoolDetailWarningObject,
            '0x96a78983932b8739d1117b16d30c15607926b0c500000000000000000000006d': PoolDetailWarningObject,
            '0x593acbfb1eaf3b6ec86fa60325d816996fdcbc0d000000000000000000000038': PoolDetailWarningObject,
            '0xd1af4974fcc995cf36ba40b189caa92964a9126d0000000000000000000000f1': PoolDetailWarningObject,
            '0x1f131ec1175f023ee1534b16fa8ab237c00e238100000000000000000000004a': PoolDetailWarningObject,
            '0x479a7d1fcdd71ce0c2ed3184bfbe9d23b92e8337000000000000000000000049': PoolDetailWarningObject,
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
        '0x7ca75bdea9dede97f8b13c6641b768650cb837820002000000000000000000d5': 'gyroscope',
        '0x2c4a83f98d1cdbeeec825fabacd09c46e2dd3c570002000000000000000000de': 'gyroscope',
        '0xe906d4c4fc4c3fe96560de86b4bf7ed89af9a69a000200000000000000000126': 'gyroscope',
        '0x62cf35db540152e94936de63efc90d880d4e241b0000000000000000000000ef': 'reaper',
        '0x7fe29a818438ed2759e30f65c2302295711d66fc0000000000000000000000e5': 'reaper', // to be deprecated soon
        '0x8bb826afc0ff7d2c034a2883f4c461ffd238e1c300020000000000000000012b': 'gyroscope',
    },
    // manually added for now
    thirdPartyStakingPools: [
        {
            poolId: '0x7ca75bdea9dede97f8b13c6641b768650cb837820002000000000000000000d5', // Gyroscope ECLP wstETH/WETH
            url: 'https://app.aura.finance/#/10/pool/6',
            name: 'aura',
        },
        {
            poolId: '0x4fd63966879300cafafbb35d157dc5229278ed2300020000000000000000002b', // Rocket Fuel
            url: 'https://app.aura.finance/#/10/pool/0',
            name: 'aura',
        },
        // {
        //     poolId: '0x7b50775383d3d6f0215a8f290f2c9e2eebbeceb200020000000000000000008b', // Shanghai Shakedown
        //     url: 'https://app.aura.finance/#/10/pool/4',
        //     name: 'aura',
        // },
        // {
        //     poolId: '0xacfe9b4782910a853b68abba60f3fd8049ffe6380000000000000000000000ff', // Sonata for Two: DOLA & USDC
        //     url: 'https://app.aura.finance/#/10/pool/9',
        //     name: 'aura',
        // },
        {
            poolId: '0x9da11ff60bfc5af527f58fd61679c3ac98d040d9000000000000000000000100', // Native Stable Beets
            url: 'https://app.aura.finance/#/10/pool/10',
            name: 'aura',
        },
        {
            poolId: '0x004700ba0a4f5f22e1e78a277fca55e36f47e09c000000000000000000000104', // Ankr's Galactic Harmony
            url: 'https://app.aura.finance/#/10/pool/13',
            name: 'aura',
        },
        // {
        //     poolId: '0x00b82bc5edea6e5e6c77635e31a1a25aad99f881000200000000000000000105', // Overnight Opening Ensemble
        //     url: 'https://app.aura.finance/#/10/pool/11',
        //     name: 'aura',
        // },
        {
            poolId: '0x5f8893506ddc4c271837187d14a9c87964a074dc000000000000000000000106', // Ethereum Triplets

            url: 'https://app.aura.finance/#/10/pool/14',
            name: 'aura',
        },
        // {
        //     poolId: '0xc1f46ce83439886f0ea9c21512b36e7e67239d2c000200000000000000000108', // Roast Beets
        //     url: 'https://app.aura.finance/#/10/pool/15',
        //     name: 'aura',
        // },
        // {
        //     poolId: '0x0244b0025264dc5f5c113d472d579c9c994a59ce0002000000000000000000c9', // A Night at the OPara
        //     url: 'https://app.aura.finance/#/10/pool/16',
        //     name: 'aura',
        // },
        // {
        //     poolId: '0x478980c67d53cd990f2b7bab311ddc9934324e7b00020000000000000000010c', // All Roads Lead to Frax
        //     url: 'https://app.aura.finance/#/10/pool/17',
        //     name: 'aura',
        // },
        {
            poolId: '0xa71021492a3966eec735ed1b505afa097c7cfe6f00000000000000000000010d', // Fraximalist Ethereum
            url: 'https://app.aura.finance/#/10/pool/18',
            name: 'aura',
        },
        {
            poolId: '0x2feb76966459d7841fa8a7ed0aa4bf574d6111bf00020000000000000000011d', // Yield Concerto by FRAX
            url: 'https://app.aura.finance/#/10/pool/19',
            name: 'aura',
        },
        // {
        //     poolId: '0x2a5139cd86c041aa3467e649f5ee0880a5de2f2f00020000000000000000011a', // Staked Duet
        //     url: 'https://app.aura.finance/#/10/pool/20',
        //     name: 'aura',
        // },
        {
            poolId: '0xe906d4c4fc4c3fe96560de86b4bf7ed89af9a69a000200000000000000000126', // Frax Symphony
            url: 'https://app.aura.finance/#/10/pool/21',
            name: 'aura',
        },
        {
            poolId: '0x73a7fe27fe9545d53924e529acf11f3073841b9e000000000000000000000133', // Balancer wrsETH/wETH
            url: 'https://app.aura.finance/#/10/pool/24',
            name: 'aura',
        },
        {
            poolId: '0x2bb4712247d5f451063b5e4f6948abdfb925d93d000000000000000000000136', // Stake me baby one more time
            url: 'https://app.aura.finance/#/10/pool/25',
            name: 'aura',
        },
        // {
        //     poolId: '0x408e11ec9b1751c3d00589b61cae484e07fb9e44000000000000000000000141', // Bedrock'n'Roll
        //     url: 'https://merkl.angle.money/user',
        //     name: 'merkl',
        // },
        {
            poolId: '0xc9eb4b8ce914ee451360b315ffd1d1af8df96be9000000000000000000000143', // Staked Inception Opus No 1
            url: 'https://app.aura.finance/#/10/pool/27',
            name: 'aura',
        },
        {
            poolId: '0x0ccb0c34d4898dfa8de3ece9d814074e60adefd0000000000000000000000142', // (Re)stake On Me, Natively
            url: 'https://app.aura.finance/#/10/pool/26',
            name: 'aura',
        },
        {
            poolId: '0xcb7d357c84b101e3d559ff4845cef63d7d0753ef000000000000000000000150', // Kelp's Restaking Symphony
            url: 'https://app.aura.finance/#/10/pool/28',
            name: 'aura',
        },
    ],
    pointsPools: [
        {
            poolId: '0x73a7fe27fe9545d53924e529acf11f3073841b9e000000000000000000000133',
            textString: 'Earn 2x Kelp Miles and 1x EigenLayer Points',
        },
    ],
    rehypePools: [
        {
            poolId: '0x8bb826afc0ff7d2c034a2883f4c461ffd238e1c300020000000000000000012b',
            url: 'https://app.gyro.finance/pools/optimism/e-clp/0x8bb826afc0ff7d2c034a2883f4c461ffd238e1c3',
            buttonText: 'Manage liquidity on Gyroscope',
        },
    ],
    investDisabled: {
        '0x1f131ec1175f023ee1534b16fa8ab237c00e238100000000000000000000004a': true,
        '0x479a7d1fcdd71ce0c2ed3184bfbe9d23b92e8337000000000000000000000049': true,
        '0x23ca0306b21ea71552b148cf3c4db4fc85ae19290000000000000000000000ac': true,
        '0x43da214fab3315aa6c02e0b8f2bfb7ef2e3c60a50000000000000000000000ae': true,
        '0x62cf35db540152e94936de63efc90d880d4e241b0000000000000000000000ef': true,
        '0x098f32d98d0d64dba199fc1923d3bf4192e787190001000000000000000000d2': true,
        '0xb1c9ac57594e9b1ec0f3787d9f6744ef4cb0a02400000000000000000000006e': true,
        '0x05e7732bf9ae5592e6aa05afe8cd80f7ab0a7bea00020000000000000000005a': true,
        '0xde45f101250f2ca1c0f8adfc172576d10c12072d00000000000000000000003f': true,
        '0x981fb05b738e981ac532a99e77170ecb4bc27aef00010000000000000000004b': true,
        '0x6222ae1d2a9f6894da50aa25cb7b303497f9bebd000000000000000000000046': true,
        '0x3c74c4ed512050eb843d89fb9dcd5ebb4668eb6d0002000000000000000000cc': true,
        '0x7fe29a818438ed2759e30f65c2302295711d66fc0000000000000000000000e5': true,
        '0xb0de49429fbb80c635432bbad0b3965b2856017700010000000000000000004e': true,
        '0x428e1cc3099cf461b87d124957a0d48273f334b100000000000000000000007f': true,
        '0x359ea8618c405023fc4b98dab1b01f373792a12600010000000000000000004f': true,
        '0x62de5ca16a618e22f6dfe5315ebd31acb10c44b6000000000000000000000037': true,
        '0x7d6bff131b359da66d92f215fd4e186003bfaa42000000000000000000000058': true,
        '0x9964b1bd3cc530e5c58ba564e45d45290f677be2000000000000000000000036': true,
        '0x2c4a83f98d1cdbeeec825fabacd09c46e2dd3c570002000000000000000000de': true,
        '0x8b6d3aa69c1cf47677281691b1abf3831ba1329d0001000000000000000000d0': true,
        '0x64cee2338369aa9b36fc756ea231eb9bc242926f0000000000000000000000df': true,
        '0xe0b50b0635b90f7021d2618f76ab9a31b92d009400010000000000000000003a': true,
        '0x8a2872fd28f42bd9f6559907235e83fbf4167f480001000000000000000000f2': true,
        '0x362715c164d606682c4ea7e479633e419d9345eb0001000000000000000000e7': true,
        '0xcd7b2232b7435595bbc7fd7962f1f352fc2cc61a0000000000000000000000f0': true,
        '0xf572649606db4743d217a2fa6e8b8eb79742c24a000000000000000000000039': true,
        '0xbec621c9ab4ceddcc2a157ca9b5c475fab65f6a40000000000000000000000f3': true,
        '0x5470f064a19c65263b3033da3a6124fdf0a9bab80000000000000000000000e6': true,
        '0xcb89e89d798a4563d1599ea5508282e13b225b520000000000000000000000e4': true,
        '0xe94c45de980f914904fdcfa9fbbe7c4a0ffe6ac70000000000000000000000e0': true,
        '0x435272180a4125f3b47c92826f482fc6cc165958000200000000000000000059': true,
        '0x96a78983932b8739d1117b16d30c15607926b0c500000000000000000000006d': true,
        '0x593acbfb1eaf3b6ec86fa60325d816996fdcbc0d000000000000000000000038': true,
        '0xd1af4974fcc995cf36ba40b189caa92964a9126d0000000000000000000000f1': true,
    },
    maBeetsEnabled: false,
    claimAllRewardsEnabled: false,
    layerZeroChainId: 111,
    beetsMigrationEnabled: false,
    gaugeEnabled: true,
    sftmxEnabled: false,
};
