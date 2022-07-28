import { useGetPoolBatchSwapsQuery } from '~/apollo/generated/graphql-codegen-generated';
import { Box } from '@chakra-ui/react';
import { BatchSwapListItem } from '~/components/batch-swap/components/BatchSwapListItem';
import { useEffect } from 'react';
import { useGetTokens } from '~/lib/global/useToken';

interface Props {
    tokenIn: string;
    tokenOut: string;
}

export function BatchSwapList({ tokenIn, tokenOut }: Props) {
    const { priceFor, getToken } = useGetTokens();
    const { data, startPolling } = useGetPoolBatchSwapsQuery({
        variables: { first: 6, skip: 0, where: { tokenInIn: [tokenIn], tokenOutIn: [tokenOut] } },
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
                    <BatchSwapListItem
                        batchSwap={batchSwap}
                        tokenIn={getToken(batchSwap.tokenIn)}
                        tokenOut={getToken(batchSwap.tokenOut)}
                        tokenInPrice={priceFor(tokenIn)}
                        tokenOutPrice={priceFor(tokenOut)}
                        key={batchSwap.id}
                    />
                );
            })}
        </Box>
    );
}
