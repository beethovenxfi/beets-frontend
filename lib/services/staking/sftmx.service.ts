import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { BaseProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { networkConfig } from '~/lib/config/network-config';
import FTMStakingAbi from '~/lib/abi/FTMStaking.json';
import { parseUnits } from 'ethers/lib/utils.js';
import { BigNumber } from 'ethers';

export class SftmxService {
    constructor(private readonly ftmStakingProxyAddress: string) {}

    public async getCalculatePenalty({
        amount,
        provider,
    }: {
        amount: AmountHumanReadable;
        provider: BaseProvider;
    }): Promise<{
        amountFtmReceived: BigNumber;
        amountUndelegated: BigNumber;
        amountPenalty: BigNumber;
    }> {
        const contract = new Contract(this.ftmStakingProxyAddress, FTMStakingAbi, provider);
        const response = await contract.calculatePenalty(parseUnits(amount, 18));
        return { amountFtmReceived: response[0], amountUndelegated: response[1], amountPenalty: response[2] };
    }

    public async getFtmxAmountForFtm({
        amount,
        provider,
    }: {
        amount: AmountHumanReadable;
        provider: BaseProvider;
    }): Promise<{ amountSftmx: BigNumber }> {
        const contract = new Contract(this.ftmStakingProxyAddress, FTMStakingAbi, provider);
        const response = await contract.getFTMxAmountForFTM(parseUnits(amount, 18), false);
        return { amountSftmx: response };
    }

    public async getAllWithdrawalRequests({ wrId, provider }: { wrId: string; provider: BaseProvider }): Promise<{
        requestTime: BigNumber;
        poolAmount: BigNumber;
        undelegateAmount: BigNumber;
        penalty: BigNumber;
        user: string;
        isWithdrawn: boolean;
    }> {
        const contract = new Contract(this.ftmStakingProxyAddress, FTMStakingAbi, provider);
        const response = await contract.allWithdrawalRequests(wrId);
        return {
            requestTime: response[0],
            poolAmount: response[1],
            undelegateAmount: response[2],
            penalty: response[3],
            user: response[4],
            isWithdrawn: response[5],
        };
    }
}

export const sftmxService = new SftmxService(networkConfig.sftmx.ftmStakingProxyAddress);
