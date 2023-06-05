import { NetworkConfig } from '~/lib/config/network-config-type';
import { AddressZero } from '@ethersproject/constants';

export const fantomNetworkConfig: NetworkConfig = {
    appName: 'Beethoven X',
    chainId: '250',
    networkName: 'Fantom Opera',
    networkShortName: 'Fantom',
    chainName: 'FANTOM',
    etherscanName: 'FTM Scan',
    etherscanUrl: 'https://ftmscan.com',
    testnet: false,
    eth: {
        name: 'Fantom',
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        symbol: 'FTM',
        decimals: 18,
        iconUrl: 'https://assets.coingecko.com/coins/images/4001/large/Fantom.png',
        minGasAmount: '0.1',
    },
    wethAddress: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    wethAddressFormatted: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    coingecko: {
        nativeAssetId: 'fantom',
        platformId: 'fantom',
    },
    rpcUrl: 'https://rpc.ftm.tools',
    //rpcUrl: 'https://rpc.ankr.com/fantom',
    multicall: '0x66335d7ad8011f6aa3f48aadcb523b62b38ed961',
    beets: {
        address: '0xf24bcf4d1e507740041c9cfd2dddb29585adce1e',
    },
    fbeets: {
        address: '0xfcef8a994209d6916eb2c86cdd2afd60aa6f54b1',
        farmId: '22',
        poolId: '0xcde5a11a4acb4ee4c805352cec57e236bdbc3837000200000000000000000019',
        poolAddress: '0xcdE5a11a4ACB4eE4c805352Cec57E236bdBC3837',
    },
    reliquary: {
        address: '0x1ed6411670c709f4e163854654bd52c74e66d7ec',
        fbeets: {
            poolId: '0x9e4341acef4147196e99d648c5e43b3fc9d026780002000000000000000005ec',
            poolAddress: '0x9e4341acef4147196e99d648c5e43b3fc9d02678',
            farmId: 2,
            maxLevel: 10,
        },
    },
    balancer: {
        vault: '0x20dd72Ed959b6147912C2e529F0a0C651c33c9ce',
        batchRelayer: '0x0faa25293a36241c214f3760c6ff443e1b731981',
        balToken: AddressZero,
        composableStableFactories: ['0x5c3094982cf3c97a06b7d62a6f7669f14a199b19'],
        composableStableV1Factory: '',
        weightedPoolV2PlusFactories: [
            '0x8ea1c497c16726e097f62c8c9fbd944143f27090',
            '0xb841df73861e65e6d61a80f503f095a91ce75e15',
        ],
        linearFactories: {
            erc4626: ['0x89857161e0ad36f8c5a537733c1fcf7145220aae'],
            reaper: ['0xd448c4156b8de31e56fdfc071c8d96459bb28119'],
        },
        linearRebalancers: {
            '0x92502cd8e00f5b8e737b2ba203fdd7cd27b23c8f': '0x377ef852870ff2817e04b20629efdd583db49bac', // wftm
            '0xc385e76e575b2d71eb877c27dcc1608f77fada99': '0x268292559d120e101a38eff1d04e6d20a67334ea', // usdc
            '0x685056d3a4e574b163d0fa05a78f1b0b3aa04a80': '0x3c1420df122ac809b9d1ba77906f833764d64501', // dai
            '0xa0051ab2c3eb7f17758428b02a07cf72eb0ef1a3': '0x8553fdc738521b0408c22897f6ceeed7f753a2c9', // weth
            '0x3c1420df122ac809b9d1ba77906f833764d64501': '0xb7880303215e8cbcfad05a43ffde1a1396795df1', // wbtc
            '0x442988091cdc18acb8912cd3fe062cda9233f9dc': '0x4e568a948fe772e36b696ac5b11b174e9807dfaa', // fusdt
        },
        reaperManualRebalancer: '0xb4dda8543c1b8991ab81ca40b1e732b2993ebb9f',
        sorQueries: '0x290c793b7779bcdc14ce0f8909739fde12b8b149',
        balancerQueries: '0x1b0a42663df1edea171cd8732d288a81efff6d23',
        unwrapExceptions: {
            reaper: [
                '0x92502cd8e00f5b8e737b2ba203fdd7cd27b23c8f',
                '0xc385e76e575b2d71eb877c27dcc1608f77fada99',
                '0x685056d3a4e574b163d0fa05a78f1b0b3aa04a80',
                '0xa0051ab2c3eb7f17758428b02a07cf72eb0ef1a3',
                '0x3c1420df122ac809b9d1ba77906f833764d64501',
                '0x442988091cdc18acb8912cd3fe062cda9233f9dc',
            ],
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
        rewardHelperAddress: AddressZero,
        balancerPseudoMinterAddress: AddressZero,
        veBALDelegationProxyAddress: AddressZero,
    },
    createPoolUrl: 'https://v1.beets.fi/#/pool-create',
    launchUrl: 'https://v1.beets.fi/#/launch',
    stakeUrl: 'https://beets.fi/#/stake',
    warnings: {
        poolList: {
            '0xa10285f445bcb521f1d623300dc4998b02f11c8f00000000000000000000043b':
                'A vulnerability has been discovered that effects this pool. Existing liquidity providers should remove liquidity immediately, and no new deposits should be made.',
        },
        poolDetail: {
            '0xa10285f445bcb521f1d623300dc4998b02f11c8f00000000000000000000043b': {
                id: 'composable-nested-vulnerability',
                message:
                    'A vulnerability has been discovered that effects this pool. Existing liquidity providers should remove liquidity immediately, and no new deposits should be made.',
                type: 'warning',
            },
        },
        poolInvest: {},
        poolWithdraw: {},
    },
    boostedByTypes: {
        '0xff2753aaba51c9f84689b9bd0a21b3cf380a1cff00000000000000000000072e': 'reaper',
        '0x7449f09c8f0ed490472d7c14b4eef235620d027000010000000000000000072d': 'reaper',
        '0x2e0d46d884af4053787e1838793bf98dcb87488e00020000000000000000072c': 'reaper',
        '0xf47f4d59c863c02cbfa3eefe6771b9c9fbe7b97800000000000000000000072b': 'reaper',
        '0xba0e9aea8a7fa1daab4edf244191f2387a4e472b000100000000000000000737': 'reaper',
    },
    investDisabled: {
        '0xa10285f445bcb521f1d623300dc4998b02f11c8f00000000000000000000043b': true,
    },
    maBeetsEnabled: true,
    claimAllRewardsEnabled: true,
};
