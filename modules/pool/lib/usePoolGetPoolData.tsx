import { BigNumber } from 'ethers';
import { useQuery } from 'react-query';
import { useProvider } from 'wagmi';
import { TotalSupplyType } from '~/lib/services/pool/pool-types';
import { poolGetPoolData } from '~/lib/services/pool/pool-util';

export function usePoolGetPoolData(poolIds: string[], totalSupplyTypes: TotalSupplyType[]) {
    const provider = useProvider();

    const query = useQuery(
        ['usePoolGetPoolData', poolIds],
        async () => {
            const response = await poolGetPoolData({
                poolIds,
                totalSupplyTypes,
                provider,
            });

            const balances = response.balances.map((balances) =>
                balances.map((balance) => BigNumber.from(balance).abs().toString()),
            );

            const totalSupplies = response.totalSupplies.map((totalSupply) =>
                BigNumber.from(totalSupply).abs().toString(),
            );

            return { ...response, balances, totalSupplies };
        },
        { enabled: !!poolIds.length, refetchInterval: 7500, cacheTime: 0 },
    );

    return query;
}
