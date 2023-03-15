import { useQuery } from 'react-query';
import { useProvider } from 'wagmi';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { poolOnChainBalanceService } from '~/lib/services/pool/pool-on-chain-balance.service';

export function usePoolWithOnChainData(pool: GqlPoolUnion) {
    const provider = useProvider();

    return useQuery(['usePoolWithOnChainData', pool.id], async () => {
        return poolOnChainBalanceService.updatePoolWithOnChainBalanceData({ pool, provider });
    });
}
