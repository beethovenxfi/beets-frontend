import { Button } from '@chakra-ui/button';
import { Box, BoxProps, Flex, Heading } from '@chakra-ui/layout';
import { chakra } from '@chakra-ui/system';
import {
    AnimationControls,
    isValidMotionProp,
    motion,
    MotionProps,
    Target,
    TargetAndTransition,
    VariantLabels,
} from 'framer-motion';
import { ReactNode, useMemo } from 'react';
import { X } from 'react-feather';
import { AnimatedBox } from '../animation/chakra';

type Props = {
    title?: string;
    children?: ReactNode | ReactNode[];
    onClose?: () => void;
};

export default function Card({
    onClose,
    title,
    children,
    animate,
    initial,
    exit,
    ...boxProps
}: Props & BoxProps & MotionProps) {
    const TitleSection = useMemo(
        () => (
            <Flex
                justifyContent="space-between"
                borderBottom="1px"
                borderColor="beets.gray.400"
                width="full"
                padding="4"
                alignItems="center"
                position="relative"
            >
                <Heading color="beets.gray.100" fontWeight="semibold" size="sm">
                    {title}
                </Heading>
                {onClose && (
                    <Button
                        position="absolute"
                        height="fit-content"
                        onClick={onClose}
                        borderRadius="full"
                        variant="ghost"
                        color="beets.gray.200"
                        _hover={{ color: 'beets.red.300' }}
                        _active={{ backgroundColor: 'beets.gray.300' }}
                        _focus={{ outline: 'none' }}
                        padding="2"
                        right=".5rem"
                    >
                        <X size={24} />
                    </Button>
                )}
            </Flex>
        ),
        [title, onClose],
    );
    return (
        <AnimatedBox
            {...(boxProps as any)}
            animate={animate}
            initial={initial}
            exit={exit}
            borderColor="beets.green.800"
            width="full"
            height="full"
            rounded="3xl"
            backgroundColor="beets.base.light.alpha.200"
            display="flex"
            flexDirection="column"
        >
            {title && TitleSection}
            {children}
        </AnimatedBox>
    );
}
