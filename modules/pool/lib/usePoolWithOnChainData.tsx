import { useQuery } from 'react-query';
import { useProvider } from 'wagmi';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { useGetTokens } from '~/lib/global/useToken';
import { poolOnChainBalanceService } from '~/lib/services/pool/pool-on-chain-balance.service';

export function usePoolWithOnChainData(pool: GqlPoolUnion) {
    const provider = useProvider();
    const { priceFor } = useGetTokens();

    const tokenPrices = pool.tokens.map((token) => ({ address: token.address, price: priceFor(token.address) }));

    return useQuery(['usePoolWithOnChainData', pool.id], async () => {
        return poolOnChainBalanceService.updatePoolWithOnChainBalanceData({ pool, provider, tokenPrices });
    });
}
