import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { BaseProvider } from '@ethersproject/providers';
import { masterChefService, MasterChefService } from '~/lib/services/staking/master-chef.service';
import { oldBnumScaleAmount, oldBnumToHumanReadable } from '~/lib/services/pool/lib/old-big-number';

interface GetUserStakedBalanceInput {
    userAddress: string;
    farmId: string;
    provider: BaseProvider;
    fBeetsRatio: string;
}

export class FreshBeetsService {
    constructor(private readonly masterChefService: MasterChefService) {}

    public async getUserStakedBalance({
        userAddress,
        farmId,
        provider,
        fBeetsRatio,
    }: GetUserStakedBalanceInput): Promise<AmountHumanReadable> {
        const stakedFbeets = await this.masterChefService.getUserStakedBalance({ provider, farmId, userAddress });

        return oldBnumToHumanReadable(oldBnumScaleAmount(stakedFbeets).times(fBeetsRatio));
    }
}

export const freshBeetsService = new FreshBeetsService(masterChefService);
