import { ModalBody, ModalBodyProps, ModalContent, ModalContentProps, ModalHeaderProps } from '@chakra-ui/modal';
import { Heading, ModalHeader, Text, TextProps } from '@chakra-ui/react';
import { Box, HeadingProps } from '@chakra-ui/layout';
import { forwardRef, Ref } from 'react';
import { MotionProps } from 'framer-motion';

export const BeetsModalContent = forwardRef(
    (props: ModalContentProps & MotionProps & { transparent?: boolean }, ref: Ref<HTMLDivElement>) => {
        let containerBg = props.transparent ? 'transparent' : 'blackAlpha.400';
        let innerBg = props.transparent ? '' : 'bg';
        return (
            <ModalContent ref={ref} {...props} background='none'>
                <Box bg={containerBg}>
                    <Box className={innerBg}>{props.children}</Box>
                </Box>
            </ModalContent>
        );
    },
);
BeetsModalContent.displayName = 'BeetsModalContent';

export function BeetsModalHeader(props: ModalHeaderProps) {
    return <ModalHeader px="4" {...props} />;
}

export function BeetsModalBody(props: ModalBodyProps) {
    return <ModalBody px="4" pb="6" {...props} />;
}

export function BeetsModalHeadline(props: HeadingProps) {
    return <Heading size="md" {...props} />;
}

export function BeetsModalSubHeadline(props: TextProps) {
    return <Text color="gray.200" fontSize="md" {...props} />;
}
