import { Box, CloseButton, HStack, Link, Progress, Text } from '@chakra-ui/react';
import {
    toastGetTransactionStatusHeadline,
    ToastTransactionStatus,
    BeetsTransactionType,
} from '~/components/toast/toast-util';
import { ExternalLink } from 'react-feather';
import { etherscanGetTxUrl } from '~/lib/util/etherscan';

interface Props {
    type: BeetsTransactionType;
    status: ToastTransactionStatus;
    text: string;
    txHash: string;
    onClose: () => void;
}

export function TransactionStatusToast({ type, status, text, onClose, txHash }: Props) {
    return (
        <Box position="relative" bgColor="black">
            {status === 'PENDING' ? (
                <Progress
                    isIndeterminate
                    size="xs"
                    colorScheme="orange"
                    borderTopLeftRadius="sm"
                    borderTopRightRadius="sm"
                    bg="orange"
                    opacity="0.9"
                />
            ) : (
                <Box
                    height="4px"
                    bg={status === 'CONFIRMED' ? 'beets.green' : 'beets.red'}
                    borderTopLeftRadius="sm"
                    borderTopRightRadius="sm"
                    opacity="0.9"
                />
            )}
            <Box p="2" borderBottomLeftRadius="sm" borderBottomRightRadius="sm" className="bg">
                <HStack mb="1">
                    <Text fontSize="md" color="white">
                        {toastGetTransactionStatusHeadline(type, status)}
                    </Text>
                    <Link userSelect="none" color="gray.100" href={etherscanGetTxUrl(txHash)} target="_blank">
                        <ExternalLink size={16} />
                    </Link>
                </HStack>
                <Text>{text}</Text>
            </Box>

            <CloseButton position="absolute" top="2" right="1" size="sm" onClick={onClose} />
        </Box>
    );
}
