import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useQuery, UseQueryResult } from 'react-query';
import { multicall } from '~/lib/services/util/multicaller.service';
import { networkProvider } from '~/lib/global/network';

interface UseMultiCallInput {
    abi: any[];
    calls: { address: string; functionName: string; args?: any[] }[];
    options?: any;
    requireSuccess?: boolean;
    enabled?: boolean;
    cacheTimeMs?: number;
}

export function useMultiCall<T>({
    abi,
    calls,
    options = {},
    requireSuccess = false,
    enabled = true,
    cacheTimeMs,
}: UseMultiCallInput): UseQueryResult<(T | null)[]> {
    const networkConfig = useNetworkConfig();

    return useQuery<(T | null)[]>(
        ['useMultiCall', requireSuccess, JSON.stringify(abi), JSON.stringify(calls), JSON.stringify(options)],
        async () => {
            if (calls.length === 0) {
                return [];
            }

            const response = await multicall<T>(
                networkConfig.chainId,
                networkProvider,
                abi,
                calls.map((call) => [call.address, call.functionName, call.args]),
                options,
                requireSuccess,
            );

            return response;
        },
        { enabled, refetchInterval: cacheTimeMs },
    );
}
