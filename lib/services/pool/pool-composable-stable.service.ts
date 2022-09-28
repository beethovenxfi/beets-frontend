import { GqlPoolPhantomStable } from '~/apollo/generated/graphql-codegen-generated';
import {
    ComposablePoolJoinProcessedStepsOutput,
    PoolExitBptInSingleAssetWithdrawOutput,
    PoolExitContractCallData,
    PoolExitData,
    PoolExitSingleAssetWithdrawForBptInOutput,
    PoolJoinContractCallData,
    PoolJoinData,
    PoolJoinEstimateOutput,
    PoolService,
} from '~/lib/services/pool/pool-types';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { BaseProvider } from '@ethersproject/providers';
import { BatchRelayerService } from '~/lib/services/batch-relayer/batch-relayer.service';
import { PoolComposableJoinService } from '~/lib/services/pool/lib/pool-composable-join.service';
import { PoolComposableExitService } from '~/lib/services/pool/lib/pool-composable-exit.service';

export class PoolComposableStableService implements PoolService {
    private readonly composableJoinService: PoolComposableJoinService;
    private readonly composableExitService: PoolComposableExitService;

    constructor(
        private pool: GqlPoolPhantomStable,
        private batchRelayerService: BatchRelayerService,
        private readonly wethAddress: string,
        private readonly provider: BaseProvider,
    ) {
        this.composableJoinService = new PoolComposableJoinService(pool, batchRelayerService, provider, wethAddress);
        this.composableExitService = new PoolComposableExitService(pool, batchRelayerService, provider, wethAddress);
    }

    public updatePool(pool: GqlPoolPhantomStable) {
        this.pool = pool;
        this.composableJoinService.updatePool(pool);
    }

    public async joinGetContractCallData(data: PoolJoinData): Promise<PoolJoinContractCallData> {
        if (data.kind !== 'ExactTokensInForBPTOut') {
            throw new Error('unsupported join type');
        }

        const { processedSteps } = await this.getJoinData(data.tokenAmountsIn, data.slippage);

        return this.composableJoinService.joinGetContractCallData({
            data,
            processedSteps,
        });
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

    public async exitGetProportionalWithdrawEstimate(
        bptIn: AmountHumanReadable,
        tokensOut: string[],
    ): Promise<TokenAmountHumanReadable[]> {
        return this.composableExitService.exitGetProportionalWithdrawEstimate(bptIn, tokensOut);
    }

    public async exitGetProportionalPoolTokenWithdrawEstimate(
        bptIn: AmountHumanReadable,
    ): Promise<TokenAmountHumanReadable[]> {
        return this.composableExitService.exitGetProportionalPoolTokenWithdrawEstimate(bptIn);
    }

    public async exitGetBptInForSingleAssetWithdraw(
        tokenAmount: TokenAmountHumanReadable,
    ): Promise<PoolExitBptInSingleAssetWithdrawOutput> {
        return this.composableExitService.exitGetBptInForSingleAssetWithdraw(tokenAmount);
    }

    public async exitGetSingleAssetWithdrawForBptIn(
        bptIn: AmountHumanReadable,
        tokenOutAddress: string,
    ): Promise<PoolExitSingleAssetWithdrawForBptInOutput> {
        return this.composableExitService.exitGetSingleAssetWithdrawForBptIn(bptIn, tokenOutAddress);
    }

    public async exitGetContractCallData(data: PoolExitData): Promise<PoolExitContractCallData> {
        if (data.kind === 'ExactBPTInForTokensOut') {
            return this.composableExitService.exitExactBPTInForTokensOutGetContractCallData(data);
        } else if (data.kind === 'ExactBPTInForOneTokenOut') {
            return this.composableExitService.exitExactBPTInForOneTokenOutGetContractCallData(data);
        }

        throw new Error('unsupported join type');
    }
}
