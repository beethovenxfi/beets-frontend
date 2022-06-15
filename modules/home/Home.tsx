import { Box } from '@chakra-ui/react';
import { HomeHero } from '~/modules/home/components/HomeHero';
import { HomeSocialCarousel } from '~/modules/home/components/HomeSocialCarousel';

export function Home() {
    return (
        <Box>
            <HomeHero />
            <HomeSocialCarousel />
        </Box>
    );
}
