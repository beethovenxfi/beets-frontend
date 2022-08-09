import { Box, BoxProps, Flex, Grid, GridItem } from '@chakra-ui/react';
import { BeetsHeadline } from '~/components/typography/BeetsHeadline';

import { useBoolean } from '@chakra-ui/hooks';
import { BeetsSubHeadline } from '~/components/typography/BeetsSubHeadline';
import { HomeNewsCard } from '~/modules/home/components/HomeNewsCard';
import { useGetHomeNewsItemsQuery } from '~/apollo/generated/graphql-codegen-generated';
import { HomeWhyUs } from '~/modules/home/components/HomeWhyUs';
import { HomeBeetsInfo } from '~/modules/home/components/HomeBeetsInfo';

export function HomeNews(props: BoxProps) {
    const [expanded, { on }] = useBoolean(false);
    const { data } = useGetHomeNewsItemsQuery({ fetchPolicy: 'cache-only' });
    const newsItems = data?.newsItems || [];

    return (
        <Box {...props}>
            <BeetsHeadline mb="10">What&apos;s new</BeetsHeadline>
            <BeetsSubHeadline mb="4">Latest community updates</BeetsSubHeadline>
            <Box>
                <Grid
                    templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(1, 1fr)' }}
                    columnGap={{ base: '0', md: '4', lg: '0' }}
                    rowGap="4"
                >
                    {newsItems.map((newsItem) => (
                        <GridItem key={newsItem.id}>
                            <HomeNewsCard item={newsItem} />
                        </GridItem>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}
