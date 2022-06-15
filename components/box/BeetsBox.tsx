import { Box, BoxProps } from '@chakra-ui/react';

interface Props extends BoxProps {}

export function BeetsBox({ children, ...rest }: Props) {
    return (
        <Box bgColor="box.500" rounded="md" {...rest}>
            {children}
        </Box>
    );
}
