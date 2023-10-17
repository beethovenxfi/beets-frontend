import { usePool } from '~/modules/pool/lib/usePool';
import { useUserAccount } from '../user/useUserAccount';
import { useQuery } from 'react-query';
import { gaugeStakingService } from '../services/staking/gauge-staking.service';
import { useProvider } from 'wagmi';
import { networkConfig } from '~/lib/config/network-config';

function calculateBoostFromGauge(workingBalance: number, userBalance: number) {
    let boost = networkConfig.balancer.minimumBoost;

    if (workingBalance) {
        boost = workingBalance / (0.4 * userBalance);
    }

    return boost.toString();
}

export default function useStakingBoosts() {
    const { pool } = usePool();
    const { userAddress } = useUserAccount();
    const provider = useProvider();

    const gaugeAddress = pool.staking?.gauge?.gaugeAddress || '';
    const gaugeVersion = pool.staking?.gauge?.version || 1;

    const { data: stakedBalance, isLoading: isLoadingStakedBalance } = useQuery(
        ['gaugeBalance', userAddress, gaugeAddress, gaugeVersion],
        async () => {
            const balance = gaugeStakingService.getUserStakedBalance({
                userAddress: userAddress as string,
                gaugeAddress,
                gaugeVersion,
                provider,
            });
            return balance;
        },
    );

    const { data: workingBalance, isLoading: isLoadingWorkingBalance } = useQuery(
        ['gaugeWorkingBalance', userAddress, gaugeAddress],
        async () => {
            const workingBalances = gaugeStakingService.getGaugeWorkingBalance({
                userAddress: userAddress as string,
                gaugeAddress,
                provider,
            });
            return workingBalances;
        },
    );

    const isLoading = isLoadingStakedBalance || isLoadingWorkingBalance;

    let boost = calculateBoostFromGauge(parseFloat(workingBalance || ''), parseFloat(stakedBalance || ''));

    return {
        isLoading,
        boost,
    };
}
