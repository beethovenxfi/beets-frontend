import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createClient } from 'wagmi';
import { networkConfig } from '~/lib/config/network-config';
import { batchJsonRpcProvider } from '~/lib/global/batchJsonRpcProvider';

const response = configureChains(
    [
        {
            id: parseInt(networkConfig.chainId),
            network: networkConfig.networkShortName,
            name: networkConfig.networkName,
            ...(networkConfig.chainId === '250' && {
                iconUrl: 'https://assets.coingecko.com/coins/images/4001/large/Fantom.png?1558015016',
            }),
            nativeCurrency: {
                name: networkConfig.eth.name,
                symbol: networkConfig.eth.symbol,
                decimals: networkConfig.eth.decimals,
            },
            rpcUrls: {
                default: networkConfig.rpcUrl.client,
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
    [
        batchJsonRpcProvider({
            rpc: (chain) => ({ http: networkConfig.rpcUrl.client }),
        }),
    ],
);

const responseBackend = configureChains(
    [
        {
            id: parseInt(networkConfig.chainId),
            network: networkConfig.networkShortName,
            name: networkConfig.networkName,
            ...(networkConfig.chainId === '250' && {
                iconUrl: 'https://assets.coingecko.com/coins/images/4001/large/Fantom.png?1558015016',
            }),
            nativeCurrency: {
                name: networkConfig.eth.name,
                symbol: networkConfig.eth.symbol,
                decimals: networkConfig.eth.decimals,
            },
            rpcUrls: {
                default: networkConfig.rpcUrl.internal,
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
    [
        batchJsonRpcProvider({
            rpc: (chain) => ({ http: networkConfig.rpcUrl.internal }),
        }),
    ],
);

export const networkChainDefinitions = response.chains;
export const networkProvider = responseBackend.provider({ chainId: parseInt(networkConfig.chainId) });

const { connectors } = getDefaultWallets({
    appName: networkConfig.appName,
    chains: networkChainDefinitions,
});

export const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider: response.provider,
});
