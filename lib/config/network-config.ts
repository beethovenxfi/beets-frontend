import { NetworkConfig } from '~/lib/config/network-config-type';
import { fantomNetworkConfig } from '~/lib/config/fantom';
import { optimismNetworkConfig } from '~/lib/config/optimism';

const AllNetworkConfigs: { [chainId: string]: NetworkConfig } = {
    '250': fantomNetworkConfig,
    '10': optimismNetworkConfig,
};

export const networkConfig = AllNetworkConfigs[process.env.NEXT_PUBLIC_CHAIN_ID || '250'];

export const networkList = [
    {
        name: fantomNetworkConfig.networkShortName,
        chainId: fantomNetworkConfig.chainId,
        url: 'https://beets.fi',
        iconUrl: fantomNetworkConfig.eth.iconUrl,
    },
    {
        name: optimismNetworkConfig.networkShortName,
        chainId: optimismNetworkConfig.chainId,
        url: 'https://op.beets.fi',
        iconUrl: optimismNetworkConfig.eth.iconUrl,
    },
];
