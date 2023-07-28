import { gql } from '@apollo/client';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import useSubgraphQuery from '~/lib/global/useSubgraphQuery';

export type AuraPool = {
    id: number;
    name: string;
    rewardPool: string;
    balancerPoolId: string;
};

export default function usePoolAuraPools() {
    const { chainId, auraEnabled } = useNetworkConfig();

    const { data: auraPools, isLoading } = useSubgraphQuery<{ pools: AuraPool[] }>(
        'aura',
        gql`
            query GetPools($chainId: Int) {
                pools(chainId: $chainId) {
                    id
                    name
                    rewardPool
                    balancerPoolId
                    isShutdown
                }
            }
        `,
        { chainId: parseInt(chainId) },
        {
            enabled: auraEnabled,
        },
    );

    return {
        auraPools,
        isLoading,
    };
}
