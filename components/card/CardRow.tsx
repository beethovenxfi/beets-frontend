import { Box, Flex, FlexProps } from '@chakra-ui/react';

export function CardRow(props: FlexProps) {
    return <Flex bg="whiteAlpha.100" p="2" mb="1" borderRadius="md" {...props} />;
}
