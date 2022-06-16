import { Box, Flex, HStack, Text, useTheme } from '@chakra-ui/react';
import BeetsButton from '~/components/button/Button';

export function HomeHero() {
    const theme = useTheme();

    return (
        <Flex
            height="xl"
            mx={{ base: `-${theme.space['4']}`, xl: `-${theme.space['8']}` }}
            overflow="hidden"
            minHeight="400px"
            backgroundImage="url('/images/hero-image-fantom.png')"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
            boxShadow="0px 0px 24px 0px rgba(0,0,0,0.25);"
        >
            <Flex flex="1" alignItems="center" flexDirection="column" mt="20">
                <Text as="h1" textStyle="h1" textTransform="uppercase" color="beets.green">
                    Welcome to
                    <br />
                    Beethoven X
                </Text>
                <Text color="white" fontSize="lg" mt="6">
                    Why just listen to the music when you
                    <br />
                    can create it? We are Next-Gen DeFi.
                </Text>
                <Text color="beets.green" fontWeight="bold" fontSize="lg" mb="8">
                    An AMM re-imagineered for everyone.
                </Text>
                <HStack spacing="4">
                    <BeetsButton>Invest now</BeetsButton>
                    <BeetsButton>Getting started</BeetsButton>
                </HStack>
            </Flex>
            <Box flex="1" />
        </Flex>
    );
}
