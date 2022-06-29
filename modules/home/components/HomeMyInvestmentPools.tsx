import { Box, Flex } from '@chakra-ui/react';
import { PoolCard } from '~/components/pool-card/PoolCard';
import { PoolCardCarousel } from '~/components/carousel/PoolCardCarousel';

export function HomeMyInvestmentPools() {
    return (
        <Box py="12">
            <Box mb="2" fontSize="2xl" fontWeight="bold">
                My investment pools
            </Box>
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
    );
}
