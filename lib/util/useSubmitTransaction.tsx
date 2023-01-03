import { useContractWrite, useProvider, useSigner, useWaitForTransaction } from 'wagmi';
import {
    UseContractWriteArgs,
    UseContractWriteConfig,
    UseContractWriteMutationArgs,
} from 'wagmi/dist/declarations/src/hooks/contracts/useContractWrite';
import { BeetsTransactionType, toastGetTransactionStatusHeadline } from '~/components/toast/toast-util';
import { networkConfig } from '~/lib/config/network-config';
import { Vault__factory } from '@balancer-labs/typechain';
import batchRelayerAbi from '~/lib/abi/BatchRelayer.json';
import { UseWaitForTransactionConfig } from 'wagmi/dist/declarations/src/hooks/transactions/useWaitForTransaction';
import { useRef, useState } from 'react';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { makeVar } from '@apollo/client';
import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import { HStack, Text } from '@chakra-ui/react';
import { Contract } from 'ethers';

interface Props {
    config: Omit<UseContractWriteArgs & UseContractWriteConfig, 'signerOrProvider'>;
    waitForConfig?: UseWaitForTransactionConfig;
    transactionType: BeetsTransactionType;
}

export interface SubmitTransactionQuery {
    submit: (config: UseContractWriteMutationArgs & { toastText: string; walletText?: string }) => void;
    submitAsync: (
        config: UseContractWriteMutationArgs & { toastText: string; walletText?: string },
    ) => Promise<TransactionResponse>;

    isSubmitting: boolean;
    submitError: Error | null;
    isSubmitError: boolean;

    isPending: boolean;
    isConfirmed: boolean;
    isFailed: boolean;
    error: Error | null;
    reset: () => void;

    txResponse?: TransactionResponse;
    txReceipt?: TransactionReceipt;
}

export const vaultContractConfig = {
    addressOrName: networkConfig.balancer.vault,
    contractInterface: Vault__factory.abi,
};

export const batchRelayerContractConfig = {
    addressOrName: networkConfig.balancer.batchRelayer,
    contractInterface: batchRelayerAbi,
    functionName: 'multicall',
};

export const txPendingVar = makeVar(false);

export function useSubmitTransaction({ config, transactionType, waitForConfig }: Props): SubmitTransactionQuery {
    const { data: signer } = useSigner();
    const { showToast, updateToast } = useToast();
    const toastText = useRef<string>('');
    const walletText = useRef<string>('');
    const addRecentTransaction = useAddRecentTransaction();
    const provider = useProvider();

    const contractWrite = useContractWrite({
        signerOrProvider: signer,
        ...config,
        onSuccess(data, variables, context) {
            showToast({
                id: data.hash,
                content: (
                    <HStack>
                        <Text>
                            {toastGetTransactionStatusHeadline(transactionType, 'PENDING')}. &nbsp;
                            {toastText.current}
                        </Text>
                    </HStack>
                ),
                type: ToastType.Loading,
            });
            try {
                addRecentTransaction({
                    hash: data.hash,
                    description: walletText.current,
                });
            } catch {
                //TODO: need to handle this gracefully, can happen when user has too many recent transactions
            }

            txPendingVar(true);

            if (config?.onSuccess) {
                return config.onSuccess(data, variables, context);
            }
        },
    });

    const waitForTransaction = useWaitForTransaction({
        hash: contractWrite.data?.hash,
        wait: contractWrite.data?.wait,
        ...waitForConfig,
        onSettled(data, error) {
            updateToast(contractWrite.data?.hash || '', {
                type: ToastType.Success,
                content: (
                    <HStack>
                        <Text>
                            {toastGetTransactionStatusHeadline(transactionType, 'CONFIRMED')}&nbsp;-&nbsp;
                            {toastText.current}
                        </Text>
                    </HStack>
                ),
                auto: true,
            });
            txPendingVar(false);

            if (waitForConfig?.onSettled) {
                return waitForConfig.onSettled(data, error);
            }
        },
    });

    function submit(config: UseContractWriteMutationArgs & { toastText: string; walletText?: string }) {
        toastText.current = config.toastText;
        walletText.current = config.walletText || config.toastText;

        contractWrite.write({
            ...config,
            overrides: {
                ...config.overrides,
                gasLimit: getGasLimitEstimate(config.args),
            },
        });
    }

    async function submitAsync(config: UseContractWriteMutationArgs & { toastText: string; walletText?: string }) {
        toastText.current = config.toastText;
        walletText.current = config.walletText || config.toastText;

        return contractWrite.writeAsync({
            ...config,
            overrides: {
                ...config.overrides,
                gasLimit: getGasLimitEstimate(config.args),
            },
        });
    }

    async function getGasLimitEstimate(args: any[]): Promise<number> {
        const contract = new Contract(config.addressOrName, config.contractInterface, provider);
        const data = contract.interface.encodeFunctionData(config.functionName, args);
        const gasLimit = await signer!.estimateGas({ to: config.addressOrName, data });

        //we add a 2% buffer to avoid out of gas errors
        return Math.round(gasLimit.toNumber() * 1.02);
    }

    return {
        submit,
        submitAsync,

        isSubmitting: contractWrite.isLoading,
        submitError: contractWrite.error,
        isSubmitError: contractWrite.isError,

        isPending: waitForTransaction.isLoading,
        isConfirmed:
            waitForTransaction.isSuccess && waitForTransaction.data?.status !== 0 && waitForTransaction.error === null,
        isFailed:
            waitForTransaction.isError || waitForTransaction.error !== null || waitForTransaction.data?.status === 0,
        error: waitForTransaction.error,
        reset: contractWrite.reset,
        txResponse: contractWrite.data,
        txReceipt: waitForTransaction.data,
    };
}
