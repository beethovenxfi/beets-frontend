import { ModalBody, ModalBodyProps, ModalContent, ModalContentProps, ModalHeaderProps } from '@chakra-ui/modal';
import { Heading, ModalHeader, Text, TextProps } from '@chakra-ui/react';
import { Box, HeadingProps } from '@chakra-ui/layout';

export function BeetsModalContent(props: ModalContentProps) {
    return (
        <ModalContent {...props}>
            <Box bg="blackAlpha.400">
                <Box className="bg">{props.children}</Box>
            </Box>
        </ModalContent>
    );
}

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
