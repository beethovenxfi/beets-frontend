import { Box, BoxProps } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { CSSObject } from '@chakra-ui/styled-system/src/system.types';

interface Props extends BoxProps {
    isVisible: boolean;
    containerStyle?: Object;
}

export function FadeInOutBox({ children, isVisible, containerStyle, ...rest }: Props) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    style={containerStyle}
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
