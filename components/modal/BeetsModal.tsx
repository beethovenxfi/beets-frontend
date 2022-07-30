import { ModalBody, ModalBodyProps, ModalContent, ModalContentProps, ModalHeaderProps } from '@chakra-ui/modal';
import { Heading, ModalHeader, Text, TextProps } from '@chakra-ui/react';
import { HeadingProps } from '@chakra-ui/layout';

export function BeetsModalContent(props: ModalContentProps) {
    return <ModalContent backgroundColor="black" {...props} />;
}

export function BeetsModalHeader(props: ModalHeaderProps) {
    return <ModalHeader className="bg" {...props} />;
}

export function BeetsModalBody(props: ModalBodyProps) {
    return <ModalBody className="bg" pb="6" {...props} />;
}

export function BeetsModalHeadline(props: HeadingProps) {
    return <Heading size="md" {...props} />;
}

export function BeetsModalSubHeadline(props: TextProps) {
    return <Text color="gray.200" fontSize="md" {...props} />;
}
