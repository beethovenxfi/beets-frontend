import { useMultiCall } from '~/lib/util/useMultiCall';
import VaultAbi from '../../../lib/abi/Vault.json';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { BigNumber } from 'ethers';

export function useGetRecoveryPoolTokens(poolIds: string[]) {
    const networkConfig = useNetworkConfig();

    const multicall = useMultiCall<[string[], BigNumber[]]>({
        abi: VaultAbi,
        calls: poolIds.map((poolId) => ({
            address: networkConfig.balancer.vault,
            functionName: 'getPoolTokens',
            args: [poolId],
        })),
        enabled: poolIds.length > 0,
    });

    const poolTokens = multicall.data
        ? poolIds.map((poolId, index) => {
              const data = multicall.data[index];

              return {
                  poolId,
                  tokens: data ? data[0] : [],
                  balances: data ? data[1] : [],
              };
          })
        : [];

    return {
        ...multicall,
        poolTokens,
    };
}
