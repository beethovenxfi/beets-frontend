import { Box, Button, Flex, HStack, Link, Text, useTheme } from '@chakra-ui/react';

import { NextLink } from '~/components/link/NextLink';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function HomeHero() {
    const theme = useTheme();
    const { chainId } = useNetworkConfig();

    return (
        <Flex
            height={{ base: 'auto', lg: 'xl' }}
            mx={{ base: `-${theme.space['4']}`, xl: `-${theme.space['8']}` }}
            overflow="hidden"
            minHeight="400px"
            backgroundImage={{
                base:
                    chainId === '10'
                        ? "url('/images/hero-image-optimism-mobile.png')"
                        : "url('/images/hero-image-fantom-mobile.png')",
                md:
                    chainId === '10'
                        ? "url('/images/hero-image-optimism.jpg')"
                        : "url('/images/hero-image-fantom.jpg')",
            }}
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
            boxShadow="0px 0px 24px 0px rgba(0,0,0,0.25);"
        >
            <Flex flex="1" mt="20" pl={{ base: '4', xl: '8' }} mb="12" alignItems="center">
                <Flex flexDirection="column" width={{ base: 'auto', lg: '580px' }}>
                    <Text
                        as="h1"
                        textStyle={{ base: 'h2', lg: 'h1' }}
                        textTransform="uppercase"
                        color="white"
                        fontWeight="semibold"
                    >
                        Welcome to
                        <br />
                        Beethoven X
                    </Text>
                    <Text
                        color="white"
                        as="h5"
                        textStyle={{ base: undefined, lg: 'h5' }}
                        fontSize={{ base: 'lg', lg: undefined }}
                        my={{ base: '6', lg: '10' }}
                        mr="8"
                    >
                        The future of DeFi re-imagineered. Your next generation Decentralised Exchange.
                    </Text>

                    <HStack spacing="4" mb={{ base: '6', lg: '10' }}>
                        <NextLink href="/pools" chakraProps={{ _hover: { textDecoration: 'none' } }}>
                            <Button variant="primary" width={{ base: '130px', lg: '160px' }}>
                                Invest
                            </Button>
                        </NextLink>
                        <NextLink href="/swap" chakraProps={{ _hover: { textDecoration: 'none' } }}>
                            <Button width={{ base: '130px', lg: '160px' }} variant="secondary">
                                Swap
                            </Button>
                        </NextLink>
                    </HStack>
                    {/*<Link color="beets.highlight" alignSelf="flex-start">
                        {"I'm new! Help me get started."}
                    </Link>*/}
                </Flex>
            </Flex>
            <Box flex="1" display={{ base: 'none', md: 'block' }} />
        </Flex>
    );
}
