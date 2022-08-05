import { Box, BoxProps } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props extends BoxProps {
    isVisible: boolean;
    containerWidth?: string;
}

export function FadeInOutBox({ children, isVisible, containerWidth, ...rest }: Props) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    style={{ width: containerWidth }}
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                >
                    <Box {...rest}>{children}</Box>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
