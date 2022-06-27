import { Box } from '@chakra-ui/react';
import { HomeHero } from '~/modules/home/components/HomeHero';
import { HomeSocialCarousel } from '~/modules/home/components/HomeSocialCarousel';
import { HomeFeaturedPools } from '~/modules/home/components/HomeFeaturedPools';
import { HomePoolCategories } from '~/modules/home/components/HomePoolCategories';

export function Home() {
    return (
        <Box>
            <HomeHero />
            {/*<HomeSocialCarousel />*/}
            <HomeFeaturedPools />
            <HomePoolCategories />
        </Box>
    );
}
