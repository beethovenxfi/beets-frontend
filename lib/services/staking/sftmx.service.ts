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
}

export const sftmxService = new SftmxService(networkConfig.sftmx.ftmStakingProxyAddress);
