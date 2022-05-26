import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { Contract } from '@ethersproject/contracts';
import { networkConfig } from '~/lib/config/network-config';
import { BaseProvider } from '@ethersproject/providers';
import BeethovenxMasterChefAbi from '~/lib/abi/BeethovenxMasterChef.json';
import { BigNumber } from 'ethers';
import { formatFixed } from '@ethersproject/bignumber';

interface GetUserStakedBalanceInput {
    userAddress: string;
    farmId: string;
    provider: BaseProvider;
}

export class MasterChefService {
    constructor(private readonly masterChefContractAddress: string) {}

    public async getUserStakedBalance({
        userAddress,
        farmId,
        provider,
    }: GetUserStakedBalanceInput): Promise<AmountHumanReadable> {
        const contract = new Contract(this.masterChefContractAddress, BeethovenxMasterChefAbi, provider);
        const response: { amount: BigNumber } = await contract.userInfo(farmId, userAddress);

        return formatFixed(response.amount, 18);
    }
}

export const masterChefService = new MasterChefService(networkConfig.masterChefContractAddress);
