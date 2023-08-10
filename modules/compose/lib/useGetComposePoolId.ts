import { Contract } from 'ethers';
import { Interface } from 'ethers/lib/utils.js';
import { useQuery } from 'react-query';
import { useProvider } from 'wagmi';
import WeightedPoolFactoryV4 from '~/lib/abi/WeightedPoolFactoryV4.json';
import { networkConfig } from '~/lib/config/network-config';

export default function useGetComposePoolId(createHash: string) {
    const provider = useProvider();

    const {
        data: poolId,
        refetch: getCreatedPoolId,
        ...rest
    } = useQuery(
        ['createdPoolId', createHash],
        async () => {
            const receipt = await provider.getTransactionReceipt(createHash);
            if (!receipt) return null;

            const weightedPoolFactoryInterface = new Interface(WeightedPoolFactoryV4);

            const poolCreationEvent = receipt.logs
                .filter((log) => log.address === networkConfig.balancer.weightedPoolFactory)
                .map((log) => {
                    try {
                        return weightedPoolFactoryInterface.parseLog(log);
                    } catch {
                        return null;
                    }
                })
                .find((parsedLog) => parsedLog?.name === 'PoolCreated');

            if (!poolCreationEvent) return null;
            const poolAddress = poolCreationEvent.args.pool;

            const pool = new Contract(poolAddress, weightedPoolFactoryInterface, provider);
            const poolId = await pool.getPoolId();

            return {
                id: poolId,
                address: poolAddress,
            };
        },
        {
            enabled: createHash !== '' && createHash !== null,
        },
    );

    return {
        poolId,
        getCreatedPoolId,
        ...rest,
    };
}
