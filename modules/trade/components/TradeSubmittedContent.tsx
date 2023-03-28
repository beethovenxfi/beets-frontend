import { Box } from '@chakra-ui/react';
import { BatchSwapSorRoute } from '~/components/batch-swap/BatchSwapSorRoute';
import { useTrade } from '~/modules/trade/lib/useTrade';
import { SubmitTransactionQuery } from '~/lib/util/useSubmitTransaction';
import { TransactionSubmittedContent } from '~/components/transaction/TransactionSubmittedContent';
import { useEffect } from 'react';
import { useUserTokenBalances } from '~/lib/user/useUserTokenBalances';

interface Props {
    query: Omit<SubmitTransactionQuery, 'submit' | 'submitAsync'>;
}

export function TradeSubmittedContent({ query }: Props) {
    const { swapInfo } = useTrade();
    const { refetch } = useUserTokenBalances();

    useEffect(() => {
        if (query.isConfirmed) {
            refetch();
        }
    }, [query.isConfirmed]);

    return (
        <Box pt="4">
            {swapInfo && (
                <Box px="4">
                    <BatchSwapSorRoute swapInfo={swapInfo} minimalWidth={true} />
                </Box>
            )}
            <TransactionSubmittedContent
                query={query}
                confirmedMessage="Your swap was successfully executed"
                mt="4"
                showSpinnerOnPending={true}
            />
        </Box>
    );
}
