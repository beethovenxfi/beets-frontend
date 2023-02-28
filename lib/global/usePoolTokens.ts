import { useQuery } from 'react-query';
import { useProvider } from 'wagmi';
import { vaultService } from '~/lib/services/staking/vault.service';
import { useGetTokens } from './useToken';
import { formatFixed } from '@ethersproject/bignumber';
import { BigNumber } from 'ethers';

export function usePoolTokens(poolId: string) {
    const provider = useProvider();
    const { getToken } = useGetTokens();

    const query = useQuery(['usePoolTokens', poolId], async () => {
        return vaultService.getPoolTokens({
            poolId,
            provider,
        });
    });

    const poolTokens = query?.data?.map((item: [string, BigNumber]) => {
        const token = getToken(item[0] || '');
        const decimals = token ? token.decimals : 18;

        return {
            address: token?.address,
            amount: formatFixed(item[1], decimals),
        };
    });

    return {
        ...query,
        poolTokens,
    };
}
