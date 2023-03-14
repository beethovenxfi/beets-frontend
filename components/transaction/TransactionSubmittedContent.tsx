import { Alert, AlertIcon, Box, BoxProps, Link, Spinner, Text, VStack, HStack, Flex } from '@chakra-ui/react';
import { addressShortDisplayName, isBatchRelayer, isVault } from '~/lib/util/address';
import {
    etherscanGetAddressUrl,
    etherscanGetBlockUrl,
    etherscanGetTxUrl,
    etherscanTxShortenForDisplay,
} from '~/lib/util/etherscan';
import { SubmitTransactionQuery } from '~/lib/util/useSubmitTransaction';
import { FadeInBox } from '~/components/animation/FadeInBox';
import { transactionMessageFromError } from '~/lib/util/transaction-util';
import { ExternalLink } from 'react-feather';

interface Props extends BoxProps {
    query: Omit<SubmitTransactionQuery, 'submit' | 'submitAsync'>;
    confirmedMessage?: string;
    showSpinnerOnPending?: boolean;
}

export function TransactionSubmittedContent({ query, confirmedMessage, showSpinnerOnPending, ...rest }: Props) {
    const { isFailed, error, txReceipt, txResponse, isConfirmed, isPending } = query;

    const getContractName = (to: string) => {
        if (isVault(to)) return 'Vault';
        if (isBatchRelayer(to)) return 'Batch relayer';
        return addressShortDisplayName(to);
    };

    const getTransactionStatus = () => {
        if (isFailed) return 'Failed';
        if (isConfirmed) return '';
        if (isPending) return 'Your transaction is pending';
        return 'Unknown transaction state...';
    };

    return (
        <VStack {...rest} width="full" spacing="2">
            <VStack width="full">
                {error ? (
                    <Box width="full">
                        <Alert width="full" status="error">
                            <AlertIcon />
                            {transactionMessageFromError(error)}
                        </Alert>
                    </Box>
                ) : null}
                <Box width="full">
                    {confirmedMessage && (
                        <FadeInBox isVisible={query.isConfirmed}>
                            <Alert status="success" borderRadius="md">
                                <AlertIcon />
                                {confirmedMessage}
                            </Alert>
                        </FadeInBox>
                    )}
                </Box>
            </VStack>

            <VStack width="full" py="4" backgroundColor="blackAlpha.500" px="5">
                {txResponse?.hash && (
                    <HStack width="full" justifyContent="space-between">
                        <Text color="gray.100" fontSize=".85rem">
                            Transaction Hash
                        </Text>
                        <Link href={etherscanGetTxUrl(txResponse.hash)} target="_blank">
                            <HStack>
                                <Text fontSize=".85rem">{etherscanTxShortenForDisplay(txResponse.hash)}</Text>
                                <ExternalLink size="16" />
                            </HStack>
                        </Link>
                    </HStack>
                )}
                {txReceipt?.to && (
                    <HStack width="full" justifyContent="space-between">
                        <Text color="gray.100" fontSize=".85rem">
                            Contract
                        </Text>
                        <Link href={etherscanGetAddressUrl(txReceipt.to)} target="_blank">
                            <HStack>
                                <Text fontSize=".85rem">{getContractName(txReceipt.to)}</Text>
                                <ExternalLink size="16" />
                            </HStack>
                        </Link>
                    </HStack>
                )}
                {txReceipt?.blockNumber && (
                    <HStack width="full" justifyContent="space-between">
                        <Text color="gray.100" fontSize=".85rem">
                            Block number
                        </Text>
                        <Link href={etherscanGetBlockUrl(txReceipt.blockNumber)} target="_blank">
                            <HStack>
                                <Text fontSize=".85rem">{txReceipt.blockNumber}</Text>
                                <ExternalLink size="16" />
                            </HStack>
                        </Link>
                    </HStack>
                )}
            </VStack>
        </VStack>
    );
}
