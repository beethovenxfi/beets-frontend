import { TransactionResponse, Web3Provider } from '@ethersproject/providers';
import { AddressZero, MaxUint256 } from '@ethersproject/constants';
import { Vault__factory } from '@balancer-labs/typechain';
import { BigNumber } from '@ethersproject/bignumber';
import { FundManagement, SingleSwap, SwapKind } from '@balancer-labs/balancer-js';
import { BatchSwapStep, SwapV2 } from '@balancer-labs/sdk';
import { web3SendTransaction } from '~/lib/services/util/web3';
import { networkConfig } from '~/lib/config/network-config';
import { oldBnum } from '~/lib/services/pool/lib/old-big-number';

export async function swapIn(
    network: string,
    web3: Web3Provider,
    tokenIn: string,
    tokenOut: string,
    tokenInAmount: BigNumber,
    tokenOutAmountMin: BigNumber,
    swaps: SwapV2[],
    tokenAddresses: string[],
): Promise<TransactionResponse> {
    console.log('[Swapper] batchSwapGivenInV2');
    const overrides: any = {};

    if (tokenIn === AddressZero) {
        overrides.value = tokenInAmount.toHexString();
    }

    const address = await web3.getSigner().getAddress();

    const funds: FundManagement = {
        sender: address,
        recipient: address,
        fromInternalBalance: false,
        toInternalBalance: false,
    };

    // Limits:
    // +ve means max to send
    // -ve mean min to receive
    // For a multihop the intermediate tokens should be 0
    const limits: string[] = [];
    tokenAddresses.forEach((token, i) => {
        if (token.toLowerCase() === tokenIn.toLowerCase()) {
            limits[i] = tokenInAmount.toString();
        } else if (token.toLowerCase() === tokenOut.toLowerCase()) {
            limits[i] = tokenOutAmountMin.mul(-1).toString();
        } else {
            limits[i] = '0';
        }
    });
    console.log('Limits', limits);

    try {
        // Do a single swap instead of a batch to save gas
        if (swaps.length == 1) {
            console.log('[Swapper] Overriding with single swap() GivenIn');

            const single: SingleSwap = {
                poolId: swaps[0].poolId,
                kind: SwapKind.GivenIn,
                assetIn: tokenAddresses[swaps[0].assetInIndex],
                assetOut: tokenAddresses[swaps[0].assetOutIndex],
                amount: swaps[0].amount,
                userData: swaps[0].userData,
            };

            return sendSwapTransaction({
                web3,
                action: 'swap',
                params: [single, funds, tokenOutAmountMin.toString(), MaxUint256],
                overrides,
            });
        }

        return sendSwapTransaction({
            web3,
            action: 'batchSwap',
            params: [SwapKind.GivenIn, swaps, tokenAddresses, funds, limits, MaxUint256],
            overrides,
        });
    } catch (e) {
        console.log('[Swapper] batchSwapGivenInV2 Error:', e);
        return Promise.reject(e);
    }
}

/**
 * Join a Boosted Pool (StablePhantom) using a batch swap
 */
export async function boostedJoinBatchSwap(
    network: string,
    web3: Web3Provider,
    swaps: SwapV2[],
    tokenAddresses: string[],
    tokenOut: string,
    amountsInMap: Record<string, BigNumber>,
    amountOutMin: BigNumber,
) {
    try {
        const address = await web3.getSigner().getAddress();
        const overrides: any = {};
        const tokensIn: string[] = Object.keys(amountsInMap);

        const funds: FundManagement = {
            sender: address,
            recipient: address,
            fromInternalBalance: false,
            toInternalBalance: false,
        };

        // Limits:
        // +ve means max to send
        // -ve mean min to receive
        // For a multihop the intermediate tokens should be 0
        const limits: string[] = [];
        tokenAddresses.forEach((token, i) => {
            if (tokensIn.includes(token.toLowerCase())) {
                limits[i] = amountsInMap[token].toString();
            } else if (token.toLowerCase() === tokenOut.toLowerCase()) {
                limits[i] = amountOutMin.mul(-1).toString();
            } else {
                limits[i] = '0';
            }
        });

        return sendSwapTransaction({
            web3,
            action: 'batchSwap',
            params: [SwapKind.GivenIn, swaps, tokenAddresses, funds, limits, MaxUint256],
            overrides,
        });
    } catch (error) {
        console.log('[Swapper] batchSwapGivenInV2 Error:', error);
        throw error;
    }
}

