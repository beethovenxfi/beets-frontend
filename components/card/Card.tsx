import { Box, BoxProps, Heading } from '@chakra-ui/layout';
import { chakra } from '@chakra-ui/system';
import {
    AnimationControls,
    isValidMotionProp,
    motion,
    Target,
    TargetAndTransition,
    VariantLabels,
} from 'framer-motion';
import { ReactElement } from 'react';

type Props = {
    title?: string;
    children?: ReactElement | ReactElement[];
    animate?: AnimationControls | TargetAndTransition | VariantLabels | boolean;
    initial?: boolean | Target | VariantLabels;
    exit?: TargetAndTransition | VariantLabels;
};

const ChakraBox = chakra(motion.div, {
    shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === 'children',
});

export default function Card({ title, children, animate, initial, exit, ...boxProps }: Props & BoxProps) {
    return (
        <ChakraBox
            {...boxProps as any}
            animate={animate}
            initial={initial}
            exit={exit}
            bg="beets.gray.500"
            borderColor="beets.green.800"
            width="full"
            height="full"
            rounded="3xl"
            backgroundColor="beets.gray.500"
        >
            {title && (
                <Box borderBottom="1px" borderColor="beets.gray.400" width="full" padding="4">
                    <Heading color="beets.gray.100" fontWeight="semibold" size="sm">
                        Market Swap
                    </Heading>
                </Box>
            )}
            {children}
        </ChakraBox>
    );
}
