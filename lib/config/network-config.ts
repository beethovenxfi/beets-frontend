import { NetworkConfig } from '~/lib/config/network-config-type';
import { fantomNetworkConfig } from '~/lib/config/fantom';
import { optimismNetworkConfig } from '~/lib/config/optimism';
import { sonicNetworkConfig } from '~/lib/config/sonic';

const AllNetworkConfigs: { [chainId: string]: NetworkConfig } = {
    '250': fantomNetworkConfig,
    '10': optimismNetworkConfig,
    '146': sonicNetworkConfig,
};

export const networkConfig = AllNetworkConfigs[process.env.NEXT_PUBLIC_CHAIN_ID || '146'];

export const networkList = [
    {
        name: fantomNetworkConfig.networkShortName,
        chainId: fantomNetworkConfig.chainId,
        url: 'https://ftm.beets.fi',
        iconUrl: fantomNetworkConfig.eth.iconUrl,
    },
    {
        name: optimismNetworkConfig.networkShortName,
        chainId: optimismNetworkConfig.chainId,
        url: 'https://op.beets.fi',
        iconUrl: optimismNetworkConfig.eth.iconUrl,
    },
    {
        name: sonicNetworkConfig.networkShortName,
        chainId: sonicNetworkConfig.chainId,
        url: 'https://beets.fi',
        iconUrl: sonicNetworkConfig.eth.iconUrl,
    },
];
