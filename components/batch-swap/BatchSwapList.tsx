import { useGetPoolBatchSwapsQuery } from '~/apollo/generated/graphql-codegen-generated';
import { Box } from '@chakra-ui/react';
import { NetworkStatus } from '@apollo/client';
import BeetsButton from '~/components/button/Button';
import { BatchSwapListItem } from '~/components/batch-swap/components/BatchSwapListItem';
import Card from '~/components/card/Card';

interface Props {
    tokenIn: string;
    tokenOut: string;
}

export function BatchSwapList({ tokenIn, tokenOut }: Props) {
    const { data, fetchMore, networkStatus, loading } = useGetPoolBatchSwapsQuery({
        variables: { first: 8, skip: 0, where: { tokenInIn: [tokenIn], tokenOutIn: [tokenOut] } },
        notifyOnNetworkStatusChange: true,
    });

    const batchSwaps = data?.batchSwaps || [];

    return (
        <Box>
            <Box>
                {batchSwaps.map((batchSwap) => (
                    <BatchSwapListItem batchSwap={batchSwap} key={batchSwap.id} />
                ))}
            </Box>
            {/*<BeetsButton
                width="full"
                isLoading={networkStatus === NetworkStatus.fetchMore}
                onClick={() => {
                    fetchMore({ variables: { skip: batchSwaps.length } }).catch();
                }}
                flex={1}
            >
                Load more
            </BeetsButton>*/}
        </Box>
    );
}
