import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';

export interface PoolService {
    joinGetProportionalSuggestionForFixedAmount?(
        fixedAmount: TokenAmountHumanReadable,
    ): Promise<TokenAmountHumanReadable[]>;
    joinEstimatePriceImpact(tokenAmountsIn: TokenAmountHumanReadable[]): Promise<number>;
    joinPoolEncode(data: PoolJoinData): Promise<string>;
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
    zapIntoMasterchefFarm?: boolean;
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
