import { NetworkConfig } from '~/lib/config/network-config-type';
import { AddressZero } from '@ethersproject/constants';

export const mainnetNetworkConfig: NetworkConfig = {
    appName: 'Balancer',
    chainId: '1',
    networkName: 'Mainnet Ethereum',
    networkShortName: 'Ethereum',
    chainName: 'MAINNET',
    etherscanName: 'etherscan',
    etherscanUrl: 'https://etherscan.com',
    protocol: 'balancer',
    testnet: false,
    eth: {
        name: 'Ethereum',
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        symbol: 'ETH',
        decimals: 18,
        iconUrl: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    },
    wethAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    wethAddressFormatted: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    coingecko: {
        nativeAssetId: 'ethereum',
        platformId: 'ethereum',
    },
    rpcUrl: 'https://cloudflare-eth.com',
    multicall: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
    protocolTokenAddress: '0xba100000625a3754423978a60c9317c58a424e3d',
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
        },
    },
    balancer: {
        vault: '0xba12222222228d8ba445958a75a0704d566bf2c8',
        batchRelayer: '0x1a58897ab366082028ced3740900ecbd765af738',
        composableStableV1Factory: '0xf9ac7b9df2b3454e841110cce5550bd5ac6f875f',
        composableStableFactories: [],
        weightedPoolV2PlusFactories: ['0xad901309d9e9dbc5df19c84f729f429f0189a633'],
        linearFactories: {
            erc4626: ['0x4c4287b07d293e361281bceee8715c8cdeb64e34'],
            reaper: [
                '0x19968d4b7126904fd665ed25417599df9604df83',
                '0x0473136b0732606e826ffeb42f3abc81a7a766d5',
                '0xe4b88e745dce9084b9fc2439f85a9a4c5cd6f361',
            ],
        },
        linearRebalancers: {},
        reaperManualRebalancer: '0xf070996cf89cd3d2582705fc269f2c800e9a6a21',
        balancerQueries: '0xe39b5e3b6d74016b2f6a9673d7d7493b6df549d5',
        sorQueries: '',
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
    featureFlags: {
        maBeets: false,
        swap: true,
        incentivizedPools: false,
        protocolTokenPrice: false,
        claimAllRewards: false,
    },
};
