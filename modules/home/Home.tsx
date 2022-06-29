import { Box, Flex } from '@chakra-ui/react';
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
            <Flex
                mt="12"
                borderBottomWidth={2}
                borderBottomColor="gray.100"
                pb="24"
                display={{ base: 'block', lg: 'flex' }}
            >
                <HomePools flex="2" mr={{ base: '0', lg: '6', xl: '12' }} />
                <HomeNews flex="1" />
            </Flex>
            <Flex mt="20" borderBottomWidth={2} borderBottomColor="gray.100" pb="24">
                <HomeWhyUs flex="2" mr="12" />
                <HomeBeetsInfo flex="1" />
            </Flex>
            <Box mt="20">
                <HomeLearn />
            </Box>

            {/*<HomeSocialCarousel />*/}
            {/* <HomeMyInvestmentPools />
            <HomePoolCategories />*/}
        </Box>
    );
}
