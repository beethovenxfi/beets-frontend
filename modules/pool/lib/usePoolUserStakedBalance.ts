import { usePool } from '~/modules/pool/lib/usePool';
import { useAccount, useProvider } from 'wagmi';
import { masterChefService } from '~/lib/services/master-chef/master-chef.service';
import { useQuery } from 'react-query';

export function usePoolUserStakedBalance() {
    const { pool } = usePool();
    const { data: accountData } = useAccount();
    const provider = useProvider();

    return useQuery(
        ['poolUserStakedBalance', pool.id, pool.staking?.id || '', accountData?.address || ''],
        async () => {
            if (pool.staking?.type === 'MASTER_CHEF' && accountData?.address) {
                return masterChefService.getUserStakedBalance({
                    userAddress: accountData.address,
                    farmId: pool.staking.id,
                    provider,
                });
            }

            return '0';
        },
        {},
    );
}
