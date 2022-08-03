import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { BigNumberish } from 'ethers';
import { SwapKind, BatchSwapStep, FundManagement } from '@balancer-labs/balancer-js';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';

export interface PoolService {
    updatePool(pool: GqlPoolUnion): void;

    joinGetProportionalSuggestionForFixedAmount?(
        fixedAmount: TokenAmountHumanReadable,
    ): Promise<TokenAmountHumanReadable[]>;
    joinGetBptOutAndPriceImpactForTokensIn(
        tokenAmountsIn: TokenAmountHumanReadable[],
        slippage: AmountHumanReadable,
    ): Promise<PoolJoinEstimateOutput>;
    joinGetContractCallData(data: PoolJoinData): Promise<PoolJoinContractCallData>;

    exitGetProportionalWithdrawEstimate(bptIn: AmountHumanReadable): Promise<TokenAmountHumanReadable[]>;
    exitGetSingleAssetWithdrawForBptIn(
        bptIn: AmountHumanReadable,
        tokenOutAddress: string,
    ): Promise<PoolExitSingleAssetWithdrawForBptInOutput>;
    exitGetBptInForSingleAssetWithdraw(
        tokenAmount: TokenAmountHumanReadable,
    ): Promise<PoolExitBptInSingleAssetWithdrawOutput>;
    exitGetContractCallData(data: PoolExitData): Promise<PoolExitContractCallData>;
}

export type PoolJoinData =
    | PoolJoinInit
    | PoolJoinExactTokensInForBPTOut
    | PoolJoinTokenInForExactBPTOut
    | PoolJoinAllTokensInForExactBPTOut;

interface PoolJoinBase {
    maxAmountsIn: TokenAmountHumanReadable[];
    zapIntoMasterchefFarm?: boolean;
}

export interface PoolJoinEstimateOutput {
    priceImpact: number;
    minBptReceived: AmountHumanReadable;
}

export interface PoolExitSingleAssetWithdrawForBptInOutput {
    tokenAmount: AmountHumanReadable;
    priceImpact: number;
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
    slippage: number;
}

export interface PoolExitExactBPTInForOneTokenOut extends PoolExitBase {
    kind: 'ExactBPTInForOneTokenOut';
    bptAmountIn: AmountHumanReadable;
    tokenOutAddress: string;
    userBptBalance: AmountHumanReadable;
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
export type PoolJoinContractCallData = PoolJoinPoolContractCallData | PoolJoinBatchSwapContractCallData;

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

export type PoolExitContractCallData = PoolExitPoolContractCallData | PoolExitBatchSwapContractCallData;

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
    funds: FundManagement;
    limits: BigNumberish[];
}
