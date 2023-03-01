import { BaseProvider } from '@ethersproject/providers';
import VaultAbi from '~/lib/abi/VaultAbi.json';
import { BigNumber, Contract } from 'ethers';
import { networkConfig } from '~/lib/config/network-config';
import { AmountScaled } from '~/lib/services/token/token-types';

interface GetPoolTokensInput {
    poolId: string;
    provider: BaseProvider;
}

interface PoolTokensResponse {
    balances: BigNumber[];
    tokens: string[];
}

export class VaultService {
    constructor(private readonly vaultAddress: string) {}

    public async getPoolTokens({
        poolId,
        provider,
    }: GetPoolTokensInput): Promise<{ address: string; balanceScaled: AmountScaled }[]> {
        const vaultContract = new Contract(this.vaultAddress, VaultAbi, provider);
        const poolTokens: PoolTokensResponse = await vaultContract.getPoolTokens(poolId);

        return poolTokens.tokens.map((token, index) => ({ address: token, balanceScaled: poolTokens.balances[index] }));
    }
}

export const vaultService = new VaultService(networkConfig.balancer.vault);
