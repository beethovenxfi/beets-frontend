import { gql } from '@apollo/client';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import useSubgraphQuery from '~/lib/global/useSubgraphQuery';

export type AuraPools = {
    id: string;
    name: string;
    rewardPool: string;
    balancerPoolId: string;
};

export default function useGetAuraPools() {
    const { chainId } = useNetworkConfig();

    const areQueriesEnabled = chainId === '10';

    const { data: auraPools, isLoading } = useSubgraphQuery<AuraPools>(
        'aura',
        gql`
            query GetPools($chainId: Int) {
                pools(chainId: $chainId) {
                    id
                    name
                    rewardPool
                    balancerPoolId
                }
            }
        `,
        { chainId },
        {
            enabled: areQueriesEnabled,
        },
    );

    console.log({ auraPools });

    return {
        auraPools,
        isLoading,
    };
}
