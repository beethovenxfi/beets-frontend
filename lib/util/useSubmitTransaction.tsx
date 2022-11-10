import { useContractWrite, useSigner, useWaitForTransaction } from 'wagmi';
import {
    UseContractWriteArgs,
    UseContractWriteConfig,
    UseContractWriteMutationArgs,
} from 'wagmi/dist/declarations/src/hooks/contracts/useContractWrite';
import { ToastId, useToast } from '@chakra-ui/react';
import { BeetsTransactionType } from '~/components/toast/toast-util';
import { TransactionStatusToast } from '~/components/toast/TransactionStatusToast';
import { networkConfig } from '~/lib/config/network-config';
import { Vault__factory } from '@balancer-labs/typechain';
import batchRelayerAbi from '~/lib/abi/BatchRelayer.json';
import { UseWaitForTransactionConfig } from 'wagmi/dist/declarations/src/hooks/transactions/useWaitForTransaction';
import { useRef } from 'react';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { makeVar } from '@apollo/client';
import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers';

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
    const signer = useSigner();
    const toast = useToast();
    const toastIdRef = useRef<ToastId | undefined>();
    const toastText = useRef<string>('');
    const walletText = useRef<string>('');
    const addRecentTransaction = useAddRecentTransaction();

    const contractWrite = useContractWrite({
        signerOrProvider: signer.data,
        ...config,
        onSuccess(data, variables, context) {
            toastIdRef.current = toast({
                position: 'bottom-left',
                render: ({ onClose }) => (
                    <TransactionStatusToast
                        type={transactionType}
                        status="PENDING"
                        text={toastText.current}
                        onClose={onClose}
                        txHash={data.hash}
                    />
                ),
                duration: null,
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
            if (toastIdRef.current) {
                toast.close(toastIdRef.current);
            }

            txPendingVar(false);

            setTimeout(() => {
                toast({
                    position: 'bottom-left',
                    render: ({ onClose }) => (
                        <TransactionStatusToast
                            type={transactionType}
                            status={error || data?.status === 0 ? 'ERROR' : 'CONFIRMED'}
                            text={toastText.current}
                            onClose={onClose}
                            txHash={data?.transactionHash || ''}
                        />
                    ),
                });
            }, 500);

            if (waitForConfig?.onSettled) {
                return waitForConfig.onSettled(data, error);
            }
        },
    });

    function submit(config: UseContractWriteMutationArgs & { toastText: string; walletText?: string }) {
        toastText.current = config.toastText;
        walletText.current = config.walletText || config.toastText;
        contractWrite.write(config);
    }

    async function submitAsync(config: UseContractWriteMutationArgs & { toastText: string; walletText?: string }) {
        toastText.current = config.toastText;
        walletText.current = config.walletText || config.toastText;
        return contractWrite.writeAsync(config);
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
