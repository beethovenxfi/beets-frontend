import { useQuery } from 'react-query';
import { useGetContructorArgs } from './useGetConstructorArgs';
import { Etherscan } from 'etherscan-ts';
import sourceCode from './weighted_pool_v4.json';

export function useVerifyPool(poolAddress = '0x10BCbF32D59c416323f9A3C40634C3c5A0dAf925') {
    const etherscan = new Etherscan(
        process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || '',
        process.env.NEXT_PUBLIC_ETHERSCAN_API_URL,
    );

    console.log({ etherscan });

    const { data: constructorArguements, isLoading } = useGetContructorArgs(poolAddress);

    console.log({ constructorArguements });

    return useQuery(
        ['verifyPool', poolAddress],
        async () => {
            const result = await etherscan.postVerifySourceCode(
                poolAddress,
                JSON.stringify(sourceCode),
                'solidity-standard-json-input',
                'WeightedPool',
                'v0.7.1+commit.f4a555be',
                '',
                constructorArguements || '',
                5,
            );

            return result;
        },
        { enabled: poolAddress !== '' },
    );
}
