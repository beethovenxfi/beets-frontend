import { Box, BoxProps, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import NextImage from 'next/image';
import WhyUsImage from '~/assets/images/why-us.png';
import { BeetsHeadline } from '~/components/typography/BeetsHeadline';
import { BeetsSubHeadline } from '~/components/typography/BeetsSubHeadline';

export function HomeWhyUs(props: BoxProps) {
    return (
        <Box {...props}>
            <BeetsHeadline mb="8">Built for the Future. Accessible. Innovative.</BeetsHeadline>
            <Box mr={{ base: '0', lg: '20' }}>
                Designed to evolve, designed to adapt, Beethoven X provides all the tools necessary for anyone to
                participate in the future of finance.
            </Box>
            <Box my="6" display="flex" justifyContent="center">
                <NextImage src={WhyUsImage} width="657px" height="250px" />
            </Box>
            <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }} gap="8">
                <GridItem>
                    <BeetsSubHeadline mb={{ base: '2', md: '6' }}>For Traders</BeetsSubHeadline>
                    <Box>
                        Take advantage of optimal swap rates, minimal slippage and concentrated liquidity as the Smart
                        Order Router (SOR) searches all of the Beethoven X pools to find the best price.
                    </Box>
                </GridItem>
                <GridItem>
                    <BeetsSubHeadline mb={{ base: '2', md: '6' }}>For Investors</BeetsSubHeadline>
                    <Box>
                        Tailored portfolios that generate yield. Flip traditional finance on its head with unique crypto
                        index funds; eliminate the middleman and earn portfolio rebalancing fees.
                    </Box>
                </GridItem>
                <GridItem>
                    <BeetsSubHeadline mb={{ base: '2', md: '6' }}>For Protocols</BeetsSubHeadline>
                    <Box>
                        Launch your token in the fairest way possible, using an LGE. Use an 80/20 BPT instead of single
                        staking to capture market volatility with minimal impermanent loss.
                    </Box>
                </GridItem>
            </Grid>
        </Box>
    );
}
