import { GqlPoolGyro } from '~/apollo/generated/graphql-codegen-generated';
import {
    PoolExitBptInSingleAssetWithdrawOutput,
    PoolExitData,
    PoolExitPoolContractCallData,
    PoolExitSingleAssetWithdrawForBptInOutput,
    PoolJoinContractCallData,
    PoolJoinData,
    PoolJoinEstimateOutput,
    PoolService,
} from '~/lib/services/pool/pool-types';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import {
    oldBnumPoolScaleTokenAmounts,
    poolGetProportionalExitAmountsForBptIn,
    poolGetProportionalJoinAmountsForFixedAmount,
    poolGetRequiredToken,
    poolScaleTokenAmounts,
    poolWeightedBptForTokensZeroPriceImpact,
    poolWeightedExactTokensInForBPTOut,
} from '~/lib/services/pool/lib/util';
import { replaceEthWithWeth } from '~/lib/services/token/token-util';
import { PoolProportionalInvestService } from './lib/pool-proportional-invest.service';
import { PoolBaseService } from './lib/pool-base.service';
import { WeightedPoolEncoder } from '@balancer-labs/balancer-js';
import { parseUnits } from 'ethers/lib/utils.js';
import { formatFixed } from '@ethersproject/bignumber';
import { oldBnum, oldBnumScaleAmount, oldBnumSubtractSlippage } from './lib/old-big-number';
import { BatchRelayerService } from '../batch-relayer/batch-relayer.service';
import * as SDK from '@georgeroman/balancer-v2-pools';

export class PoolGyroService implements PoolService {
    private readonly proportionalInvestService: PoolProportionalInvestService;
    private readonly baseService: PoolBaseService;

    constructor(
        private pool: GqlPoolGyro,
        private batchRelayerService: BatchRelayerService,
        private readonly wethAddress: string,
    ) {
        this.proportionalInvestService = new PoolProportionalInvestService(pool);
        this.baseService = new PoolBaseService(pool, wethAddress);
    }

    public updatePool(pool: GqlPoolGyro) {
        this.pool = pool;
        this.baseService.updatePool(pool);
        this.proportionalInvestService.updatePool(pool);
    }

    public async joinGetMaxProportionalForUserBalances(userInvestTokenBalances: TokenAmountHumanReadable[]) {
        const fixedAmount = await this.proportionalInvestService.getProportionalSuggestion(userInvestTokenBalances);

        const result = await this.joinGetProportionalSuggestionForFixedAmount(
            fixedAmount,
            userInvestTokenBalances.map((token) => replaceEthWithWeth(token.address)),
        );

        return result;
    }

    public async joinGetProportionalSuggestionForFixedAmount(
        fixedAmount: TokenAmountHumanReadable,
        tokensIn: string[],
    ): Promise<TokenAmountHumanReadable[]> {
        return poolGetProportionalJoinAmountsForFixedAmount(fixedAmount, this.pool.tokens);
    }

    public async joinGetContractCallData(data: PoolJoinData): Promise<PoolJoinContractCallData> {
        // rn gyro only supports "ALL_TOKENS_IN_FOR_EXACT_BPT_OUT"
        const bptAmountOut = 'minimumBpt' in data ? data.minimumBpt : '0';
        const assets = this.pool.tokens.map((token) =>
            data.wethIsEth ? this.baseService.wethToZero(token.address) : token.address,
        );
        const maxAmountsIn = poolScaleTokenAmounts(data.maxAmountsIn, this.pool.tokens);
        const userData = WeightedPoolEncoder.joinAllTokensInForExactBPTOut(parseUnits(bptAmountOut));

        if (
            (this.pool.staking?.type === 'MASTER_CHEF' && data.zapIntoMasterchefFarm) ||
            (this.pool.staking?.type === 'GAUGE' && data.zapIntoGauge)
        ) {
            return this.batchRelayerService.encodeJoinPoolAndStake({
                userData,
                pool: this.pool,
                assets,
                maxAmountsIn,
                userAddress: data.userAddress,
            });
        }

        return { type: 'JoinPool', assets, maxAmountsIn, userData };
    }

