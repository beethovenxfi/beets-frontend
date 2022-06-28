import { Box, Flex } from '@chakra-ui/react';
import { HomeHero } from '~/modules/home/components/HomeHero';
import { HomePools } from '~/modules/home/components/HomePools';
import { HomeNews } from '~/modules/home/components/HomeNews';
import { HomeWhyUs } from '~/modules/home/components/HomeWhyUs';
import { HomeBeetsInfo } from '~/modules/home/components/HomeBeetsInfo';

export function Home() {
    return (
        <Box>
            <HomeHero />
            <Flex mt="8">
                <HomePools flex="2" mr="8" />
                <HomeNews flex="1" />
            </Flex>
            <Flex mt="20">
                <HomeWhyUs flex="2" mr="8" />
                <HomeBeetsInfo flex="1" />
            </Flex>

            {/*<HomeSocialCarousel />*/}
            {/* <HomeMyInvestmentPools />
            <HomePoolCategories />*/}
        </Box>
    );
}
