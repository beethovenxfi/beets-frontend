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
import { BeetsBox } from '../box/BeetsBox';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

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
    const { protocol } = useNetworkConfig();
    const cardVariant = protocol === 'balancer' ? 'elevated' : 'normal';

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
        <BeetsBox
            animate={animate}
            initial={initial}
            exit={exit}
            variant={cardVariant}
            rounded="lg"
            // TODO BALANCER RESKIN
            // border="1px"
            // borderColor="blackAlpha.400"
            display="flex"
            flexDirection="column"
            {...(boxProps as any)}
        >
            {title && TitleSection}
            {children}
        </BeetsBox>
    );
}