    public async joinGetBptOutAndPriceImpactForTokensIn(
        tokenAmountsIn: TokenAmountHumanReadable[],
        slippage: AmountHumanReadable,
    ): Promise<PoolJoinEstimateOutput> {
        // https://github.com/gyrostable/app/blob/f07cdec9e52585e5be6d3a916ce3833b1599f43c/src/utils/pools/findConstrainedMax.ts#LL15C1-L23C5
        const totalPoolBalance = this.pool.tokens
            .map((token) => token.balance)
            .reduce((a, b) => oldBnum(a).plus(b), oldBnum(0));
        const tokenProportions = this.pool.tokens.map((token) =>
            oldBnum(token.balance).div(totalPoolBalance).toString(),
        );

        const bptAmount = SDK.WeightedMath._calcBptOutGivenExactTokensIn(
            this.pool.tokens.map((token) => oldBnumScaleAmount(token.balance, token.decimals)),
            tokenProportions.map((proportion) => oldBnumScaleAmount(proportion || '0', 18)),
            oldBnumPoolScaleTokenAmounts(tokenAmountsIn, this.pool.tokens),
            oldBnumScaleAmount(this.pool.dynamicData.totalShares),
            oldBnumScaleAmount(this.pool.dynamicData.swapFee),
        );

        if (bptAmount.lt(0)) {
            return { priceImpact: 0, minBptReceived: '0' };
        }

        const minBptReceived = bptAmount.minus(bptAmount.times(slippage)).toFixed(0);

        return {
            priceImpact: 0,
            minBptReceived: formatFixed(minBptReceived.toString(), 18),
        };
    }

    public async exitGetProportionalWithdrawEstimate(
        bptIn: AmountHumanReadable,
        tokensOut: string[],
    ): Promise<TokenAmountHumanReadable[]> {
        return poolGetProportionalExitAmountsForBptIn(bptIn, this.pool.tokens, this.pool.dynamicData.totalShares);
    }

    public async exitGetBptInForSingleAssetWithdraw(
        tokenAmount: TokenAmountHumanReadable,
    ): Promise<PoolExitBptInSingleAssetWithdrawOutput> {
        // rn gyro does not support single asset withdraw
        return {
            bptIn: '0',
            priceImpact: 0,
        };
    }

    public async exitGetSingleAssetWithdrawForBptIn(
        bptIn: AmountHumanReadable,
        tokenOutAddress: string,
    ): Promise<PoolExitSingleAssetWithdrawForBptInOutput> {
        // rn gyro does not support single asset withdraw
        return {
            tokenAmount: '0',
            priceImpact: 0,
        };
    }

    public async exitGetContractCallData(data: PoolExitData): Promise<PoolExitPoolContractCallData> {
        // rn gyro only supports "EXACT_BPT_IN_FOR_TOKENS_OUT"
        const bptAmountIn = 'bptAmountIn' in data ? data.bptAmountIn : '0';
        const amountsOut = 'amountsOut' in data ? data.amountsOut : [];
        const minAmountsOut = amountsOut.map((amountOut) => {
            const token = this.pool.tokens.find((token) => token.address === amountOut.address);

            return {
                address: amountOut.address,
                amount: oldBnumSubtractSlippage(amountOut.amount, token?.decimals || 18, data.slippage),
            };
        });

        return {
            type: 'ExitPool',
            assets: this.pool.tokens.map((token) => token.address),
            minAmountsOut: poolScaleTokenAmounts(minAmountsOut, this.pool.tokens),
            userData: WeightedPoolEncoder.exitExactBPTInForTokensOut(parseUnits(bptAmountIn)),
        };
    }
}
