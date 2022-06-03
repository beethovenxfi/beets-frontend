import { useQuery } from 'react-query';
import { GqlPoolStakingMasterChefFarm } from '~/apollo/generated/graphql-codegen-generated';
import { useAccount, useProvider } from 'wagmi';
import { masterChefService } from '~/lib/services/staking/master-chef.service';
import { useGetTokens } from '~/lib/global/useToken';

export function useMasterChefPendingRewards(farms: GqlPoolStakingMasterChefFarm[]) {
    const provider = useProvider();
    const { data: accountData } = useAccount();
    const { tokens } = useGetTokens();
    const farmIds = farms.map((farm) => farm.id);

    return useQuery(
        ['masterChefPendingRewards', accountData?.address, farmIds],
        () => {
            return masterChefService.getPendingRewards({
                farms,
                provider,
                tokens,
                userAddress: accountData?.address || '',
            });
        },
        { enabled: !!accountData?.address && farms.length > 0 },
    );
}
