import { useQuery } from 'react-query';
import { useProvider } from 'wagmi';
import { poolGetPoolData } from '~/lib/services/pool/lib/util';

export function usePoolGetPoolData(poolIds: string[]) {
    const provider = useProvider();

    const query = useQuery(['usePoolGetPoolData', poolIds], async () => {
        return poolGetPoolData({
            poolIds,
            provider,
        });
    });

    return query;
}
