import { AmountHumanReadable, TokenBase } from '~/lib/services/token/token-types';
import { Contract } from '@ethersproject/contracts';
import { networkConfig } from '~/lib/config/network-config';
import { BaseProvider } from '@ethersproject/providers';
import BeethovenxMasterChefAbi from '~/lib/abi/BeethovenxMasterChef.json';
import TimeBasedRewarderAbi from '~/lib/abi/TimeBasedRewarder.json';
import { BigNumber } from 'ethers';
import { formatFixed } from '@ethersproject/bignumber';
import { forEach, map } from 'lodash';
import { Multicaller } from '~/lib/services/util/multicaller.service';

interface PendingRewardAmount {
    farmId: string;
    address: string;
    amount: AmountHumanReadable;
}

interface MasterchefRewarder {
    farmId: string;
    address: string;
}

export class MasterChefService {
    constructor(
        private readonly masterChefContractAddress: string,
        private readonly chainId: string,
        private readonly beetsAddress: string,
    ) {}

    public async getUserStakedBalance({
        userAddress,
        farmId,
        provider,
    }: {
        userAddress: string;
        farmId: string;
        provider: BaseProvider;
    }): Promise<AmountHumanReadable> {
        const contract = new Contract(this.masterChefContractAddress, BeethovenxMasterChefAbi, provider);
        const response: { amount: BigNumber } = await contract.userInfo(farmId, userAddress);

        return formatFixed(response.amount, 18);
    }

    public async getPendingBeetsForFarm({
        farmId,
        user,
        provider,
    }: {
        farmId: string;
        user: string;
        provider: BaseProvider;
    }): Promise<AmountHumanReadable> {
        const contract = new Contract(this.masterChefContractAddress, BeethovenxMasterChefAbi, provider);
        const pendingBeets = await contract.pendingBeets(farmId, user);

        return formatFixed(pendingBeets, 18);
    }

    public async getPendingBeetsForFarms({
        farmIds,
        user,
        provider,
    }: {
        farmIds: string[];
        user: string;
        provider: BaseProvider;
    }): Promise<PendingRewardAmount[]> {
        const masterChefMultiCaller = new Multicaller(this.chainId, provider, BeethovenxMasterChefAbi);

        for (const farmId of farmIds) {
            masterChefMultiCaller.call(`${farmId}.pendingBeets`, this.masterChefContractAddress, 'pendingBeets', [
                farmId,
                user,
            ]);
        }

        const result = await masterChefMultiCaller.execute();

        return map(result, (item, farmId) => ({
            address: this.beetsAddress,
            farmId,
            amount: formatFixed(item.pendingBeets, 18),
        }));
    }

    public async getPendingRewards({
        rewarders,
        userAddress,
        tokens,
        provider,
    }: {
        rewarders: MasterchefRewarder[];
        userAddress: string;
        tokens: TokenBase[];
        provider: BaseProvider;
    }): Promise<PendingRewardAmount[]> {
        const rewarderMulticaller = new Multicaller(this.chainId, provider, TimeBasedRewarderAbi);

        for (const rewarder of rewarders) {
            rewarderMulticaller.call(`${rewarder.farmId}`, rewarder.address, 'pendingTokens', [
                rewarder.farmId,
                userAddress,
                0,
            ]);
        }

        const result: {
            [farmId: string]: { rewardTokens: string[]; rewardAmounts: BigNumber[] };
        } = await rewarderMulticaller.execute({});

        const pendingRewardAmounts: PendingRewardAmount[] = [];

        forEach(result, (item, farmId) => {
            for (let i = 0; i < item.rewardTokens.length; i++) {
                if (item.rewardAmounts[i].gt(0)) {
                    const token = tokens.find((token) => token.address === item.rewardTokens[i].toLowerCase());

                    pendingRewardAmounts.push({
                        address: item.rewardTokens[i],
                        amount: formatFixed(item.rewardAmounts[i], token?.decimals || 18),
                        farmId,
                    });
                }
            }
        });

        return pendingRewardAmounts;
    }
}

export const masterChefService = new MasterChefService(
    networkConfig.masterChefContractAddress,
    networkConfig.chainId,
    networkConfig.beets.address,
);
