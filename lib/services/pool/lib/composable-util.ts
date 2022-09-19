import {
    GqlPoolPhantomStable,
    GqlPoolPhantomStableNested,
    GqlPoolToken,
    GqlPoolTokenBase,
    GqlPoolTokenLinear,
    GqlPoolTokenPhantomStable,
    GqlPoolWeighted,
} from '~/apollo/generated/graphql-codegen-generated';
import {
    ComposablePoolJoinBatchSwapStep,
    ComposablePoolJoinPoolStep,
    ComposablePoolJoinProcessedBatchSwapStep,
    ComposablePoolJoinProcessedJoinPoolStep,
    ComposablePoolJoinProcessedStepsOutput,
    ComposablePoolJoinStep,
    ComposablePoolProcessedJoinStep,
    PoolJoinBatchRelayerContractCallData,
    PoolJoinExactTokensInForBPTOut,
} from '~/lib/services/pool/pool-types';
import { AmountHumanReadable, AmountScaledString, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import {
    FundManagement,
    stableBPTForTokensZeroPriceImpact,
    Swaps,
    SwapType,
    SwapV2,
    weightedBPTForTokensZeroPriceImpact,
    WeightedPoolEncoder,
    StablePoolEncoder,
} from '@balancer-labs/sdk';
import { formatFixed, parseFixed } from '@ethersproject/bignumber';
import { SwapTypes } from '@balancer-labs/sor';
import { BaseProvider } from '@ethersproject/providers';
import * as SDK from '@georgeroman/balancer-v2-pools';
import OldBigNumber from 'bignumber.js';
import {
    oldBnum,
    oldBnumFromBnum,
    oldBnumScaleAmount,
    oldBnumSubtractSlippage,
    oldBnumToBnum,
    oldBnumZero,
} from '~/lib/services/pool/lib/old-big-number';
import {
    oldBnumPoolScaleTokenAmounts,
    poolGetEthAmountFromJoinData,
    poolScaleAmp,
    poolScaleSlippage,
    poolScaleTokenAmounts,
} from '~/lib/services/pool/lib/util';
import { parseUnits } from 'ethers/lib/utils';
import { AddressZero, MaxUint256, WeiPerEther, Zero } from '@ethersproject/constants';
import { BigNumber } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { networkConfig } from '~/lib/config/network-config';
import VaultAbi from '~/lib/abi/VaultAbi.json';
import { cloneDeep, sortBy } from 'lodash';
import { batchRelayerService } from '~/lib/services/batch-relayer/batch-relayer.service';
import { replaceWethWithZeroAddress } from '~/lib/services/token/token-util';
import sort from 'zrender/lib/core/timsort';

type PoolWithPossibleNesting = GqlPoolWeighted | GqlPoolPhantomStable;

export function poolGetJoinSteps(pool: PoolWithPossibleNesting): ComposablePoolJoinStep[] {
    const steps: ComposablePoolJoinStep[] = [];
    const nestedLinearPoolTokens = poolGetNestedLinearPoolTokens(pool);
    const nestedStablePoolTokens = poolGetNestedStablePoolTokens(pool);

    if (nestedLinearPoolTokens.length > 0) {
        steps.push({
            type: 'BatchSwap',
            swaps: nestedLinearPoolTokens.map((linearPoolToken) => {
                const mainToken = poolGetMainTokenFromLinearPoolToken(linearPoolToken);

                return {
                    poolId: linearPoolToken.pool.id,
                    tokenIn: mainToken.address,
                    tokenOut: linearPoolToken.address,
                };
            }),
            tokensIn: nestedLinearPoolTokens.map((linearPoolToken) => {
                const mainToken = poolGetMainTokenFromLinearPoolToken(linearPoolToken);

                return mainToken.address;
            }),
        });
    }

    for (const nestedStablePoolToken of nestedStablePoolTokens) {
        steps.push({
            type: 'Join',
            pool: nestedStablePoolToken.pool,
            tokensIn: nestedStablePoolToken.pool.tokens.map((token) => token.address),
        });
    }

    //the last step is always joining the pool itself
    steps.push({
        type: 'Join',
        pool,
        tokensIn: pool.tokens.map((token) => token.address),
    });

    return steps;
}

export async function poolProcessJoinSteps({
    pool,
    steps,
    tokenAmountsIn,
    provider,
    slippage,
}: {
    pool: PoolWithPossibleNesting;
    steps: ComposablePoolJoinStep[];
    tokenAmountsIn: TokenAmountHumanReadable[];
    provider: BaseProvider;
    slippage: AmountHumanReadable;
}): Promise<ComposablePoolJoinProcessedStepsOutput> {
    const processedSteps: ComposablePoolProcessedJoinStep[] = [];
    let currentTokenAmountsIn = tokenAmountsIn;

    for (const step of steps) {
        const joinAmountsIn = currentTokenAmountsIn.filter((amountIn) => step.tokensIn.includes(amountIn.address));

        if (step.type === 'Join') {
            const joinPoolResponse = await poolJoinStepGetJoinPool({
                joinStep: step,
                tokenAmountsIn: joinAmountsIn,
            });

            currentTokenAmountsIn = [
                ...currentTokenAmountsIn.filter((amountIn) => !step.tokensIn.includes(amountIn.address)),
                //TODO: this should take slippage into account
                { address: step.pool.address, amount: joinPoolResponse.minBptReceived },
            ];

            processedSteps.push(joinPoolResponse);
        } else if (step.type === 'BatchSwap') {
            const joinSwapResponse = await poolJoinStepGetJoinBatchSwap({
                pool,
                batchSwapStep: step,
                tokenAmountsIn: joinAmountsIn,
                provider: provider,
            });

            currentTokenAmountsIn = [
                ...currentTokenAmountsIn.filter((amountIn) => !step.tokensIn.includes(amountIn.address)),
                ...joinSwapResponse.tokenAmountsOut,
            ];

            processedSteps.push(joinSwapResponse);
        }
    }

    const processedJoinSteps = processedSteps.filter(
        (step) => step.type === 'Join',
    ) as ComposablePoolJoinProcessedJoinPoolStep[];
    const lastJoinStep = processedJoinSteps[processedJoinSteps.length - 1];

    return {
        processedSteps,
        priceImpact: lastJoinStep.priceImpact,
        minBptReceived: lastJoinStep.minBptReceived,
        nestedPriceImpacts: processedJoinSteps.slice(0, processedJoinSteps.length - 1).map((step) => ({
            ...step,
            poolId: step.pool.id,
        })),
    };
}

export async function poolJoinGetContractCallData({
    data,
    processedSteps,
    wethAddress,
}: {
    data: PoolJoinExactTokensInForBPTOut;
    processedSteps: ComposablePoolProcessedJoinStep[];
    wethAddress: string;
}): Promise<PoolJoinBatchRelayerContractCallData> {
    const calls: string[] = [];
    const { ethAmount, ethAmountScaled } = poolGetEthAmountFromJoinData(data, wethAddress);

    const batchSwapStep = processedSteps.find((step) => step.type === 'BatchSwap') as
        | ComposablePoolJoinProcessedBatchSwapStep
        | undefined;
    const processedJoinSteps = processedSteps.filter(
        (step) => step.type === 'Join',
    ) as ComposablePoolJoinProcessedJoinPoolStep[];

    if (batchSwapStep) {
        calls.push(
            encodeBatchSwap({
                step: batchSwapStep,
                userAddress: data.userAddress,
                ethAmountScaled,
            }),
        );
    }

    const assets = batchSwapStep?.assets || [];
    const deltas = batchSwapStep?.deltas || [];
    const numAssets = assets.length;

    for (let i = 0; i < processedJoinSteps.length; i++) {
        const step = processedJoinSteps[i];
        const isNestedJoin = i < processedJoinSteps.length - 1;
        const isLastJoin = i === processedJoinSteps.length - 1;

        calls.push(
            encodeJoinPool({
                step,
                batchSwapStep: batchSwapStep || null,
                wethAddress,
                ethAmountScaled,
                userAddress: data.userAddress,
                wethIsEth: data.wethIsEth,
                isNestedJoin,
                isLastJoin,
                outputReference: numAssets + i,
                assets,
                deltas,
                slippage: data.slippage,
            }),
        );

        assets.push(step.pool.address);
        deltas.push(parseUnits(step.minBptReceived, 18).toString());
    }

    return {
        type: 'BatchRelayer',
        calls,
        ethValue: ethAmountScaled,
    };
}

async function poolJoinStepGetJoinPool({
    tokenAmountsIn,
    joinStep,
}: {
    tokenAmountsIn: TokenAmountHumanReadable[];
    joinStep: ComposablePoolJoinPoolStep;
}): Promise<ComposablePoolJoinProcessedJoinPoolStep> {
    const pool = joinStep.pool;
    const bptAmount =
        pool.__typename === 'GqlPoolWeighted'
            ? poolWeightedExactTokensInForBPTOut(tokenAmountsIn, pool)
            : poolStableExactTokensInForBPTOut(tokenAmountsIn, pool);
    const bptZeroPriceImpact =
        pool.__typename === 'GqlPoolWeighted'
            ? poolWeightedBptForTokensZeroPriceImpact(tokenAmountsIn, pool)
            : poolStableBptForTokensZeroPriceImpact(tokenAmountsIn, pool);

    return {
        type: 'Join',
        priceImpact: bptZeroPriceImpact.lt(bptAmount)
            ? 0
            : oldBnum(1).minus(bptAmount.div(bptZeroPriceImpact)).toNumber(),
        minBptReceived: formatFixed(bptAmount.toString(), 18),
        tokenAmountsIn,
        pool,
    };
}

export async function poolQueryBatchSwap({
    provider,
    swaps,
    swapType,
    assets,
}: {
    provider: BaseProvider;
    swapType: SwapTypes;
    swaps: SwapV2[];
    assets: string[];
}): Promise<string[]> {
    const vaultContract = new Contract(networkConfig.balancer.vault, VaultAbi, provider);
    const funds: FundManagement = {
        sender: AddressZero,
        recipient: AddressZero,
        fromInternalBalance: false,
        toInternalBalance: false,
    };

    const response = await vaultContract.queryBatchSwap(swapType, swaps, assets, funds);

    return response.map((item: BigNumber) => item.toString());
}

export function poolBatchSwaps(assets: string[][], swaps: SwapV2[][]): { swaps: SwapV2[]; assets: string[] } {
    // asset addresses without duplicates
    const joinedAssets = assets.flat();
    //create a deep copy to ensure we do not mutate the input
    const clonedSwaps = cloneDeep(swaps);

    // Update indices of each swap to use new asset array
    clonedSwaps.forEach((swap, i) => {
        swap.forEach((poolSwap) => {
            poolSwap.assetInIndex = joinedAssets.indexOf(assets[i][poolSwap.assetInIndex]);
            poolSwap.assetOutIndex = joinedAssets.indexOf(assets[i][poolSwap.assetOutIndex]);
        });
    });

    // Join Swaps into a single batchSwap
    const batchedSwaps = clonedSwaps.flat();

    return { swaps: batchedSwaps, assets: joinedAssets };
}

export async function poolJoinStepGetJoinBatchSwap({
    pool,
    tokenAmountsIn,
    batchSwapStep,
    provider,
}: {
    pool: PoolWithPossibleNesting;
    tokenAmountsIn: TokenAmountHumanReadable[];
    batchSwapStep: ComposablePoolJoinBatchSwapStep;
    provider: BaseProvider;
}): Promise<ComposablePoolJoinProcessedBatchSwapStep> {
    const joinSwaps: { swap: SwapV2; assets: string[] }[] = [];

    for (const tokenAmountIn of tokenAmountsIn) {
        const swapData = batchSwapStep.swaps.find((swap) => swap.tokenIn === tokenAmountIn.address);

        if (swapData) {
            const tokenIn = pool.allTokens.find((token) => token.address === tokenAmountIn.address);

            joinSwaps.push({
                swap: {
                    poolId: swapData.poolId,
                    assetInIndex: 0,
                    assetOutIndex: 1,
                    amount: parseFixed(tokenAmountIn.amount, tokenIn?.decimals || 18).toString(),
                    userData: '0x',
                },
                assets: [swapData.tokenIn, swapData.tokenOut],
            });
        }
    }

    const { swaps, assets } = poolBatchSwaps(
        joinSwaps.map((item) => item.assets),
        joinSwaps.map((item) => [item.swap]),
    );

    const deltas = await poolQueryBatchSwap({
        swapType: SwapTypes.SwapExactIn,
        swaps,
        assets,
        provider,
    });

    const tokenAmountsOut = batchSwapStep.swaps.map((swap) => {
        const token = pool.allTokens.find((token) => token.address === swap.tokenOut);
        const tokenOutIdx = assets.findIndex((asset) => asset === swap.tokenOut);

        return {
            address: swap.tokenOut,
            amount: formatFixed(BigNumber.from(deltas[tokenOutIdx] || '0').abs(), token?.decimals || 18),
        };
    });

    return { type: 'BatchSwap', swaps, assets, deltas, tokenAmountsIn, tokenAmountsOut };
}

export function poolGetNestedLinearPoolTokens(pool: PoolWithPossibleNesting): GqlPoolTokenLinear[] {
    const tokens: GqlPoolTokenLinear[] = [];

    for (const poolToken of pool.tokens) {
        if (poolToken.__typename === 'GqlPoolTokenLinear') {
            tokens.push(poolToken);
        }

        if ('pool' in poolToken) {
            for (const nestedPoolToken of poolToken.pool.tokens) {
                if (nestedPoolToken.__typename === 'GqlPoolTokenLinear') {
                    tokens.push(nestedPoolToken);
                }
            }
        }
    }

    return tokens;
}

export function poolGetNestedStablePoolTokens(pool: PoolWithPossibleNesting): GqlPoolTokenPhantomStable[] {
    const tokens: GqlPoolTokenPhantomStable[] = [];

    for (const poolToken of pool.tokens) {
        if (poolToken.__typename === 'GqlPoolTokenPhantomStable') {
            tokens.push(poolToken);
        }
    }

    return tokens;
}

export function poolGetMainTokenFromLinearPoolToken(linearPoolToken: GqlPoolTokenLinear): GqlPoolToken {
    const mainToken = linearPoolToken.pool.tokens.find((token) => token.index === linearPoolToken.pool.mainIndex);

    if (!mainToken) {
        throw new Error('Linear pool missing main token');
    }

    return mainToken;
}

export function poolGetWrappedTokenFromLinearPoolToken(linearPoolToken: GqlPoolTokenLinear): GqlPoolToken {
    const wrappedToken = linearPoolToken.pool.tokens.find((token) => token.index === linearPoolToken.pool.wrappedIndex);

    if (!wrappedToken) {
        throw new Error('Linear pool missing main token');
    }

    return wrappedToken;
}

function poolStableExactTokensInForBPTOut(
    tokenAmounts: TokenAmountHumanReadable[],
    pool: GqlPoolPhantomStable | GqlPoolPhantomStableNested,
): OldBigNumber {
    try {
        return SDK.StableMath._calcBptOutGivenExactTokensIn(
            oldBnumFromBnum(poolScaleAmp(pool.amp)),
            pool.tokens.map((token) => scaleTo18AndApplyPriceRate(token.totalBalance, token)),
            pool.tokens.map((poolToken) => {
                const tokenAmount = tokenAmounts.find((amount) => amount.address === poolToken.address);

                return tokenAmount ? scaleTo18AndApplyPriceRate(tokenAmount.amount, poolToken) : oldBnumZero();
            }),
            oldBnumScaleAmount(
                pool.__typename === 'GqlPoolPhantomStableNested' ? pool.totalShares : pool.dynamicData.totalShares,
            ),
            oldBnumScaleAmount(
                pool.__typename === 'GqlPoolPhantomStableNested' ? pool.swapFee : pool.dynamicData.swapFee,
            ),
        );
    } catch (error) {
        console.error(error);

        return oldBnumZero();
    }
}

function poolStableBptForTokensZeroPriceImpact(
    tokenAmounts: TokenAmountHumanReadable[],
    pool: GqlPoolPhantomStable | GqlPoolPhantomStableNested,
): OldBigNumber {
    const denormAmounts = poolScaleTokenAmounts(tokenAmounts, pool.tokens);
    const priceRatesScaled = pool.tokens.map((token) => oldBnumScaleAmount(token.priceRate, 18));

    // _bptForTokensZeroPriceImpact is the only stable pool function
    // that requires balances be scaled by the tokenWithAmount decimals and not 18
    const balances = pool.tokens.map((token, index) =>
        parseUnits(token.totalBalance, token.decimals)
            //apply the price rate to the balances
            .mul(priceRatesScaled[index].toString())
            .div(WeiPerEther),
    );

    const bptZeroImpact = stableBPTForTokensZeroPriceImpact(
        balances,
        pool.tokens.map((token) => token.decimals),
        denormAmounts,
        oldBnumScaleAmount(
            pool.__typename === 'GqlPoolPhantomStableNested' ? pool.totalShares : pool.dynamicData.totalShares,
        ).toString(),
        oldBnumScaleAmount(
            pool.__typename === 'GqlPoolPhantomStableNested' ? pool.swapFee : pool.dynamicData.swapFee,
        ).toString(),
    );

    return oldBnumFromBnum(bptZeroImpact);
}

function poolWeightedExactTokensInForBPTOut(
    tokenAmounts: TokenAmountHumanReadable[],
    pool: GqlPoolWeighted,
): OldBigNumber {
    return SDK.WeightedMath._calcBptOutGivenExactTokensIn(
        pool.tokens.map((token) => oldBnumScaleAmount(token.balance, token.decimals)),
        pool.tokens.map((token) => oldBnumScaleAmount(token.weight || '0', 18)),
        oldBnumPoolScaleTokenAmounts(tokenAmounts, pool.tokens),
        oldBnumScaleAmount(pool.dynamicData.totalShares),
        oldBnumScaleAmount(pool.dynamicData.swapFee),
    );
}

function poolWeightedBptForTokensZeroPriceImpact(
    tokenAmounts: TokenAmountHumanReadable[],
    pool: GqlPoolWeighted,
): OldBigNumber {
    const denormAmounts = oldBnumPoolScaleTokenAmounts(tokenAmounts, pool.tokens);
    const tokenBalancesScaled = pool.tokens.map((token) => oldBnumScaleAmount(token.balance, token.decimals));
    const tokenWeightsScaled = pool.tokens.map((token) => oldBnumScaleAmount(token.weight || '0', 18));

    const result = weightedBPTForTokensZeroPriceImpact(
        tokenBalancesScaled.map((balance) => oldBnumToBnum(balance)),
        pool.tokens.map((token) => token.decimals),
        tokenWeightsScaled.map((weight) => oldBnumToBnum(weight)),
        denormAmounts.map((amount) => oldBnumToBnum(amount)),
        parseUnits(pool.dynamicData.totalShares),
    );

    return oldBnumFromBnum(result);
}

function scaleTo18AndApplyPriceRate(amount: AmountHumanReadable, token: GqlPoolTokenBase): OldBigNumber {
    const denormAmount = oldBnum(parseUnits(amount, 18).toString())
        .times(token.priceRate)
        .toFixed(0, OldBigNumber.ROUND_UP);

    return oldBnum(denormAmount);
}

function encodeBatchSwap({
    step,
    userAddress,
    ethAmountScaled,
}: {
    step: ComposablePoolJoinProcessedBatchSwapStep;
    userAddress: string;
    ethAmountScaled: AmountScaledString;
}): string {
    const { swaps, assets, deltas, tokenAmountsOut, tokenAmountsIn } = step;
    const limits = Swaps.getLimitsForSlippage(
        tokenAmountsIn.map((amount) => amount.address),
        tokenAmountsOut.map((amount) => amount.address),
        SwapType.SwapExactIn,
        deltas,
        assets,
        //TODO: do we need to worry about slippage here? only real concern is the rate provider ticking up
        poolScaleSlippage('0.0001'),
        //poolScaleSlippage(data.slippage),
    );

    return batchRelayerService.vaultEncodeBatchSwap({
        swapType: SwapType.SwapExactIn,
        swaps,
        assets,
        funds: {
            sender: userAddress,
            recipient: userAddress,
            fromInternalBalance: false,
            toInternalBalance: true,
        },
        limits,
        deadline: MaxUint256,
        value: ethAmountScaled,
        outputReferences: assets.map((asset, index) => ({
            index,
            key: batchRelayerService.toChainedReference(index),
        })),
    });
}

function encodeJoinPool({
    step,
    batchSwapStep,
    wethAddress,
    userAddress,
    wethIsEth,
    ethAmountScaled,
    isNestedJoin,
    isLastJoin,
    outputReference,
    assets,
    deltas,
    slippage,
}: {
    step: ComposablePoolJoinProcessedJoinPoolStep;
    batchSwapStep: ComposablePoolJoinProcessedBatchSwapStep | null;
    wethAddress: string;
    userAddress: string;
    wethIsEth: boolean;
    ethAmountScaled: AmountScaledString;
    isNestedJoin: boolean;
    isLastJoin: boolean;
    outputReference: number;
    assets: string[];
    deltas: AmountScaledString[];
    slippage: AmountHumanReadable;
}): string {
    const pool = step.pool;
    const joinHasNativeAsset = wethIsEth && pool.tokens.find((token) => token.address === wethAddress);
    const tokensWithPhantomBpt = sortBy(
        [...pool.tokens, { address: pool.address, decimals: 18, __typename: 'pool' }],
        'address',
    );
    const bptIdx = tokensWithPhantomBpt.findIndex((token) => token.address === pool.address);

    const amountsIn = tokensWithPhantomBpt.map((token) => {
        if (token.address === pool.address) {
            return Zero.toString();
        }

        const tokenAmountIn = step.tokenAmountsIn.find((tokenAmountIn) => tokenAmountIn.address === token.address);

        if (token.__typename === 'GqlPoolTokenLinear' || token.__typename === 'GqlPoolTokenPhantomStable') {
            //This token is a nested BPT, not a mainToken
            //Replace the amount with the chained reference value
            const index = assets.findIndex((asset) => asset.toLowerCase() === token.address) || -1;

            //if the return amount is 0, we dont pass on the chained reference
            if (index === -1 || deltas[index] === '0') {
                return '0';
            }

            return batchRelayerService.toChainedReference(index);
        }

        return parseUnits(tokenAmountIn?.amount || '0', token.decimals).toString();
    });

    return batchRelayerService.vaultEncodeJoinPool({
        poolId: pool.id,
        poolKind: 0,
        sender: userAddress,
        //recipient: isNestedJoin ? batchRelayerService.batchRelayerAddress : userAddress,
        recipient: userAddress,
        joinPoolRequest: {
            assets: tokensWithPhantomBpt.map((token) => token.address),
            maxAmountsIn: amountsIn,
            userData: StablePoolEncoder.joinExactTokensInForBPTOut(
                //required that that bpt idx is not included here
                amountsIn.filter((amount, idx) => idx !== bptIdx),
                parseUnits(oldBnumSubtractSlippage(step.minBptReceived, 18, slippage), 18),
            ),
            fromInternalBalance: batchSwapStep !== null,
        },
        value: joinHasNativeAsset ? ethAmountScaled : Zero,
        outputReference: isNestedJoin ? batchRelayerService.toChainedReference(outputReference) : Zero,
    });
}
