import { apiProvider, configureChains, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { createClient } from 'wagmi';
import { networkConfig } from '~/lib/config/network-config';

const response = configureChains(
    [
        {
            id: parseInt(networkConfig.chainId),
            name: networkConfig.networkName,
            nativeCurrency: {
                name: networkConfig.eth.name,
                symbol: networkConfig.eth.symbol,
                decimals: networkConfig.eth.decimals,
            },
            rpcUrls: {
                default: networkConfig.rpcUrl,
            },
            blockExplorers: {
                etherscan: {
                    name: networkConfig.etherscanName,
                    url: networkConfig.etherscanUrl,
                },
                default: {
                    name: networkConfig.etherscanName,
                    url: networkConfig.etherscanUrl,
                },
            },
            testnet: networkConfig.testnet,
        },
    ],
    [apiProvider.jsonRpc((_) => ({ rpcUrl: networkConfig.rpcUrl }))],
);

export const networkChainDefinitions = response.chains;
export const networkProvider = response.provider({ chainId: parseInt(networkConfig.chainId) });

const { connectors } = getDefaultWallets({
    appName: networkConfig.appName,
    chains: networkChainDefinitions,
});

export const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider: response.provider,
});
