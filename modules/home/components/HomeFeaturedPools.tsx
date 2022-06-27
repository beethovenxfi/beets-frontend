import { Box, Flex } from '@chakra-ui/react';
import { PoolCard } from '~/components/pool-card/PoolCard';
import { Carousel } from '~/components/carousel/Carousel';

export function HomeFeaturedPools() {
    return (
        <Box py="12">
            <Box mb="2" fontSize="2xl" fontWeight="bold">
                Featured pools
            </Box>
            <Carousel
                items={[
                    <PoolCard
                        key="1"
                        image="https://cdn.sanity.io/images/1g2ag2hb/production/fa839196871bffbd2c54e5017018e86dc7e5900a-2800x1600.png?w=600"
                    />,
                    <PoolCard
                        key="2"
                        image="https://cdn.sanity.io/images/1g2ag2hb/production/fa839196871bffbd2c54e5017018e86dc7e5900a-2800x1600.png?w=600"
                    />,
                    <PoolCard
                        key="3"
                        image="https://cdn.sanity.io/images/1g2ag2hb/production/fa839196871bffbd2c54e5017018e86dc7e5900a-2800x1600.png?w=600"
                    />,
                    <PoolCard
                        key="4"
                        image="https://cdn.sanity.io/images/1g2ag2hb/production/fa839196871bffbd2c54e5017018e86dc7e5900a-2800x1600.png?w=600"
                    />,
                    <PoolCard
                        key="5"
                        image="https://cdn.sanity.io/images/1g2ag2hb/production/fa839196871bffbd2c54e5017018e86dc7e5900a-2800x1600.png?w=600"
                    />,
                    <PoolCard
                        key="6"
                        image="https://cdn.sanity.io/images/1g2ag2hb/production/fa839196871bffbd2c54e5017018e86dc7e5900a-2800x1600.png?w=600"
                    />,
                    <PoolCard
                        key="7"
                        image="https://cdn.sanity.io/images/1g2ag2hb/production/fa839196871bffbd2c54e5017018e86dc7e5900a-2800x1600.png?w=600"
                    />,
                    <PoolCard
                        key="8"
                        image="https://cdn.sanity.io/images/1g2ag2hb/production/fa839196871bffbd2c54e5017018e86dc7e5900a-2800x1600.png?w=600"
                    />,
                ]}
            />
        </Box>
    );
}
