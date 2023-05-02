import { Box, BoxProps, useStyleConfig } from '@chakra-ui/react';

interface Props extends BoxProps {
    variant?: 'normal' | 'elevated' | 'subsection';
}

export function BeetsBox({ variant = 'normal', children, ...rest }: Props) {
    const styles = useStyleConfig('BeetsBox', { variant });

    return (
        <Box {...rest} __css={styles}>
            {children}
        </Box>
    );
}
