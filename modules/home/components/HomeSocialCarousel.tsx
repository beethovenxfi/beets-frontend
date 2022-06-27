import { Box, Flex } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';

export function HomeSocialCarousel() {
    return (
        <Flex height="60px" alignItems="flex-end">
            <BeetsBox
                height="120px"
                p="4"
                flex="1"
                mr="4"
                bgColor="beets.base.800"
                shadow="lg"
                display="flex"
                flexDirection="column"
            >
                <Box color="gray.200" flex="1">
                    TVL
                </Box>
                <Box fontSize="3xl">78.9m</Box>
            </BeetsBox>
            <BeetsBox
                height="120px"
                p="4"
                flex="1"
                mr="4"
                bgColor="beets.base.800"
                shadow="lg"
                display="flex"
                flexDirection="column"
            >
                <Box color="gray.200" flex="1">
                    Volume (24h)
                </Box>
                <Box fontSize="3xl">78.9m</Box>
            </BeetsBox>
            <BeetsBox
                height="120px"
                p="4"
                flex="1"
                mr="4"
                bgColor="beets.base.600"
                shadow="lg"
                display="flex"
                flexDirection="column"
            >
                <Box color="gray.200" flex="1">
                    Fees (24h)
                </Box>
                <Box fontSize="3xl">78.9m</Box>
            </BeetsBox>
            <BeetsBox
                height="120px"
                p="4"
                flex="1"
                mr="4"
                bgColor="beets.base.800"
                shadow="lg"
                display="flex"
                flexDirection="column"
            >
                <Box color="gray.200" flex="1">
                    Liquidity providers
                </Box>
                <Box fontSize="3xl">11.2k</Box>
            </BeetsBox>
            <BeetsBox
                height="120px"
                p="4"
                flex="1"
                mr="4"
                bgColor="beets.base.800"
                shadow="lg"
                display="flex"
                flexDirection="column"
            >
                <Box color="gray.200" flex="1">
                    Investment pools
                </Box>
                <Box fontSize="3xl">1,322</Box>
            </BeetsBox>
            <BeetsBox
                height="120px"
                p="4"
                flex="1"
                mr="4"
                bgColor="beets.base.800"
                shadow="lg"
                display="flex"
                flexDirection="column"
            >
                <Box color="gray.200" flex="1">
                    Total liquidity
                </Box>
                <Box fontSize="3xl">$78.9m</Box>
            </BeetsBox>
        </Flex>
    );
}
