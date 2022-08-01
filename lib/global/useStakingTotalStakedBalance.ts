import { useQuery } from 'react-query';
import { useProvider } from 'wagmi';
import { masterChefService } from '~/lib/services/staking/master-chef.service';
import { GqlPoolStaking } from '~/apollo/generated/graphql-codegen-generated';

export function useStakingTotalStakedBalance(poolAddress: string, staking: GqlPoolStaking) {
    const provider = useProvider();

    return useQuery(
        ['useStakingTotalStakedBalance', poolAddress, staking.id],
        () => {
            return masterChefService.getMasterChefTokenBalance({
                address: poolAddress,
                provider,
                decimals: 18,
            });
        },
        { refetchInterval: 30000 },
    );
}
