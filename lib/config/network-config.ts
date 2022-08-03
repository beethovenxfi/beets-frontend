import { NetworkConfig } from '~/lib/config/network-config-type';
import { fantomNetworkConfig } from '~/lib/config/fantom';
import { optimismNetworkConfig } from '~/lib/config/optimism';

const AllNetworkConfigs: { [chainId: string]: NetworkConfig } = {
    '250': fantomNetworkConfig,
    '10': optimismNetworkConfig,
};

export const networkConfig = AllNetworkConfigs[process.env.NEXT_PUBLIC_CHAIN_ID || '250'];
