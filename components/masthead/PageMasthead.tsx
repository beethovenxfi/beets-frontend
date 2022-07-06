import { Box, Flex, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Props {
    title: string;
    image: ReactNode;
}

export function PageMasthead({ title, image }: Props) {
    return (
        <Flex
            borderBottomWidth={5}
            borderBottomColor="beets.base.400"
            mb={{ base: '8', lg: '16' }}
            alignItems="flex-end"
        >
            <Text fontSize="4xl" fontWeight="bold" as="h1" flex="1" mb="4">
                {title}
            </Text>
            <Box alignItems="flex-end" display={{ base: 'none', md: 'flex' }}>
                {image}
            </Box>
        </Flex>
    );
}
