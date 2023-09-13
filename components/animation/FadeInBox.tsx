import { Box, BoxProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface Props extends BoxProps {
    isVisible: boolean;
    minHeight?: string;
}

export function FadeInBox({ children, isVisible, minHeight, ...rest }: Props) {
    return (
        <>
            {isVisible && (
                <motion.div
                    animate={{ opacity: 1, transition: { delay: 0.25 } }}
                    initial={{ opacity: 0 }}
                    style={{ width: '100%', minHeight: minHeight || undefined }}
                    exit={{ opacity: 0 }}
                >
                    <Box {...rest}>{children}</Box>
                </motion.div>
            )}
        </>
    );
}
