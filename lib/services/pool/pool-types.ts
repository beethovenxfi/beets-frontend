import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { BigNumberish } from 'ethers';
import { SwapKind, BatchSwapStep, FundManagement } from '@balancer-labs/balancer-js';

export interface PoolService {
    joinGetProportionalSuggestionForFixedAmount?(
        fixedAmount: TokenAmountHumanReadable,
    ): Promise<TokenAmountHumanReadable[]>;
    joinGetEstimate(tokenAmountsIn: TokenAmountHumanReadable[]): Promise<PoolJoinEstimateOutput>;
    joinGetContractCallData(data: PoolJoinData): Promise<PoolJoinContractCallData>;
    //TODO: needs functions for num BPT estimation for single or proportional join

    exitGetProportionalWithdraw(bptInHumanReadable: AmountHumanReadable): Promise<TokenAmountHumanReadable[]>;
    exitEstimatePriceImpact(input: PoolExitBPTInForExactTokensOut | PoolExitExactBPTInForOneTokenOut): Promise<number>;
    exitPoolEncode(data: PoolExitData): Promise<string>;
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
    bptReceived: string;
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

export interface PoolExitExactBPTInForOneTokenOut {
    kind: 'ExactBPTInForOneTokenOut';
    bptAmountIn: AmountHumanReadable;
    tokenOutAddress: string;
    userBptBalance: AmountHumanReadable;
}

export interface PoolExitExactBPTInForTokensOut {
    kind: 'ExactBPTInForTokensOut';
    bptAmountIn: AmountHumanReadable;
}

export interface PoolExitBPTInForExactTokensOut {
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
    funds: FundManagement;
    limits: BigNumberish[];
}
