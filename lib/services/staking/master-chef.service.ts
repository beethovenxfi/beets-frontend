import { AmountHumanReadable, TokenBase } from '~/lib/services/token/token-types';
import { Contract } from '@ethersproject/contracts';
import { networkConfig } from '~/lib/config/network-config';
import { BaseProvider } from '@ethersproject/providers';
import BeethovenxMasterChefAbi from '~/lib/abi/BeethovenxMasterChef.json';
import TimeBasedRewarderAbi from '~/lib/abi/TimeBasedRewarder.json';
import { BigNumber } from 'ethers';
import { formatFixed } from '@ethersproject/bignumber';
import { forEach } from 'lodash';
import { Multicaller } from '~/lib/services/util/multicaller.service';
import { GqlPoolStakingMasterChefFarm } from '~/apollo/generated/graphql-codegen-generated';

interface MasterChefFarmPendingRewardAmount {
    farmId: string;
    address: string;
    amount: AmountHumanReadable;
}

interface MasterchefRewarder {
    farmId: string;
    address: string;
}

const mergedAbi = Object.values(
    // Remove duplicate entries using their names
    Object.fromEntries([...BeethovenxMasterChefAbi, ...TimeBasedRewarderAbi].map((row) => [row.name, row])),
);

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

    /*public async getPendingBeetsForFarm({
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
    }): Promise<MasterChefFarmPendingRewardAmount[]> {
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
    }*/

    public async getPendingRewards({
        farms,
        userAddress,
        tokens,
        provider,
    }: {
        farms: GqlPoolStakingMasterChefFarm[];
        userAddress: string;
        tokens: TokenBase[];
        provider: BaseProvider;
    }): Promise<MasterChefFarmPendingRewardAmount[]> {
        const multicaller = new Multicaller(this.chainId, provider, mergedAbi);

        for (const farm of farms) {
            if (parseFloat(farm.beetsPerBlock) > 0) {
                multicaller.call(`${farm.id}.pendingBeets`, this.masterChefContractAddress, 'pendingBeets', [
                    farm.id,
                    userAddress,
                ]);
            }

            const rewardersWithRewards = (farm.rewarders || []).filter(
                (rewarder) => parseFloat(rewarder.rewardPerSecond) > 0,
            );

            if (rewardersWithRewards.length > 0) {
                //a farm will only ever have one rewarder, but the rewarder can have many tokens
                multicaller.call(`${farm.id}.pendingRewards`, rewardersWithRewards[0].address, 'pendingTokens', [
                    farm.id,
                    userAddress,
                    0,
                ]);
            }
        }

        if (multicaller.numCalls === 0) {
            return [];
        }

        const result: {
            [farmId: string]: {
                pendingBeets?: BigNumber;
                pendingRewards?: {
                    rewardTokens: string[];
                    rewardAmounts: BigNumber[];
                };
            };
        } = await multicaller.execute({});

        const pendingRewardAmounts: MasterChefFarmPendingRewardAmount[] = [];

        forEach(result, ({ pendingRewards, pendingBeets }, farmId) => {
            if (pendingBeets && pendingBeets.gt(0)) {
                pendingRewardAmounts.push({
                    address: this.beetsAddress,
                    amount: formatFixed(pendingBeets, 18),
                    farmId,
                });
            }

            if (pendingRewards) {
                for (let i = 0; i < pendingRewards.rewardTokens.length; i++) {
                    if (pendingRewards.rewardAmounts[i].gt(0)) {
                        const token = tokens.find(
                            (token) => token.address === pendingRewards.rewardTokens[i].toLowerCase(),
                        );

                        pendingRewardAmounts.push({
                            address: pendingRewards.rewardTokens[i],
                            amount: formatFixed(pendingRewards.rewardAmounts[i], token?.decimals || 18),
                            farmId,
                        });
                    }
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
