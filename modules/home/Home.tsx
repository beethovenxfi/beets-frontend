import { Box, Flex, Grid, GridItem } from '@chakra-ui/react';
import { HomeHero } from '~/modules/home/components/HomeHero';
import { HomePools } from '~/modules/home/components/HomePools';
import { HomeNews } from '~/modules/home/components/HomeNews';
import { HomeWhyUs } from '~/modules/home/components/HomeWhyUs';
import { HomeBeetsInfo } from '~/modules/home/components/HomeBeetsInfo';
import { HomeLearn } from '~/modules/home/components/HomeLearn';
import { PoolCard } from '~/components/pool-card/PoolCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ReactNode } from 'react';
import { Pagination } from 'swiper';

export function Home() {
    return (
        <Box>
            <HomeHero />
            {/*<Flex
                mt="12"
                borderBottomWidth={2}
                borderBottomColor="gray.100"
                pb="24"
                display={{ base: 'block', lg: 'flex' }}
            >
                <HomePools flex="2" mr={{ base: '0', lg: '6', xl: '12' }} />
                <HomeNews flex="1" />
            </Flex>*/}

            <Grid
                templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }}
                columnGap={{ base: '0', lg: '12' }}
                rowGap="12"
                mt="20"
                borderBottomWidth={2}
                borderBottomColor="gray.100"
                pb="24"
            >
                <GridItem colSpan={2}>
                    <HomePools />
                </GridItem>
                <GridItem>
                    <HomeNews />
                </GridItem>
            </Grid>

            <Grid
                templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }}
                columnGap={{ base: '0', lg: '12' }}
                rowGap="12"
                mt="20"
                borderBottomWidth={2}
                borderBottomColor="gray.100"
                pb="24"
            >
                <GridItem colSpan={2}>
                    <HomeWhyUs />
                </GridItem>
                <GridItem>
                    <HomeBeetsInfo />
                </GridItem>
            </Grid>
            <Box mt="20">
                <HomeLearn />
            </Box>

            {/*<HomeSocialCarousel />*/}
            {/* <HomeMyInvestmentPools />
            <HomePoolCategories />*/}
        </Box>
    );
}
