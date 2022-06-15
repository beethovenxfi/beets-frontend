import { Flex, Heading, Text } from '@chakra-ui/react';

export function HomeHero() {
    return (
        <Flex
            alignItems="center"
            justifyContent="center"
            height="xl"
            borderColor="gray.600"
            borderWidth={1}
            borderRadius="md"
        >
            <Text textStyle="h1">HERO</Text>
        </Flex>
    );
}
