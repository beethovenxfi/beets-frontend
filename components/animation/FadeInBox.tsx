import { Box, BoxProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface Props extends BoxProps {
    isVisible: boolean;
}

export function FadeInBox({ children, isVisible, ...rest }: Props) {
    return (
        <>
            {isVisible && (
                <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} style={{ width: '100%'}}>
                    <Box {...rest}>{children}</Box>
                </motion.div>
            )}
        </>
    );
}
