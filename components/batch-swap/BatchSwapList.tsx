import { useGetPoolBatchSwapsQuery } from '~/apollo/generated/graphql-codegen-generated';
import { Box } from '@chakra-ui/react';
import { BatchSwapListItem } from '~/components/batch-swap/components/BatchSwapListItem';
import { useEffect } from 'react';
import { useGetTokens } from '~/lib/global/useToken';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
    tokenIn: string;
    tokenOut: string;
}

export function BatchSwapList({ tokenIn, tokenOut }: Props) {
    const { priceFor, getToken } = useGetTokens();
    const { data, startPolling } = useGetPoolBatchSwapsQuery({
        variables: { first: 5, skip: 0, where: { tokenInIn: [tokenIn], tokenOutIn: [tokenOut] } },
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        startPolling(15000);
    });

    const batchSwaps = data?.batchSwaps || [];

    return (
        <Box>
            {batchSwaps.map((batchSwap) => {
                return (
                    <AnimatePresence key={batchSwap.id}>
                        <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <BatchSwapListItem
                                batchSwap={batchSwap}
                                tokenIn={getToken(batchSwap.tokenIn)}
                                tokenOut={getToken(batchSwap.tokenOut)}
                                tokenInPrice={priceFor(tokenIn)}
                                tokenOutPrice={priceFor(tokenOut)}
                            />
                        </motion.div>
                    </AnimatePresence>
                );
            })}
        </Box>
    );
}
