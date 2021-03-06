import { JsonRpcProvider } from '@ethersproject/providers';
import { networkConfig } from '~/lib/config/network-config';

type NewBlockHandler = (blockNumber: number) => any;

export class RpcProviderService {
    private readonly jsonProvider: JsonRpcProvider;

    constructor(private readonly rpcUrl: string) {
        this.jsonProvider = new JsonRpcProvider(this.rpcUrl);
    }

    public initBlockListener(newBlockHandler: NewBlockHandler): void {
        this.jsonProvider.on('block', (newBlockNumber) => {
            newBlockHandler(newBlockNumber);
        });
    }

    public async getBlockNumber(): Promise<number> {
        return await this.jsonProvider.getBlockNumber();
    }

    public getJsonProvider(): JsonRpcProvider {
        return new JsonRpcProvider(this.rpcUrl);
    }
}

export const rpcProviderService = new RpcProviderService(networkConfig.rpcUrl);
