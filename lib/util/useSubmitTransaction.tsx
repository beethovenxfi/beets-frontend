import { useContractWrite, usePrepareContractWrite, useSigner, useWaitForTransaction } from 'wagmi';
import { BeetsTransactionType, toastGetTransactionStatusHeadline } from '~/components/toast/toast-util';
import { networkConfig } from '~/lib/config/network-config';
import { Vault__factory } from '@balancer-labs/typechain';
import batchRelayerAbi from '~/lib/abi/BatchRelayer.json';
import { useEffect, useRef, useState } from 'react';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { makeVar } from '@apollo/client';
import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import { HStack, Text } from '@chakra-ui/react';

// TODO: fix typing
interface Props {
    config: any;
    waitForConfig?: any;
    transactionType: BeetsTransactionType;
}

export interface SubmitTransactionQuery {
    submit: (config: any & { toastText: string; walletText?: string }) => void;
    submitAsync: (config: any & { toastText: string; walletText?: string }) => Promise<any>;

    disabled: boolean;

    isSubmitting: boolean;
    submitError: Error | null;
    isSubmitError: boolean;

    isPending: boolean;
    isConfirmed: boolean;
    isFailed: boolean;
    error: Error | null;
    reset: () => void;

    txResponse?: any;
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
    const { showToast, updateToast } = useToast();
    const toastText = useRef<string>('');
    const walletText = useRef<string>('');
    const addRecentTransaction = useAddRecentTransaction();
    const [args, setArgs] = useState([]);
    const [overrides, setOverrides] = useState({});

    const { isSuccess, ...prepareContract } = usePrepareContractWrite({
        address: config.addressOrName,
        abi: config.contractInterface,
        functionName: config.functionName,
        signer: signer.data,
        args,
        overrides,
        enabled: args.length !== 0,
    });

    const contractWrite = useContractWrite({
        ...prepareContract.config,
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

    useEffect(() => {
        console.log('effect fired!');
        if (isSuccess) {
            console.log(args, overrides, contractWrite);
            try {
                contractWrite.write?.();
            } catch (error) {
                console.log('error: ', error);
            }
        }

        return () => {
            contractWrite.reset();
        };
    }, [args, overrides, isSuccess]);

    function submit(config: any & { toastText: string; walletText?: string }) {
        toastText.current = config.toastText;
        walletText.current = config.walletText || config.toastText;
        setArgs(config.args);
        if (config.overrides) {
            setOverrides(config.overrides);
        }
    }

    // TODO: this function isn't used, do we need to keep it?
    async function submitAsync(config: any & { toastText: string; walletText?: string }) {
        toastText.current = config.toastText;
        walletText.current = config.walletText || config.toastText;
        return contractWrite.writeAsync?.(config);
    }

    return {
        submit,
        submitAsync,

        disabled: !isSuccess && args.length !== 0,

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
