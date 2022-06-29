import { Box, BoxProps, Flex, Grid, GridItem, Image } from '@chakra-ui/react';
import { PoolCard } from '~/components/pool-card/PoolCard';
import { BeetsHeadline } from '~/components/typography/BeetsHeadline';
import { BeetsSubHeadline } from '~/components/typography/BeetsSubHeadline';
import { PoolCardCarousel } from '~/components/carousel/PoolCardCarousel';
import BeetsButton from '~/components/button/Button';
import NextImage from 'next/image';
import PoolIcon1 from '~/assets/icons/pool-icon-1.svg';
import PoolIcon2 from '~/assets/icons/pool-icon-2.svg';
import PoolIcon3 from '~/assets/icons/pool-icon-3.svg';

export function HomePools(props: BoxProps) {
    //minWidth = 0 is needed for a swiper nested in a flex layout
    return (
        <Box minWidth="0" {...props}>
            <BeetsHeadline mb="10">My investments</BeetsHeadline>
            <Box
                mb="10"
                sx={{
                    '.swiper-pagination': {
                        bottom: '0px',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                    },
                    '.swiper': {
                        paddingBottom: '6',
                    },
                }}
            >
                <BeetsSubHeadline mb="4">$361.85 invested across 4 pools</BeetsSubHeadline>
                <PoolCardCarousel
                    items={[
                        <PoolCard key="1" />,
                        <PoolCard key="2" />,
                        <PoolCard key="3" />,
                        <PoolCard key="4" />,
                        <PoolCard key="5" />,
                        <PoolCard key="6" />,
                        <PoolCard key="7" />,
                        <PoolCard key="8" />,
                    ]}
                />
            </Box>
            <BeetsHeadline mb="10">Featured pools</BeetsHeadline>
            <Box mb="8">
                <Flex mb="4">
                    <NextImage src={PoolIcon1} />
                    <BeetsSubHeadline ml="2">New & popular</BeetsSubHeadline>
                </Flex>
                <PoolCardCarousel
                    items={[
                        <PoolCard key="1" />,
                        <PoolCard key="2" />,
                        <PoolCard key="3" />,
                        <PoolCard key="4" />,
                        <PoolCard key="5" />,
                        <PoolCard key="6" />,
                        <PoolCard key="7" />,
                        <PoolCard key="8" />,
                    ]}
                />
            </Box>
            <Box mb="8">
                <Flex mb="4">
                    <NextImage src={PoolIcon2} />
                    <BeetsSubHeadline ml="2">Index fund pools</BeetsSubHeadline>
                </Flex>
                <PoolCardCarousel
                    items={[<PoolCard key="1" />, <PoolCard key="2" />, <PoolCard key="3" />, <PoolCard key="4" />]}
                />
            </Box>
            <Box mb="8">
                <Flex mb="4">
                    <NextImage src={PoolIcon3} />
                    <BeetsSubHeadline ml="2">Boosted pools</BeetsSubHeadline>
                </Flex>
                <PoolCardCarousel
                    items={[
                        <PoolCard key="1" />,
                        <PoolCard key="2" />,
                        <Flex alignItems="flex-end" justifyContent="center" height="100%" key="3">
                            <Image
                                src="https://beethoven-assets.s3.eu-central-1.amazonaws.com/boosted-ludwig-min.png"
                                width="full"
                                position="absolute"
                                top="0"
                                left="0"
                                bottom="0"
                                right="0"
                            />
                            <BeetsButton onClick={() => {}}>What is a Boosted pool?</BeetsButton>
                        </Flex>,
                    ]}
                />
                {/*<Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap={{ base: '4', lg: '6' }}>
                    <GridItem>
                        <PoolCard />
                    </GridItem>
                    <GridItem>
                        <PoolCard />
                    </GridItem>
                    <GridItem rowSpan={1}>
                        <Flex position="relative" alignItems="flex-end" justifyContent="center" height="full">
                            <Image
                                src="https://beethoven-assets.s3.eu-central-1.amazonaws.com/boosted-ludwig-min.png"
                                width="full"
                                position="absolute"
                                top="0"
                                left="0"
                                bottom="0"
                                right="0"
                            />
                            <BeetsButton onClick={() => {}}>What is a Boosted pool?</BeetsButton>
                        </Flex>
                    </GridItem>
                </Grid>*/}
            </Box>
            <Box>
                <Flex mb="4">
                    <NextImage src={PoolIcon3} />
                    <BeetsSubHeadline ml="2">Stable pools</BeetsSubHeadline>
                </Flex>
                <PoolCardCarousel items={[<PoolCard key="1" />, <PoolCard key="2" />]} />
            </Box>
        </Box>
    );
}
