import { useContractWrite, useSigner, useWaitForTransaction } from 'wagmi';
import { WriteContractArgs, WriteContractConfig } from '@wagmi/core';
import { UseContractWriteConfig } from 'wagmi/dist/declarations/src/hooks/contracts/useContractWrite';
import { ToastId, useToast } from '@chakra-ui/toast';
import { ToastTransactionType } from '~/components/toast/toast-util';
import { TransactionStatusToast } from '~/components/toast/TransactionStatusToast';
import { networkConfig } from '~/lib/config/network-config';
import { Vault__factory } from '@balancer-labs/typechain';
import batchRelayerAbi from '~/lib/abi/BatchRelayer.json';
import { UseWaitForTransactionConfig } from 'wagmi/dist/declarations/src/hooks/transactions/useWaitForTransaction';
import { useRef } from 'react';

interface Props {
    contractConfig: Omit<WriteContractArgs, 'signerOrProvider'>;
    functionName: string;
    writeConfig?: UseContractWriteConfig;
    waitForConfig?: UseWaitForTransactionConfig;
    toastType: ToastTransactionType;
}

export const vaultContractConfig = {
    addressOrName: networkConfig.balancer.vault,
    contractInterface: Vault__factory.abi,
};

export const batchRelayerContractConfig = {
    addressOrName: networkConfig.balancer.batchRelayer,
    contractInterface: batchRelayerAbi,
};

export function useSubmitTransaction({ contractConfig, functionName, writeConfig, toastType, waitForConfig }: Props) {
    const signer = useSigner();
    const toast = useToast();
    const pendingToastIdRef = useRef<ToastId | undefined>();
    const toastText = useRef<string>('');

    const contractWrite = useContractWrite(
        {
            signerOrProvider: signer.data,
            ...contractConfig,
        },
        functionName,
        {
            ...writeConfig,
            onSuccess(data, variables, context) {
                pendingToastIdRef.current = toast({
                    position: 'bottom-left',
                    render: () => <TransactionStatusToast type={toastType} status="PENDING" text={toastText.current} />,
                    duration: null,
                });

                if (writeConfig?.onSuccess) {
                    return writeConfig.onSuccess(data, variables, context);
                }
            },
        },
    );

    const waitForTransaction = useWaitForTransaction({
        hash: contractWrite.data?.hash,
        wait: contractWrite.data?.wait,
        ...waitForConfig,
        onSettled(data, error) {
            if (pendingToastIdRef.current) {
                toast.close(pendingToastIdRef.current);
            }

            toast({
                position: 'bottom-left',
                render: () => (
                    <TransactionStatusToast
                        type={toastType}
                        status={error ? 'ERROR' : 'CONFIRMED'}
                        text={toastText.current}
                    />
                ),
            });

            if (waitForConfig?.onSettled) {
                return waitForConfig.onSettled(data, error);
            }
        },
    });

    function submit(config: WriteContractConfig & { toastText: string }) {
        toastText.current = config.toastText;
        contractWrite.write(config);
    }

    async function submitAsync(config: WriteContractConfig & { toastText: string }) {
        toastText.current = config.toastText;
        return contractWrite.writeAsync(config);
    }

    return {
        submit,
        submitAsync,

        isSubmitting: contractWrite.isLoading,
        submitError: contractWrite.error,
        isSubmitError: contractWrite.isError,

        isPending: waitForTransaction.isLoading,
        isConfirmed: waitForTransaction.isSuccess,
        isFailed: waitForTransaction.isError,
        error: waitForTransaction.error,
    };
}
