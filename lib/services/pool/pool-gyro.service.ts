import { GqlPoolGyro } from '~/apollo/generated/graphql-codegen-generated';
import {
    ComposablePoolJoinProcessedStepsOutput,
    PoolExitContractCallData,
    PoolExitData,
    PoolJoinContractCallData,
    PoolJoinData,
    PoolJoinEstimateOutput,
    PoolService,
} from '~/lib/services/pool/pool-types';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import {
    poolGetNestedTokenEstimateForPoolTokenAmounts,
    poolGetPoolTokenForPossiblyNestedTokenOut,
    poolGetProportionalJoinAmountsForFixedAmount,
} from '~/lib/services/pool/lib/util';
import { replaceEthWithWeth } from '~/lib/services/token/token-util';
import { PoolProportionalInvestService } from './lib/pool-proportional-invest.service';
import { PoolBaseService } from './lib/pool-base.service';
import { BatchRelayerService } from '../batch-relayer/batch-relayer.service';
import { networkProvider } from '~/lib/global/network';
import { PoolComposableJoinService } from './lib/pool-composable-join.service';
import { PoolComposableExitService } from './lib/pool-composable-exit.service';

export class PoolGyroService implements PoolService {
    private readonly proportionalInvestService: PoolProportionalInvestService;
    private readonly baseService: PoolBaseService;
    private readonly composableJoinService: PoolComposableJoinService;
    private readonly composableExitService: PoolComposableExitService;

    constructor(
        private pool: GqlPoolGyro,
        private batchRelayerService: BatchRelayerService,
        private readonly wethAddress: string,
    ) {
        this.proportionalInvestService = new PoolProportionalInvestService(pool);
        this.baseService = new PoolBaseService(pool, wethAddress);
        this.composableJoinService = new PoolComposableJoinService(
            pool,
            batchRelayerService,
            networkProvider,
            wethAddress,
        );
        this.composableExitService = new PoolComposableExitService(
            pool,
            batchRelayerService,
            networkProvider,
            wethAddress,
        );
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
        if (parseFloat(fixedAmount.amount) === 0) {
            return tokensIn.map((address) => ({ address, amount: '0.0' }));
        }

        //map fixedAmount to the corresponding BPT
        const poolToken = poolGetPoolTokenForPossiblyNestedTokenOut(this.pool, fixedAmount.address);
        const { processedSteps } = await this.composableJoinService.processJoinSteps({
            tokenAmountsIn: [fixedAmount],
            slippage: '0',
        });
        const joinStep = processedSteps.find((step) => step.type === 'Join' && step.pool.id === this.pool.id)!;
        const poolTokenFixedAmount = joinStep.tokenAmountsIn.find(
            (amountIn) => amountIn.address === poolToken?.address,
        );

        if (!poolTokenFixedAmount) {
            throw new Error('Gyro: failed to map fixed amount to pool token fixed amount');
        }

        //get the corresponding pool token amounts
        const proportionalSuggestion = poolGetProportionalJoinAmountsForFixedAmount(
            poolTokenFixedAmount,
            this.pool.tokens,
        );

        //map pool token amounts to invest token amounts
        return poolGetNestedTokenEstimateForPoolTokenAmounts({
            pool: this.pool,
            nestedTokens: tokensIn,
            poolTokenAmounts: proportionalSuggestion,
        });
    }

    public async joinGetContractCallData(data: PoolJoinData): Promise<PoolJoinContractCallData> {
        // rn gyro only supports "ALL_TOKENS_IN_FOR_EXACT_BPT_OUT"
        // TODO check this again
        if (data.kind !== 'ExactTokensInForBPTOut') {
            throw new Error('unsupported join type');
        }

        const { processedSteps } = await this.getJoinData(data.maxAmountsIn, data.slippage);

        return this.composableJoinService.joinGetContractCallData({
            data,
            processedSteps,
        });
    }

    private async getJoinData(
        tokenAmountsIn: TokenAmountHumanReadable[],
        slippage: AmountHumanReadable,
    ): Promise<ComposablePoolJoinProcessedStepsOutput> {
        const data = await this.composableJoinService.processJoinSteps({
            tokenAmountsIn,
            slippage,
        });

        //TODO: cache data while tokenAmountsIn and slippage are constant
        return data;
    }

    public async joinGetBptOutAndPriceImpactForTokensIn(
        tokenAmountsIn: TokenAmountHumanReadable[],
        slippage: AmountHumanReadable,
    ): Promise<PoolJoinEstimateOutput> {
        const { priceImpact, minBptReceived, nestedPriceImpacts } = await this.getJoinData(tokenAmountsIn, slippage);

        return {
            priceImpact,
            minBptReceived,
            nestedPriceImpacts,
        };
    }

    public async exitGetProportionalWithdrawEstimate(
        bptIn: AmountHumanReadable,
        tokensOut: string[],
    ): Promise<TokenAmountHumanReadable[]> {
        return this.composableExitService.exitGetProportionalWithdrawEstimate(bptIn, tokensOut);
    }

    public async exitGetContractCallData(data: PoolExitData): Promise<PoolExitContractCallData> {
        // rn gyro only supports "EXACT_BPT_IN_FOR_TOKENS_OUT"
        if (data.kind === 'ExactBPTInForTokensOut') {
            return this.composableExitService.exitExactBPTInForTokensOutGetContractCallData(data);
        }

        throw new Error('unsupported exit type');
    }
}
