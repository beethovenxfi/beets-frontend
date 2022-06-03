import { usePool } from '~/modules/pool/lib/usePool';
import { useAccount, useProvider } from 'wagmi';
import { masterChefService } from '~/lib/services/staking/master-chef.service';
import { useQuery } from 'react-query';
import { freshBeetsService } from '~/lib/services/staking/fresh-beets.service';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { useGetFbeetsRatioQuery } from '~/apollo/generated/graphql-codegen-generated';

export function usePoolUserStakedBalance() {
    const { pool } = usePool();
    const { data: accountData } = useAccount();
    const provider = useProvider();
    const { data: fBeets } = useGetFbeetsRatioQuery();

    return useQuery(
        ['poolUserStakedBalance', pool.id, pool.staking?.id || '', accountData?.address || ''],
        async (): Promise<AmountHumanReadable> => {
            if (!accountData?.address || !pool.staking) {
                return '0';
            }

            switch (pool.staking.type) {
                case 'MASTER_CHEF':
                    return masterChefService.getUserStakedBalance({
                        userAddress: accountData.address,
                        farmId: pool.staking.id,
                        provider,
                    });
                case 'FRESH_BEETS':
                    return freshBeetsService.getUserStakedBalance({
                        userAddress: accountData.address,
                        farmId: pool.staking.id,
                        provider,
                        fBeetsRatio: fBeets?.ratio || '0',
                    });
                case 'GAUGE':
                    //TODO: implement
                    return '0';
            }
        },
        {},
    );
}
