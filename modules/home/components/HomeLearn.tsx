import { Box, BoxProps, Button, Flex, Grid, GridItem } from '@chakra-ui/react';
import { BeetsHeadline } from '~/components/typography/BeetsHeadline';

import { BeetsSubHeadline } from '~/components/typography/BeetsSubHeadline';
import { HomeLearnItem } from '~/modules/home/components/HomeLearnItem';

export function HomeLearn(props: BoxProps) {
    return (
        <Box {...props}>
            <Grid templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }} mb="16">
                <GridItem>
                    <BeetsHeadline mb="8">Learning the notes</BeetsHeadline>
                    <Box>
                        DeFi can be confusing; whether you’re a beginner or a seasoned veteran, we want to provide you
                        with information that helps. Check out the resources below to learn more about DeFi, Beethoven X
                        and the technology we provide.
                    </Box>
                </GridItem>
            </Grid>
            <Grid templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }} gap="12">
                <GridItem>
                    <BeetsSubHeadline mb="8">Beethoven X Basics</BeetsSubHeadline>
                    <HomeLearnItem
                        title="Weighted Pools"
                        description="From multiple assets, customized token weightings and dynamic swap fees, weighted pools are the industry standard when it comes to tailored investment strategies. Discover more about this unique type of liquidity pool and how you can get the most out of it."
                        url="https://beethovenxio.medium.com/learning-the-notes-weighted-pools-3d3af2d2ebc6"
                    />
                    <HomeLearnItem
                        title="Boosted Pools"
                        description="Boosted pools make it possible for idle liquidity to be deposited into revenue generating protocols adding an additional source of yield for users. Learn more about this nascent technology and how they are changing the landscape for sustainable liquidity."
                        url="https://beethovenxio.medium.com/boosted-pools-the-future-of-liquidity-provision-reimagined-7f99113ab2a2"
                    />
                    <HomeLearnItem
                        title="Gauge Voting"
                        description="30% of all the Beethoven X emissions are distributed to liquidity pools based on a bi-weekly gauge vote. Learn all about how to get involved, the mechanics of the gauge vote, bribes, snapshots and more."
                        url="https://beethovenxio.medium.com/beethoven-x-gauge-vote-maximising-your-melody-fbeb10e5711b"
                    />
                    <HomeLearnItem
                        title="LBP launches"
                        description="A capital efficient process for fair distribution and permissionless price discovery, Liquidity Bootstrapping Pools (LBPs) have set the standard for new token launches. Discover more about how they work and how you can get involved in the fairest token launch possible."
                        url="https://beethovenxio.medium.com/lbp-launches-a706e439dfd2"
                        last={true}
                    />
                </GridItem>
                <GridItem>
                    <BeetsSubHeadline mb="8">DeFi 101</BeetsSubHeadline>
                    <HomeLearnItem
                        title="Getting started: What is DeFi?"
                        description="Discover a brand new way to manage your finances. Decentralized Finance (DeFi) is an emerging industry that removes the control banks and institutions have over financial services. Permissionless and decentralized, DeFi is revolutionizing the financial world as we know it."
                        url="https://blockbytes.com/2022/06/15/core-series-defi/"
                    />
                    <HomeLearnItem
                        title="Basics: How to set up a MetaMask wallet"
                        description="To begin your DeFi journey, you first need a web3 wallet. From the basics of setting one up to your first transactions, learn all there is to know about navigating MetaMask in DeFi."
                        url="https://blockbytes.com/2022/05/26/how-to-set-up-metamask-for-web-3/"
                    />
                    <HomeLearnItem
                        title="Basics: How to bridge to Optimism?"
                        description="Are you interested in exploring a whole new ecosystem? Bridges in web3 can be confusing to navigate even for the most experienced users. Learn about all the right steps you need to take to get your assets bridged across safely."
                        url="https://blockbytes.com/2022/07/06/how-to-bridge-tokens-to-optimism-with-multichain/"
                        last={true}
                    />
                </GridItem>
                <GridItem>
                    <BeetsSubHeadline mb="8">Other resources</BeetsSubHeadline>
                    <HomeLearnItem
                        title="Blockbytes"
                        description="Blockbytes is a next-generation multi-media and education platform built to empower users in the wonderful world of web3. From deep dives into individual protocols, AMAs, newsletters and weekly live shows, BlockBytes has become a staple for anyone looking to learn more about DeFi."
                        url="https://blockbytes.com/"
                    />
                    <HomeLearnItem
                        title="Balancer (balancer.fi)"
                        description="Beethoven X is an official friendly fork built on top of Balancer. Take a deep dive into the foundations that made it all possible and learn all there is to know about the wonders of Balancer technology."
                        url="https://docs.balancer.fi/"
                    />

                    <Box flex="1" mb="12">
                        <BeetsSubHeadline mb="8">Want to dive even deeper?</BeetsSubHeadline>
                        <Button variant="primary" as="a" href="https://docs.beets.fi" target="_blank">
                            Check out our Docs
                        </Button>
                    </Box>
                </GridItem>
            </Grid>
        </Box>
    );
}
