import { Box, BoxProps, Grid, GridItem } from '@chakra-ui/react';
import NextImage from 'next/image';
import WhyUsImage from '~/assets/images/why-us.png';
import WhyUsOpImage from '~/assets/images/why-us-OP.png';
import { BeetsHeadline } from '~/components/typography/BeetsHeadline';
import { BeetsSubHeadline } from '~/components/typography/BeetsSubHeadline';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function HomeWhyUs(props: BoxProps) {
    const { chainId } = useNetworkConfig();

    return (
        <Box {...props}>
            <BeetsHeadline mb="8">Built for the Future - Accessible, Innovative</BeetsHeadline>
            <Box mr={{ base: '0', lg: '20' }}>
                Designed to evolve and adapt, Beethoven X provides all the tools necessary for anyone to participate in
                the future of finance.
            </Box>
            <Box my="6" display="flex" justifyContent="center">
                <NextImage src={chainId === '10' ? WhyUsOpImage : WhyUsImage} width="657px" height="250px" />
            </Box>
            <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }} gap="8">
                <GridItem>
                    <BeetsSubHeadline mb={{ base: '2', md: '6' }}>For Traders</BeetsSubHeadline>
                    <Box>
                        Take advantage of optimal swap rates, minimal slippage and concentrated liquidity as the Smart
                        Order Router seeks to find traders the most optimal price.
                    </Box>
                </GridItem>
                <GridItem>
                    <BeetsSubHeadline mb={{ base: '2', md: '6' }}>For Investors</BeetsSubHeadline>
                    <Box>
                        Flip traditional finance on its head with customisable crypto index funds; eliminate the
                        middleman and earn yield on your portfolio.
                    </Box>
                </GridItem>
                <GridItem>
                    <BeetsSubHeadline mb={{ base: '2', md: '6' }}>For Protocols</BeetsSubHeadline>
                    <Box>
                        Beethoven X leverages constant innovation to bring to its users novel primitives that are
                        tailored to meet the demands of an ever-changing marketplace.
                    </Box>
                </GridItem>
            </Grid>
        </Box>
    );
}
