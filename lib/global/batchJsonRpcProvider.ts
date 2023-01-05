import { providers } from 'ethers';
import { Chain, ChainProviderFn } from 'wagmi';
import { FallbackProviderConfig } from '@wagmi/core';
import { StaticJsonRpcBatchProvider } from '~/lib/services/rpc-provider/static-json-rpc-batch-provier';

const providerCache: { [chainId: string]: StaticJsonRpcBatchProvider } = {};

type JsonRpcProviderConfig = FallbackProviderConfig & {
    rpc: (chain: Chain) => { http: string; webSocket?: string } | null;
    static?: boolean;
};

export function batchJsonRpcProvider({
    priority,
    rpc,
    stallTimeout,
    static: static_ = true,
    weight,
}: JsonRpcProviderConfig): ChainProviderFn<providers.JsonRpcProvider, providers.WebSocketProvider> {
    return function (chain) {
        const rpcConfig = rpc(chain);
        if (!rpcConfig || rpcConfig.http === '') return null;
        return {
            chain: {
                ...chain,
                rpcUrls: {
                    ...chain.rpcUrls,
                    default: { http: [rpcConfig.http] },
                },
            },
            provider: () => {
                if (!providerCache[chain.id]) {
                    providerCache[chain.id] = new StaticJsonRpcBatchProvider(rpcConfig.http, {
                        //ensAddress: chain.ens?.address,
                        chainId: chain.id,
                        name: chain.network,
                    });
                }

                const provider = providerCache[chain.id];

                return Object.assign(provider, { priority, stallTimeout, weight });
            },
            ...(rpcConfig.webSocket && {
                webSocketProvider: () => new providers.WebSocketProvider(rpcConfig.webSocket as string, chain.id),
            }),
        };
    };
}
