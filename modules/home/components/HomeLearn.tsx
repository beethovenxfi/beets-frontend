import { Box, BoxProps, Flex, Grid, GridItem } from '@chakra-ui/react';
import { BeetsHeadline } from '~/components/typography/BeetsHeadline';
import BeetsButton from '~/components/button/Button';
import { BeetsSubHeadline } from '~/components/typography/BeetsSubHeadline';
import { HomeLearnItem } from '~/modules/home/components/HomeLearnItem';

export function HomeLearn(props: BoxProps) {
    return (
        <Box {...props}>
            <Grid templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }} mb="16">
                <GridItem>
                    <BeetsHeadline mb="8">Learning the notes</BeetsHeadline>
                    <Box>
                        If you’re new to DeFi or even a seasoned vet- it’s always wise to DYOR and get schooled up every
                        now and then. Check out resources below to learn more about DeFi and Beethoven X and the
                        technology we provide.
                    </Box>
                </GridItem>
            </Grid>
            <Grid templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }} gap="12">
                <GridItem>
                    <BeetsSubHeadline mb="8">Beethoven X</BeetsSubHeadline>
                    <HomeLearnItem
                        title={'Boosted Pools on Beethoven X'}
                        description={
                            'Boosted Pools make it possible for the idle liquidity to be deposited into yield generating protocols.'
                        }
                        url={'https://beets.fi'}
                    />
                    <HomeLearnItem
                        title={'Gauge Voting'}
                        description={
                            'Go deep and learn about gauge voting on Beethoven X. Get a firm understanding epics, bribes, incentives, snapshots and more.'
                        }
                        url={'https://beets.fi'}
                    />
                    <HomeLearnItem
                        title={'LBP Launches'}
                        description={
                            'Dive into to Liquidity Bootstrapping Pools.\n\nLearn about the mechanics of how a tokenWithAmount is launched in a “classic launch pad” launch.'
                        }
                        url={'https://beets.fi'}
                    />
                    <HomeLearnItem
                        title={'Weighted Pools'}
                        description={
                            'Get up to speed on the foundation of our platform- weighted pools. Discover how epic this type of liquidity pool is with higher degrees of versatility and configurability.'
                        }
                        url={'https://beets.fi'}
                        last={true}
                    />
                </GridItem>
                <GridItem>
                    <BeetsSubHeadline mb="8">DeFi</BeetsSubHeadline>
                    <HomeLearnItem
                        title={'Getting started: What is DeFi'}
                        description={
                            'Boosted Pools make it possible for the idle liquidity to be deposited into revenue generating protocols.'
                        }
                        url={'https://beets.fi'}
                    />
                    <HomeLearnItem
                        title={'Basics: Buying, Swapping, Selling'}
                        description={
                            'Go deep and learn about gauge voting on Beethoven X. Get a firm understanding epics, bribes, incentives, snapshots and more.'
                        }
                        url={'https://beets.fi'}
                    />
                    <HomeLearnItem
                        title={'Basics: What is- and do I need a Hardware wallet?'}
                        description={
                            'Dive into to Liquidity Bootstrapping Pools.\n\nLearn about the mechanics of how a tokenWithAmount is launched in a “classic launch pad” launch.'
                        }
                        url={'https://beets.fi'}
                    />
                    <HomeLearnItem
                        title={'Basics: How to invest & what is farming?'}
                        description={
                            'Get up to speed on the foundation of our platform- weighted pools. Discover how epic this type of liquidity pool is with higher degrees of versatility and configurability.'
                        }
                        url={'https://beets.fi'}
                        last={true}
                    />
                </GridItem>
                <GridItem>
                    <BeetsSubHeadline mb="8">Other resources</BeetsSubHeadline>
                    <HomeLearnItem
                        title={'FTMAlerts (YouTube)'}
                        description={
                            'Weekly roundup of the latest news on Fantom Opera and other networks, the projects and wider market commentary.'
                        }
                        url={'https://beets.fi'}
                    />
                    <HomeLearnItem
                        title={'Balancer (balancer.fi)'}
                        description={'Beethoven X is built on Balancer V2 by Balancer Labs.'}
                        url={'https://beets.fi'}
                    />
                    <HomeLearnItem
                        title={'DeBank.com'}
                        description={
                            'Track your DeFi portfolio easily without even having to connect your wallet. Just supply a wallet address!'
                        }
                        url={'https://beets.fi'}
                    />

                    <Box flex="1" mt="12" mb="12">
                        <BeetsSubHeadline mb="8">Want to dive even deeper?</BeetsSubHeadline>
                        <BeetsButton as="a" href="https://docs.beets.fi" target="_blank">
                            Check out our Docs
                        </BeetsButton>
                    </Box>
                </GridItem>
            </Grid>
        </Box>
    );
}
