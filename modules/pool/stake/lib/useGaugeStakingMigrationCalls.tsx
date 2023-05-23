import { useQuery } from 'react-query';
import { gaugeStakingService } from '~/lib/services/staking/gauge-staking.service';

export function useGaugeStakingMigrationCalls(userAddress: string, stakedBalance: string) {
    const query = useQuery(
        ['gaugeStakingMigrateContractCallData', stakedBalance, userAddress],
        async () => {
            return gaugeStakingService.getGaugeStakingMigrationCallData({
                userAddress: userAddress || '',
                stakedBalance,
                legacyGaugeAddress: '0x38f79beffc211c6c439b0a3d10a0a673ee63afb4',
                preferredGaugeAddress: '0xF27D53f21d024643d50de50183932F17638229F6',
            });
        },
        { enabled: !!userAddress },
    );

    return {
        ...query,
    };
}
