import { Box, BoxProps } from '@chakra-ui/layout';
import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';
import { BeetsBox } from '../box/BeetsBox';

interface Props {
    value: number;
    children?: ReactNode | ReactNode[];
}

export default function AnimatedProgress({ value, children, ...rest }: Props & BoxProps) {
    return (
        <BeetsBox position="relative" minWidth="100px" height="12.5px" rounded="md" overflow="hidden" {...rest}>
            <Box
                position="absolute"
                left="0"
                width="100%"
                transformOrigin="left"
                initial={{ transform: `scaleX(0)` }}
                animate={{ transform: `scaleX(${value / 100})`, transition: { delay: 0.5, duration: 2 } }}
                bgColor="beets.highlight"
                as={motion.div}
                height="full"
                zIndex={-1}
            />
            <Box zIndex={3} px="2">
                {children}
            </Box>
        </BeetsBox>
    );
}
