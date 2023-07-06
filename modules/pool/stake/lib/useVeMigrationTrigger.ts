import { gql } from '@apollo/client';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import useSubgraphQuery from '~/lib/global/useSubgraphQuery';
import { useUserAccount } from '~/lib/user/useUserAccount';

export type LockInfo = {
    slope: string;
    bias: string;
    votingEscrowID?: {
        omniLocks: OmniLockInfo[];
    };
};

export type OmniLockInfo = {
    slope: string;
    bias: string;
    dstChainId: number;
};

export type VeLocks = {
    votingLocks: LockInfo[];
};

export default function useVeMigrationTrigger() {
    const { userAddress } = useUserAccount();
    const { layerZeroChainId, chainId } = useNetworkConfig();

    const areQueriesEnabled = chainId === '10';

    const {
        data: optimismLockData = {
            optimismLocks: { votingLocks: [] } as VeLocks,
        },
        isLoading: isLoadingOptimismLocks,
    } = useSubgraphQuery<{ optimismLocks: VeLocks }>(
        'optimism-gauge',
        gql`
            query GetOptimismVotingEscrowLocks($userId: String!) {
                optimismLocks: user(id: $userId) {
                    votingLocks(where: { lockedBalance_gte: "0" }) {
                        slope
                        bias
                    }
                }
            }
        `,
        { userId: userAddress?.toLowerCase() },
        {
            enabled: areQueriesEnabled && !!userAddress,
        },
    );

    const {
        data: mainnetLockData = { mainnetLocks: { votingLocks: [] } as VeLocks },
        isLoading: isLoadingMainnetLocks,
    } = useSubgraphQuery<{
        mainnetLocks: VeLocks;
    }>(
        'mainnet-gauge',
        gql`
            query GetMainnetVotingEscrowLocks($userId: String!, $layerZeroChainId: Int!) {
                mainnetLocks: user(id: $userId) {
                    votingLocks(where: { lockedBalance_gte: "0" }) {
                        slope
                        bias
                        votingEscrowID {
                            omniLocks(where: { dstChainId: $layerZeroChainId, localUser: $userId }) {
                                slope
                                bias
                            }
                        }
                    }
                }
            }
        `,
        { userId: userAddress?.toLowerCase(), layerZeroChainId },
        { enabled: areQueriesEnabled && !!userAddress },
    );

    // check all the locks on mainnet

    const isLockBridgeSynced = ((mainnetLockData?.mainnetLocks || {}).votingLocks || []).every((mainnetVeLock) => {
        if ((mainnetVeLock.votingEscrowID?.omniLocks || []).length === 0) {
            return false;
        }
        // check if the slope/bias match omni locks for op (dstChainId is filtered in query)
        return mainnetVeLock.votingEscrowID?.omniLocks.every((optimismOmniLock) => {
            return optimismOmniLock.slope === mainnetVeLock.slope && optimismOmniLock.bias === mainnetVeLock.bias;
        });
    });

    const isOptimismSynced = ((optimismLockData.optimismLocks || {}).votingLocks || []).every((optimismVeLock) => {
        return !!mainnetLockData.mainnetLocks.votingLocks.find(
            (mainnetVeLock) =>
                mainnetVeLock.bias === optimismVeLock.bias && mainnetVeLock.slope === optimismVeLock.slope,
        );
    });

    const isLoading = isLoadingMainnetLocks || isLoadingOptimismLocks;
    const shouldShowMigrationTrigger = !isOptimismSynced || !isLockBridgeSynced;

    return {
        isLoading,
        shouldShowMigrationTrigger,
        isOptimismSynced,
        isLockBridgeSynced,
    };
}
