import { Box, BoxProps } from '@chakra-ui/react';

interface Props extends BoxProps {}

export function BeetsBox({ children, ...rest }: Props) {
    return (
        <Box bgColor="rgba(255,255,255,0.05)" rounded="md" {...rest}>
            {children}
        </Box>
    );
}
