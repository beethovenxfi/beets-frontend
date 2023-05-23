import { AmountHumanReadable, TokenBase } from '~/lib/services/token/token-types';
import { BaseProvider } from '@ethersproject/providers';
import LiquidityGaugeV5Abi from '~/lib/abi/LiquidityGaugeV5.json';
import LiquidityGaugeV6Abi from '~/lib/abi/LiquidityGaugeV6.json';
import ChildChainGaugeRewardHelper from '~/lib/abi/ChildChainGaugeRewardHelper.json';
import { BigNumber, Contract } from 'ethers';
import { formatFixed, parseFixed } from '@ethersproject/bignumber';
import ERC20Abi from '~/lib/abi/ERC20.json';
import { Multicaller } from '~/lib/services/util/multicaller.service';
import { GqlPoolStakingGauge } from '~/apollo/generated/graphql-codegen-generated';
import { networkConfig } from '~/lib/config/network-config';
import { StakingPendingRewardAmount } from '~/lib/services/staking/staking-types';
import { BatchRelayerService, batchRelayerService } from '../batch-relayer/batch-relayer.service';
import { mapValues } from 'lodash';

interface GetUserStakedBalanceInput {
    userAddress: string;
    gaugeAddress: string;
    provider: BaseProvider;
    decimals?: number;
}

export class GaugeStakingService {
    constructor(
        private readonly chainId: string,
        private readonly gaugeRewardHelperAddress: string,
        private readonly batchRelayerService: BatchRelayerService,
    ) {}

    public async getUserStakedBalance({
        userAddress,
        provider,
        gaugeAddress,
        decimals = 18,
    }: GetUserStakedBalanceInput): Promise<AmountHumanReadable> {
        const gaugeContract = new Contract(gaugeAddress, LiquidityGaugeV5Abi, provider);
        const balance = await gaugeContract.balanceOf(userAddress);

        return formatFixed(balance, decimals);
    }

    public async getGaugeTokenBalance({
        tokenAddress,
        gaugeAddress,
        provider,
        decimals = 18,
    }: {
        tokenAddress: string;
        gaugeAddress: string;
        provider: BaseProvider;
        decimals?: number;
    }): Promise<AmountHumanReadable> {
        const tokenContract = new Contract(tokenAddress, ERC20Abi, provider);
        const response: BigNumber = await tokenContract.balanceOf(gaugeAddress);

        return formatFixed(response, decimals);
    }

    public async getPendingRewards({
        userAddress,
        gauges,
        tokens,
        provider,
    }: {
        userAddress: string;
        gauges: GqlPoolStakingGauge[];
        tokens: TokenBase[];
        provider: BaseProvider;
    }): Promise<StakingPendingRewardAmount[]> {
        const multicaller = new Multicaller(this.chainId, provider, ChildChainGaugeRewardHelper);

        for (const gauge of gauges) {
            for (const reward of gauge.rewards) {
                multicaller.call(
                    `${gauge.id}.${reward.tokenAddress}`,
                    this.gaugeRewardHelperAddress,
                    'pendingRewards',
                    [gauge.gaugeAddress, userAddress, reward.tokenAddress],
                );
            }
        }

        if (multicaller.numCalls === 0) {
            return [];
        }

        const result: {
            [gaugeId: string]: {
                [tokenAddress: string]: BigNumber;
            };
        } = await multicaller.execute({});

        const pendingRewardAmounts: StakingPendingRewardAmount[] = [];

        for (const gauge of gauges) {
            for (const reward of gauge.rewards) {
                if (result[gauge.id][reward.tokenAddress]) {
                    const token = tokens.find((token) => token.address === reward.tokenAddress.toLowerCase());

                    pendingRewardAmounts.push({
                        address: reward.tokenAddress,
                        amount: formatFixed(result[gauge.id][reward.tokenAddress], token?.decimals || 18),
                        id: gauge.id,
                    });
                }
            }
        }

        return pendingRewardAmounts;
    }

    public async getPendingBALRewards({
        userAddress,
        gauges,
        provider,
    }: {
        userAddress: string;
        gauges: string[];
        provider: BaseProvider;
    }) {
        const multicaller = new Multicaller(this.chainId, provider, LiquidityGaugeV6Abi);

        for (const gauge of gauges) {
            multicaller.call(`${gauge}.claimableBAL`, gauge, 'claimable_tokens', [userAddress]);
        }

        if (multicaller.numCalls === 0) {
            return {};
        }

        const result: {
            [gaugeId: string]: {
                claimableBAL: BigNumber;
            };
        } = await multicaller.execute({});

        const formattedResult = mapValues(result, (data) => data.claimableBAL.toString());
        return formattedResult;
    }

    public async getGaugeStakingMigrationCallData({
        userAddress,
        stakedBalance,
        legacyGaugeAddress,
        preferredGaugeAddress,
    }: {
        userAddress: string;
        stakedBalance: string;
        legacyGaugeAddress: string;
        preferredGaugeAddress: string;
    }): Promise<string[]> {
        const stakedBalanceScaled = parseFixed(stakedBalance, 18);

        const withdrawFromLegacyGauge = this.batchRelayerService.gaugeEncodeWithdraw({
            sender: userAddress,
            recipient: networkConfig.balancer.batchRelayer,
            amount: stakedBalanceScaled.toString(),
            gauge: legacyGaugeAddress,
        });

        const depositToPreferredGauge = this.batchRelayerService.gaugeEncodeDeposit({
            sender: userAddress,
            recipient: networkConfig.balancer.batchRelayer,
            amount: stakedBalanceScaled.toString(),
            gauge: preferredGaugeAddress,
        });

        //below we use the output values of the peek to set our min/max values
        return [withdrawFromLegacyGauge];
    }
}

export const gaugeStakingService = new GaugeStakingService(
    networkConfig.chainId,
    networkConfig.gauge.rewardHelperAddress,
    batchRelayerService,
);
