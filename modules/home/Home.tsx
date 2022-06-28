import { Box, Flex } from '@chakra-ui/react';
import { HomeHero } from '~/modules/home/components/HomeHero';
import { HomeSocialCarousel } from '~/modules/home/components/HomeSocialCarousel';
import { HomeFeaturedPools } from '~/modules/home/components/HomeFeaturedPools';
import { HomePoolCategories } from '~/modules/home/components/HomePoolCategories';
import { HomeMyInvestmentPools } from '~/modules/home/components/HomeMyInvestmentPools';
import { HomePools } from '~/modules/home/components/HomePools';
import { HomeNews } from '~/modules/home/components/HomeNews';

export function Home() {
    return (
        <Box>
            <HomeHero />
            <Flex mt="8">
                <HomePools flex="2" mr="8" />
                <HomeNews flex="1" />
            </Flex>
            {/*<HomeSocialCarousel />*/}
            {/* <HomeMyInvestmentPools />
            <HomeFeaturedPools />
            <HomePoolCategories />*/}
        </Box>
    );
}
