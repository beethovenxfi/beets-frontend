import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createClient } from 'wagmi';
import { GqlChain } from '~/apollo/generated/graphql-codegen-generated';
import { networkConfig } from '~/lib/config/network-config';
import { batchJsonRpcProvider } from '~/lib/global/batchJsonRpcProvider';
import { getBaseUrl } from '../util/urls';

// we're in the browser, so we won't expose the alchemy key here
const shouldUsePrivateRpc = !!process.env.NEXT_PUBLIC_HAS_ALCHEMY_KEY;

const getPrivateRpcUrl = (chain: GqlChain) => {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/api/rpc/${chain}/routes`;
};

const getRpc = (chain: GqlChain) => {
    if (shouldUsePrivateRpc) {
        return getPrivateRpcUrl(chain);
    }
    return networkConfig.rpcUrl;
};

const rpcUrl = getRpc(networkConfig.chainName as GqlChain);

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
                default: {
                    http: [process.env.NEXT_PUBLIC_RPC_URL || networkConfig.rpcUrl],
                },
                public: {
                    http: [process.env.NEXT_PUBLIC_RPC_URL || networkConfig.rpcUrl],
                },
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
            rpc: () => ({ http: process.env.NEXT_PUBLIC_RPC_URL || networkConfig.rpcUrl }),
        }),
    ],
);

export const networkChainDefinitions = response.chains;
export const networkProvider = response.provider({ chainId: parseInt(networkConfig.chainId) });

const { connectors } = getDefaultWallets({
    appName: networkConfig.appName,
    chains: networkChainDefinitions,
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
});

export const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider: response.provider,
});
