import { Box, BoxProps } from '@chakra-ui/layout';
import { motion } from 'framer-motion';
import React from 'react';
import { BeetsBox } from '../box/BeetsBox';

interface Props {
    value: number;
}

export default function AnimatedProgress({ value, ...rest }: Props & BoxProps) {
    return (
        <BeetsBox zIndex='docked' borderRadius='2px' minWidth="100px" height="15px" overflow="hidden" {...rest}>
            <Box
                initial={{ width: '0px' }}
                animate={{ width: '100%', transition: { delay: 1, duration: 3 } }}
                bgColor="orange.400"
                as={motion.div}
                height="full"
            />
        </BeetsBox>
    );
}
