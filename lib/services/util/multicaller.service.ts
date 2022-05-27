import set from 'lodash/set';
import { BaseProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { Interface } from '@ethersproject/abi';
import { networkConfig } from '~/lib/config/network-config';

export class Multicaller {
    private calls: any[] = [];
    private paths: any[] = [];

    constructor(
        private readonly network: string,
        private readonly provider: BaseProvider,
        private readonly abi: any[],
        private readonly options: any = {},
    ) {}

    public call(path: string, address: string, fn: string, params?: any) {
        this.calls.push([address, fn, params]);
        this.paths.push(path);
    }

    async execute(from?: any): Promise<any> {
        const obj = from || {};
        const result = await multicall(this.network, this.provider, this.abi, this.calls, this.options);
        result.forEach((r, i) => set(obj, this.paths[i], r));
        this.calls = [];
        this.paths = [];
        return obj;
    }

    public get numCalls(): number {
        return this.calls.length;
    }
}

export async function multicall<T>(
    network: string,
    provider: BaseProvider,
    abi: any[],
    calls: any[],
    options: any = {},
    requireSuccess = false,
): Promise<(T | null)[]> {
    const multi = new Contract(
        networkConfig.multicall,
        [
            'function tryAggregate(bool requireSuccess, tuple(address, bytes)[] memory calls) public view returns (tuple(bool, bytes)[] memory returnData)',
        ],
        provider,
    );
    const itf = new Interface(abi);
    try {
        const res: [boolean, string][] = await multi.tryAggregate(
            // if false, allows individual calls to fail without causing entire multicall to fail
            requireSuccess,
            calls.map((call) => [call[0].toLowerCase(), itf.encodeFunctionData(call[1], call[2])]),
            options,
        );

        return res.map(([success, returnData], i) => {
            if (!success) return null;
            const decodedResult = itf.decodeFunctionResult(calls[i][1], returnData);
            // Automatically unwrap any simple return values
            return decodedResult.length > 1 ? decodedResult : decodedResult[0];
        });
    } catch (e) {
        return Promise.reject(e);
    }
}
