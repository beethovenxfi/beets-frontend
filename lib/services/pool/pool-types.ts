import { AmountHumanReadable, AmountScaledString, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { BigNumberish } from 'ethers';
import { SwapKind, BatchSwapStep, FundManagement } from '@balancer-labs/balancer-js';
import {
    GqlPoolLinear,
    GqlPoolLinearNested,
    GqlPoolPhantomStable,
    GqlPoolPhantomStableNested,
    GqlPoolToken,
    GqlPoolTokenBase,
    GqlPoolTokenExpanded,
    GqlPoolTokenLinear,
    GqlPoolTokenUnion,
    GqlPoolUnion,
    GqlPoolWeighted,
} from '~/apollo/generated/graphql-codegen-generated';
import { SwapV2 } from '@balancer-labs/sor';

export interface PoolService {
    updatePool(pool: GqlPoolUnion): void;

    joinGetProportionalSuggestionForFixedAmount?(
        fixedAmount: TokenAmountHumanReadable,
        tokensIn: string[],
    ): Promise<TokenAmountHumanReadable[]>;
    joinGetBptOutAndPriceImpactForTokensIn(
        tokenAmountsIn: TokenAmountHumanReadable[],
        slippage: AmountHumanReadable,
    ): Promise<PoolJoinEstimateOutput>;
    joinGetContractCallData(data: PoolJoinData): Promise<PoolJoinContractCallData>;

    exitGetProportionalWithdrawEstimate(
        bptIn: AmountHumanReadable,
        tokensIn: string[],
    ): Promise<TokenAmountHumanReadable[]>;
    exitGetSingleAssetWithdrawForBptIn(
        bptIn: AmountHumanReadable,
        tokenOutAddress: string,
    ): Promise<PoolExitSingleAssetWithdrawForBptInOutput>;
    exitGetBptInForSingleAssetWithdraw(
        tokenAmount: TokenAmountHumanReadable,
    ): Promise<PoolExitBptInSingleAssetWithdrawOutput>;
    exitGetContractCallData(data: PoolExitData): Promise<PoolExitContractCallData>;
    exitGetProportionalPoolTokenWithdrawEstimate?(bptIn: AmountHumanReadable): Promise<TokenAmountHumanReadable[]>;
}

export type PoolJoinData =
    | PoolJoinInit
    | PoolJoinExactTokensInForBPTOut
    | PoolJoinTokenInForExactBPTOut
    | PoolJoinAllTokensInForExactBPTOut;

interface PoolJoinBase {
    maxAmountsIn: TokenAmountHumanReadable[];
    zapIntoMasterchefFarm?: boolean;
    zapIntoGauge?: boolean;
    userAddress: string;
    wethIsEth: boolean;
    slippage: string;
}

export interface PoolJoinEstimateOutput {
    priceImpact: number;
    minBptReceived: AmountHumanReadable;
    nestedPriceImpacts?: PoolJoinEstimateOutputNestedPriceImpact[];
}

export interface PoolJoinEstimateOutputNestedPriceImpact {
    poolId: string;
    priceImpact: number;
    minBptReceived: AmountHumanReadable;
}

export interface PoolExitSingleAssetWithdrawForBptInOutput {
    tokenAmount: AmountHumanReadable;
    priceImpact: number;
    nestedPriceImpacts?: PoolExitEstimateOutputNestedPriceImpact[];
}

export interface PoolExitEstimateOutputNestedPriceImpact {
    poolId: string;
    priceImpact: number;
    tokenAmount: TokenAmountHumanReadable;
}

export interface PoolExitBptInSingleAssetWithdrawOutput {
    bptIn: AmountHumanReadable;
    priceImpact: number;
}

export interface PoolJoinInit extends PoolJoinBase {
    kind: 'Init';
    tokenAmountsIn: TokenAmountHumanReadable[];
}

export interface PoolJoinExactTokensInForBPTOut extends PoolJoinBase {
    kind: 'ExactTokensInForBPTOut';
    tokenAmountsIn: TokenAmountHumanReadable[];
    minimumBpt: AmountHumanReadable;
}

export interface PoolJoinTokenInForExactBPTOut extends PoolJoinBase {
    kind: 'TokenInForExactBPTOut';
    tokenInAddress: string;
    bptAmountOut: AmountHumanReadable;
}

export interface PoolJoinAllTokensInForExactBPTOut extends PoolJoinBase {
    kind: 'AllTokensInForExactBPTOut';
    bptAmountOut: AmountHumanReadable;
}

export type PoolExitData =
    | PoolExitExactBPTInForOneTokenOut
    | PoolExitExactBPTInForTokensOut
    | PoolExitBPTInForExactTokensOut;

export interface PoolExitBase {
    slippage: string;
    userAddress: string;
}

export interface PoolExitExactBPTInForOneTokenOut extends PoolExitBase {
    kind: 'ExactBPTInForOneTokenOut';
    bptAmountIn: AmountHumanReadable;
    tokenOutAddress: string;
    amountOut: AmountHumanReadable;
}

export interface PoolExitExactBPTInForTokensOut extends PoolExitBase {
    kind: 'ExactBPTInForTokensOut';
    bptAmountIn: AmountHumanReadable;
    amountsOut: TokenAmountHumanReadable[];
}

export interface PoolExitBPTInForExactTokensOut extends PoolExitBase {
    kind: 'BPTInForExactTokensOut';
    amountsOut: TokenAmountHumanReadable[];
    maxBPTAmountIn: AmountHumanReadable;
}

//TODO: additional type will be batch relayer
export type PoolJoinContractCallData =
    | PoolJoinPoolContractCallData
    | PoolJoinBatchSwapContractCallData
    | PoolJoinBatchRelayerContractCallData;

export interface PoolJoinPoolContractCallData {
    type: 'JoinPool';
    assets: string[];
    maxAmountsIn: BigNumberish[];
    userData: string;
}

export interface PoolJoinBatchSwapContractCallData {
    type: 'BatchSwap';
    kind: SwapKind;
    swaps: BatchSwapStep[];
    assets: string[];
    limits: BigNumberish[];
}

export interface PoolJoinBatchRelayerContractCallData {
    type: 'BatchRelayer';
    calls: string[];
    ethValue?: string;
}

export type PoolExitContractCallData =
    | PoolExitPoolContractCallData
    | PoolExitBatchSwapContractCallData
    | PoolExitBatchRelayerContractCallData;

export interface PoolExitPoolContractCallData {
    type: 'ExitPool';
    assets: string[];
    minAmountsOut: BigNumberish[];
    userData: string;
}

export interface PoolExitBatchSwapContractCallData {
    type: 'BatchSwap';
    kind: SwapKind;
    swaps: BatchSwapStep[];
    assets: string[];
    limits: BigNumberish[];
}

export interface PoolExitBatchRelayerContractCallData {
    type: 'BatchRelayer';
    calls: string[];
}

export interface ComposablePoolJoinBatchSwapStep {
    type: 'BatchSwap';
    swaps: {
        poolId: string;
        tokenIn: string;
        tokenOut: string;
    }[];
    tokensIn: string[];
}

export interface ComposablePoolJoinPoolStep {
    type: 'Join';
    pool: GqlPoolWeighted | GqlPoolPhantomStable | GqlPoolPhantomStableNested;
    tokensIn: string[];
}

export type ComposablePoolJoinStep = ComposablePoolJoinBatchSwapStep | ComposablePoolJoinPoolStep;

export interface ComposablePoolJoinProcessedBatchSwapStep {
    type: 'BatchSwap';
    swaps: SwapV2[];
    assets: string[];
    deltas: AmountScaledString[];
    tokenAmountsOut: TokenAmountHumanReadable[];
    tokenAmountsIn: TokenAmountHumanReadable[];
}

export interface ComposablePoolJoinProcessedJoinPoolStep {
    type: 'Join';
    pool: GqlPoolWeighted | GqlPoolPhantomStable | GqlPoolPhantomStableNested;
    priceImpact: number;
    minBptReceived: AmountHumanReadable;
    tokenAmountsIn: TokenAmountHumanReadable[];
}

export type ComposablePoolProcessedJoinStep =
    | ComposablePoolJoinProcessedBatchSwapStep
    | ComposablePoolJoinProcessedJoinPoolStep;

export interface ComposablePoolJoinProcessedStepsOutput {
    processedSteps: ComposablePoolProcessedJoinStep[];
    priceImpact: number;
    minBptReceived: AmountHumanReadable;
    nestedPriceImpacts: PoolJoinEstimateOutputNestedPriceImpact[];
}

export type PoolWithPossibleNesting = GqlPoolWeighted | GqlPoolPhantomStable;
export type ComposableExitSwapPool = GqlPoolPhantomStable | GqlPoolPhantomStableNested | GqlPoolLinearNested;

export interface ComposablePoolExitNestedLinearPool {
    linearPoolToken: GqlPoolTokenLinear;
    mainToken: GqlPoolToken;
    wrappedToken: GqlPoolToken;
}

export interface ComposablePoolSingleAssetExit {
    tokenOut: GqlPoolTokenExpanded;
    poolToken: GqlPoolTokenUnion;
    linearPool?: ComposablePoolExitNestedLinearPool;
    exitSwaps?: {
        swaps: SwapV2[];
        assets: string[];
    };
}
