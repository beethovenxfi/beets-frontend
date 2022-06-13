import { Box, Flex, Text, BoxProps } from '@chakra-ui/react';

export function BeetsBoxHeader(props: BoxProps) {
    return (
        <Flex
            px={4}
            py={4}
            borderTopLeftRadius="md"
            borderTopRightRadius="md"
            alignItems={'center'}
            bgColor="beets.lightAlpha.200"
            {...props}
        />
    );
}
