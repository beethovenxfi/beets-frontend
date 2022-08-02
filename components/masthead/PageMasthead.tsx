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
            borderBottomColor="beets.base.500"
            mb={{ base: '6', lg: '8' }}
            alignItems="flex-end"
        >
            <Text fontSize="28px" fontWeight="semibold" as="h1" flex="1" mb="2">
                {title}
            </Text>
            <Box alignItems="flex-end" display={{ base: 'none', md: 'flex' }}>
                {image}
            </Box>
        </Flex>
    );
}
