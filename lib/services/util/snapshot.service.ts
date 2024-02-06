import { Contract } from '@ethersproject/contracts';
import { networkConfig } from '~/lib/config/network-config';
import { BaseProvider } from '@ethersproject/providers';
import DelegateRegistryAbi from '~/lib/abi/DelegateRegistry.json';
import { Address } from 'wagmi';

export class SnapshotService {
    constructor(private readonly contractAddress: string) {}

    public async getDelegation({
        userAddress,
        provider,
        id,
    }: {
        userAddress: Address | undefined;
        provider: BaseProvider;
        id: string;
    }): Promise<string> {
        const contract = new Contract(this.contractAddress, DelegateRegistryAbi, provider);
        const address = await contract.delegation(userAddress, id);
        return address;
    }
}

export const snapshotService = new SnapshotService(networkConfig.snapshot.contractAddress);
