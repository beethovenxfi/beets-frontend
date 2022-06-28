import { Box, BoxProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Props extends BoxProps {
    children: ReactNode;
}

export function BeetsHeadline({ children, ...rest }: Props) {
    return (
        <Box fontSize="4xl" fontWeight="bold" color="beets.cyan" {...rest}>
            {children}
        </Box>
    );
}
