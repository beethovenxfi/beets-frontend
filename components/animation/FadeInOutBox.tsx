import { Box, BoxProps } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props extends BoxProps {
    isVisible: boolean;
}

export function FadeInOutBox({ children, isVisible, ...rest }: Props) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}>
                    <Box {...rest}>{children}</Box>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
