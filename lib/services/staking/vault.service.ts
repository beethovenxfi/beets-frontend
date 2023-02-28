import { BaseProvider } from '@ethersproject/providers';
import VaultAbi from '~/lib/abi/VaultAbi.json';
import { BigNumber, Contract } from 'ethers';
import { networkConfig } from '~/lib/config/network-config';

interface GetPoolTokensInput {
    poolId: string;
    provider: BaseProvider;
}

interface PoolTokens {
    balances: BigNumber[];
    tokens: string[];
}

export class VaultService {
    constructor(private readonly vaultAddress: string) {}

    public async getPoolTokens({ poolId, provider }: GetPoolTokensInput): Promise<any> {
        const vaultContract = new Contract(this.vaultAddress, VaultAbi, provider);
        const poolTokens: PoolTokens = await vaultContract.getPoolTokens(poolId);
        const poolTokensArray = [poolTokens.tokens, poolTokens.balances];

        return poolTokensArray[0].map((_: any, colIndex: number) => poolTokensArray.map((row) => row[colIndex]));
    }
}

export const vaultService = new VaultService(networkConfig.balancer.vault);
