import { NetworkConfig } from '~/lib/config/network-config-type';
import { fantomNetworkConfig } from '~/lib/config/fantom';

const AllNetworkConfigs: { [chainId: string]: NetworkConfig } = {
    '250': fantomNetworkConfig,
};

export const networkConfig = AllNetworkConfigs[process.env.NEXT_PUBLIC_CHAIN_ID || '250'];
