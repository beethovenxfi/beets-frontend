import { Box, Heading, Progress, Text } from '@chakra-ui/react';
import {
    toastGetTransactionStatusHeadline,
    ToastTransactionStatus,
    ToastTransactionType,
} from '~/components/toast/toast-util';

interface Props {
    type: ToastTransactionType;
    status: ToastTransactionStatus;
    text: string;
}

export function TransactionStatusToast({ type, status, text }: Props) {
    return (
        <Box p={3} bg={status === 'PENDING' ? 'blue.500' : status === 'CONFIRMED' ? 'green.500' : 'red.500'}>
            <Heading fontSize="md">{toastGetTransactionStatusHeadline(type, status)}</Heading>
            <Text>{text}</Text>
            {status === 'PENDING' ? <Progress isIndeterminate /> : null}
        </Box>
    );
}
