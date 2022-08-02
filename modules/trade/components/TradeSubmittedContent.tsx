import { Box } from '@chakra-ui/react';
import { BatchSwapSorRoute } from '~/components/batch-swap/BatchSwapSorRoute';
import { useTrade } from '~/modules/trade/lib/useTrade';
import { SubmitTransactionQuery } from '~/lib/util/useSubmitTransaction';
import { TransactionSubmittedContent } from '~/components/transaction/TransactionSubmittedContent';

interface Props {
    query: Omit<SubmitTransactionQuery, 'submit' | 'submitAsync'>;
}

export function TradeSubmittedContent({ query }: Props) {
    const { reactiveTradeState } = useTrade();
    const { isConfirmed, isFailed, isPending, error, txReceipt, txResponse } = query;

    console.log({ isConfirmed, isFailed, isPending, error, txReceipt, txResponse });

    return (
        <Box pt="4">
            {reactiveTradeState.sorResponse && <BatchSwapSorRoute swapInfo={reactiveTradeState.sorResponse} />}
            <TransactionSubmittedContent query={query} confirmedMessage="Your swap was successfully executed" mt="4" />
        </Box>
    );
}
