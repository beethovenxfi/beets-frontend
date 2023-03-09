import { BigNumber } from 'ethers';
import { useQuery } from 'react-query';
import { useProvider } from 'wagmi';
import { poolGetPoolData } from '~/lib/services/pool/pool-util';

export function usePoolGetPoolData(poolIds: string[]) {
    const provider = useProvider();

    const query = useQuery(['usePoolGetPoolData', poolIds], async () => {
        return poolGetPoolData({
            poolIds,
            provider,
        });
    });

    const balances = query.data?.balances.map((balances) =>
        balances.map((balance) => BigNumber.from(balance).abs().toString()),
    );

    const totalSupplies = query.data?.totalSupplies.map((totalSupply) => BigNumber.from(totalSupply).abs().toString());

    return {
        ...query,
        data: {
            ...query.data,
            balances,
            totalSupplies,
        },
    };
}
