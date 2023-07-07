import { useQuery } from 'react-query';
import { useProvider } from 'wagmi';
import { gaugeStakingService } from '~/lib/services/staking/gauge-staking.service';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useUserData } from '~/lib/user/useUserData';

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

export default function useCheckpointTrigger() {
    const { userAddress } = useUserAccount();
    const provider = useProvider();

    const { staking } = useUserData();
    const gauges = staking
        .map((staking) => staking.gauge?.gaugeAddress)
        .filter((gauge) => gauge !== undefined) as string[];
    const { data: checkpointableGauges, isLoading } = useQuery(
        ['gaugeCheckpintTrigger', { userAddress, gauges }],
        async () => {
            if (userAddress) {
                const checkpointableGauges = await gaugeStakingService.getCheckpointableGauges({
                    provider,
                    userAddress,
                    gauges,
                });
                return checkpointableGauges;
            }
            return [];
        },
    );

    return {
        checkpointableGauges,
        isLoading,
    };
}
