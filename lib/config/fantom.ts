import { NetworkConfig } from '~/lib/config/network-config-type';

export const fantomNetworkConfig: NetworkConfig = {
    appName: 'Beethoven X',
    chainId: '250',
    networkName: 'Fantom Opera',
    etherscanName: 'FTM Scan',
    etherscanUrl: 'https://ftmscan.com',
    testnet: false,
    eth: {
        name: 'Fantom',
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        symbol: 'FTM',
        decimals: 18,
    },
    wethAddress: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    wethAddressFormatted: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    coingecko: {
        nativeAssetId: 'fantom',
        platformId: 'fantom',
    },
    rpcUrl: 'https://rpc.ftm.tools',
    multicall: '0x66335d7ad8011f6aa3f48aadcb523b62b38ed961',
    beets: {
        address: '0xf24bcf4d1e507740041c9cfd2dddb29585adce1e',
    },
    fbeets: {
        address: '0xfcef8a994209d6916eb2c86cdd2afd60aa6f54b1',
        farmId: '22',
        poolId: '0xcde5a11a4acb4ee4c805352cec57e236bdbc3837000200000000000000000019',
    },
    balancer: {
        vault: '0x20dd72Ed959b6147912C2e529F0a0C651c33c9ce',
        batchRelayer: '0xC852F984CA3310AFc596adeB17EfcB0542646920',
    },
    beetsPoolOwnerAddress: '0xcd983793adb846dce4830c22f30c7ef0c864a776',
    masterChefContractAddress: '0x8166994d9ebBe5829EC86Bd81258149B87faCfd3',
};
