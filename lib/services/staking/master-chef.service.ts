import { AmountHumanReadable, TokenBase } from '~/lib/services/token/token-types';
import { Contract } from '@ethersproject/contracts';
import { networkConfig } from '~/lib/config/network-config';
import { BaseProvider } from '@ethersproject/providers';
import BeethovenxMasterChefAbi from '~/lib/abi/BeethovenxMasterChef.json';
import TimeBasedRewarderAbi from '~/lib/abi/TimeBasedRewarder.json';
import ERC20Abi from '~/lib/abi/ERC20.json';
import { BigNumber } from 'ethers';
import { formatFixed } from '@ethersproject/bignumber';
import { forEach } from 'lodash';
import { Multicaller } from '~/lib/services/util/multicaller.service';
import { GqlPoolStakingMasterChefFarm } from '~/apollo/generated/graphql-codegen-generated';
import { StakingPendingRewardAmount } from '~/lib/services/staking/staking-types';

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

    public async getMasterChefTokenBalance({
        address,
        provider,
        decimals,
    }: {
        address: string;
        provider: BaseProvider;
        decimals: number;
    }): Promise<AmountHumanReadable> {
        const tokenContract = new Contract(address, ERC20Abi, provider);
        const response: BigNumber = await tokenContract.balanceOf(this.masterChefContractAddress);

        return formatFixed(response, decimals);
    }

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
    }): Promise<StakingPendingRewardAmount[]> {
        const multicaller = new Multicaller(this.chainId, provider, mergedAbi);

        for (const farm of farms) {
            multicaller.call(`${farm.id}.pendingBeets`, this.masterChefContractAddress, 'pendingBeets', [
                farm.id,
                userAddress,
            ]);

            const farmRewarders = farm.rewarders || [];

            if (farmRewarders.length > 0) {
                //a farm will only ever have one rewarder, but the rewarder can have many tokens
                multicaller.call(`${farm.id}.pendingRewards`, farmRewarders[0].address, 'pendingTokens', [
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

        const pendingRewardAmounts: StakingPendingRewardAmount[] = [];

        forEach(result, ({ pendingRewards, pendingBeets }, farmId) => {
            if (pendingBeets && pendingBeets.gt(0)) {
                pendingRewardAmounts.push({
                    address: this.beetsAddress.toLowerCase(),
                    amount: formatFixed(pendingBeets, 18),
                    id: farmId,
                });
            }

            if (pendingRewards) {
                for (let i = 0; i < pendingRewards.rewardTokens.length; i++) {
                    if (pendingRewards.rewardAmounts[i].gt(0)) {
                        const token = tokens.find(
                            (token) => token.address === pendingRewards.rewardTokens[i].toLowerCase(),
                        );

                        pendingRewardAmounts.push({
                            address: pendingRewards.rewardTokens[i].toLowerCase(),
                            amount: formatFixed(pendingRewards.rewardAmounts[i], token?.decimals || 18),
                            id: farmId,
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
