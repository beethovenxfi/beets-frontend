import { Box, Flex, HStack, Link, Text, useTheme } from '@chakra-ui/react';
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
            <Flex flex="1" mt="20" justifyContent="center">
                <Flex flexDirection="column" width="440px">
                    <Text as="h1" textStyle="h1" textTransform="uppercase" color="white" fontWeight="semibold">
                        Welcome to
                        <br />
                        Beethoven X
                    </Text>
                    <Text color="white" as="h5" textStyle="h5" mt="10" mb="10">
                        Built for traders, investors and protocols, we are your complete automated portfolio manager and
                        trading solution.
                    </Text>

                    <HStack spacing="4" mb="10">
                        <BeetsButton width="160px">Invest</BeetsButton>
                        <BeetsButton width="160px" buttonType="secondary">
                            Swap
                        </BeetsButton>
                    </HStack>
                    <Link color="beets.cyan" display="inline">
                        {"I'm new! Help me get started."}
                    </Link>
                </Flex>
            </Flex>
            <Box flex="1" />
        </Flex>
    );
}
