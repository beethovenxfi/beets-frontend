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
import { FlexProps, Text } from '@chakra-ui/react';

type Props = {
    title?: string;
    children?: ReactNode | ReactNode[];
    onClose?: () => void;
    topRight?: ReactNode | ReactNode[];
    titleProps?: FlexProps;
};

export default function Card({
    onClose,
    title,
    children,
    animate,
    initial,
    exit,
    topRight,
    titleProps,
    ...boxProps
}: Props & BoxProps & MotionProps) {
    const TitleSection = useMemo(
        () => (
            <Flex
                justifyContent="space-between"
                width="full"
                padding="4"
                alignItems="center"
                position="relative"
                {...titleProps}
            >
                <Text fontWeight="semibold" fontSize="xl" color="beets.base.50">
                    {title}
                </Text>
                {onClose && (
                    <Button
                        position="absolute"
                        height="fit-content"
                        onClick={onClose}
                        borderRadius="full"
                        variant="ghost"
                        color="gray.200"
                        _hover={{ color: 'beets.red.300' }}
                        _active={{ backgroundColor: 'gray.300' }}
                        _focus={{ outline: 'none' }}
                        padding="2"
                        right=".5rem"
                    >
                        <X size={24} />
                    </Button>
                )}
                {topRight}
            </Flex>
        ),
        [title, onClose, topRight],
    );
    return (
        <AnimatedBox
            animate={animate}
            initial={initial}
            exit={exit}
            rounded="lg"
            backgroundColor="box.500"
            display="flex"
            flexDirection="column"
            boxShadow="0px 0px 0px 1px #00000005,1px 1px 1px -0.5px #0000000F,3px 3px 3px -1.5px #0000000F,6px 6px 6px -3px #0000000F,12px 12px 12px -6px #0000000F,24px 24px 24px -12px #0000001A,-0.5px -1px 0px 0px #FFFFFF26"
            {...(boxProps as any)}
        >
            {title && TitleSection}
            {children}
        </AnimatedBox>
    );
}