/**
 * Exit a Boosted Pool (StablePhantom) using a batch swap
 */
export async function boostedExitBatchSwap(
    network: string,
    web3: Web3Provider,
    swaps: BatchSwapStep[],
    tokenAddresses: string[],
    tokenIn: string,
    amountIn: string,
    amountsOutMap: Record<string, string>,
    swapKind: SwapKind = SwapKind.GivenIn,
): Promise<TransactionResponse> {
    try {
        const address = await web3.getSigner().getAddress();
        const overrides: any = {};
        const tokensOut: string[] = Object.keys(amountsOutMap);

        const funds: FundManagement = {
            sender: address,
            recipient: address,
            fromInternalBalance: false,
            toInternalBalance: false,
        };

        // Limits:
        // +ve means max to send
        // -ve mean min to receive
        // For a multihop the intermediate tokens should be 0
        const limits: string[] = [];
        tokenAddresses.forEach((token, i) => {
            if (tokensOut.includes(token.toLowerCase())) {
                limits[i] = oldBnum(amountsOutMap[token]).times(-1).toString();
            } else if (token.toLowerCase() === tokenIn.toLowerCase()) {
                limits[i] = oldBnum(amountIn).abs().toString();
            } else {
                limits[i] = '0';
            }
        });

        console.log('limits', limits);

        return sendSwapTransaction({
            web3,
            action: 'batchSwap',
            params: [swapKind, swaps, tokenAddresses, funds, limits, MaxUint256],
            overrides,
        });
    } catch (error) {
        console.log('[Swapper] batchSwapGivenInV2 Error:', error);
        throw error;
    }
}

export async function swapOut(
    network: string,
    web3: Web3Provider,
    tokenIn: string,
    tokenOut: string,
    tokenInAmountMax: BigNumber,
    tokenOutAmount: BigNumber,
    swaps: SwapV2[],
    tokenAddresses: string[],
): Promise<TransactionResponse> {
    console.log('[Swapper] batchSwapGivenOutV2');
    const overrides: any = {};

    if (tokenIn === AddressZero) {
        overrides.value = tokenInAmountMax.toHexString();
    }

    const address = await web3.getSigner().getAddress();

    const funds: FundManagement = {
        sender: address,
        recipient: address,
        fromInternalBalance: false,
        toInternalBalance: false,
    };

    // Limits:
    // +ve means max to send
    // -ve mean min to receive
    // For a multihop the intermediate tokens should be 0
    const limits: string[] = [];
    tokenAddresses.forEach((token, i) => {
        if (token.toLowerCase() === tokenIn.toLowerCase()) {
            limits[i] = tokenInAmountMax.toString();
        } else if (token.toLowerCase() === tokenOut.toLowerCase()) {
            limits[i] = tokenOutAmount.mul(-1).toString();
        } else {
            limits[i] = '0';
        }
    });
    console.log('Limits', limits);

    try {
        // Do a single swap instead of a batch to save gas
        if (swaps.length == 1) {
            console.log('[Swapper] Overriding with single swap() GivenOut');

            const single: SingleSwap = {
                poolId: swaps[0].poolId,
                kind: SwapKind.GivenOut,
                assetIn: tokenAddresses[swaps[0].assetInIndex],
                assetOut: tokenAddresses[swaps[0].assetOutIndex],
                amount: swaps[0].amount,
                userData: swaps[0].userData,
            };

            return sendSwapTransaction({
                web3,
                action: 'swap',
                params: [single, funds, tokenInAmountMax.toString(), MaxUint256],
                overrides,
            });
        }

        return sendSwapTransaction({
            web3,
            action: 'batchSwap',
            params: [SwapKind.GivenOut, swaps, tokenAddresses, funds, limits, MaxUint256],
            overrides,
        });
    } catch (e) {
        console.log('[Swapper] batchSwapGivenOutV2 Error:', e);
        return Promise.reject(e);
    }
}

async function sendSwapTransaction({
    web3,
    action,
    params,
    overrides,
}: {
    web3: Web3Provider;
    action: 'swap' | 'batchSwap';
    params: any[];
    overrides?: Record<string, any>;
}) {
    return web3SendTransaction({
        web3,
        contractAddress: networkConfig.balancer.vault,
        abi: Vault__factory.abi,
        action,
        params: params,
        overrides,
    });
}
