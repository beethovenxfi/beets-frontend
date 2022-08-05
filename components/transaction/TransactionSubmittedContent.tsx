import { Alert, AlertIcon, Box, BoxProps, Link, Spinner, Text } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { CardRow } from '~/components/card/CardRow';
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

interface Props extends BoxProps {
    query: Omit<SubmitTransactionQuery, 'submit' | 'submitAsync'>;
    confirmedMessage?: string;
}

export function TransactionSubmittedContent({ query, confirmedMessage, ...rest }: Props) {
    const { isConfirmed, isFailed, isPending, error, txReceipt, txResponse } = query;

    return (
        <Box {...rest}>
            <BeetsBox width="full" p="2">
                <CardRow>
                    <Box flex="1">Status</Box>
                    <Box color={isFailed ? 'beets.red' : isConfirmed ? 'beets.green' : 'orange'}>
                        {/*isPending && <Spinner size="sm" mr="2" />*/}
                        {isFailed ? 'Failed' : isConfirmed ? 'Confirmed' : isPending ? 'Pending' : 'Unknown'}
                    </Box>
                </CardRow>
                {txResponse?.hash && (
                    <CardRow>
                        <Box flex="1">Transaction hash</Box>
                        <Box>
                            <Link href={etherscanGetTxUrl(txResponse.hash)} target="_blank">
                                {etherscanTxShortenForDisplay(txResponse.hash)}
                            </Link>
                        </Box>
                    </CardRow>
                )}
                {txResponse?.to && (
                    <CardRow>
                        <Box flex="1">Contract</Box>
                        <Box alignItems="flex-end" display="flex" flexDirection="column">
                            <Link href={etherscanGetAddressUrl(txResponse.to)} target="_blank">
                                {addressShortDisplayName(txResponse.to)}
                            </Link>
                            {isVault(txResponse.to) && <Text color="gray.200">Vault</Text>}
                            {isBatchRelayer(txResponse.to) && <Text color="gray.200">Batch relayer</Text>}
                        </Box>
                    </CardRow>
                )}
                {txReceipt?.blockNumber && (
                    <CardRow mb="0">
                        <Box flex="1">Block number</Box>
                        <Box>
                            <Link href={etherscanGetBlockUrl(txReceipt.blockNumber)} target="_blank">
                                {txReceipt.blockNumber}
                            </Link>
                        </Box>
                    </CardRow>
                )}
                {error ? (
                    <Alert status="error" mt={4}>
                        <AlertIcon />
                        {transactionMessageFromError(error)}
                    </Alert>
                ) : null}
            </BeetsBox>
            {confirmedMessage && (
                <FadeInBox isVisible={query.isConfirmed}>
                    <Alert status="success" borderRadius="md" mt="4">
                        <AlertIcon />
                        {confirmedMessage}
                    </Alert>
                </FadeInBox>
            )}
        </Box>
    );
}
