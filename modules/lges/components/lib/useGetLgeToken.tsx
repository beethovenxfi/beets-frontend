import { useMultiCall } from '~/lib/util/useMultiCall';
import ERC20Abi from '~/lib/abi/ERC20.json';

export function useGetLgeToken(address: string) {
    const { data, isError, isLoading } = useMultiCall({
        abi: ERC20Abi,
        enabled: true,
        calls: [
            { address, functionName: 'symbol' },
            { address, functionName: 'decimals' },
            { address, functionName: 'name' },
        ],
    });

    const token = data && {
        symbol: data[0] as string,
        decimals: data[1] as number,
        name: data[2] as string,
    };
    return { token };
}
