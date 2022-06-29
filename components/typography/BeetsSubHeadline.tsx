import { Box, BoxProps, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Props extends BoxProps {
    children: ReactNode;
}

export function BeetsSubHeadline({ children, ...rest }: Props) {
    return (
        <Box fontSize={{ base: 'xl', xl: '2xl' }} fontWeight="semibold" color="white" {...rest}>
            {children}
        </Box>
    );
}
