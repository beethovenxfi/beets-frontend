import { Box, Flex } from '@chakra-ui/react';
import { HomeHero } from '~/modules/home/components/HomeHero';
import { HomePools } from '~/modules/home/components/HomePools';
import { HomeNews } from '~/modules/home/components/HomeNews';
import { HomeWhyUs } from '~/modules/home/components/HomeWhyUs';
import { HomeBeetsInfo } from '~/modules/home/components/HomeBeetsInfo';
import { HomeLearn } from '~/modules/home/components/HomeLearn';

export function Home() {
    return (
        <Box>
            <HomeHero />
            <Flex mt="12" borderBottomWidth={2} borderBottomColor="gray.100" pb="24">
                <HomePools flex="2" mr="12" />
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
