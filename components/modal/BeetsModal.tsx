import { ModalBody, ModalBodyProps, ModalContent, ModalContentProps, ModalHeaderProps } from '@chakra-ui/modal';
import { Heading, ModalHeader, Text, TextProps } from '@chakra-ui/react';
import { Box, Container, HeadingProps } from '@chakra-ui/layout';
import { MouseEventHandler, ReactNode } from 'react';
import { Portal } from 'react-portal';

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

interface BeetsModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode | ReactNode[];
    width?: string;
    title?: string;
}

export function BeetsModal({ title, isOpen, onClose, width, children }: BeetsModalProps) {
    if (!isOpen) return null;

    const prevent = (event: any) => {
        event.stopPropagation();
    };
    return (
        <Portal>
            {/* overlay */}
            <Container
                maxW="full"
                padding="0"
                margin="0"
                left="0"
                top="0"
                right="0"
                height="full"
                width="full"
                position="fixed"
                bg="blackAlpha.800"
                zIndex="modal"
                onClick={onClose}
            >
                <Box
                    onClick={prevent}
                    width={width}
                    bg="rgba(8,4,31)"
                    left="0"
                    right="0"
                    margin="auto"
                    position="absolute"
                    top="25%"
                    rounded="lg"
                >
                    <Box className="bg" padding="4">
                        <Box marginBottom="4">
                            <Heading size="md">{title}</Heading>
                        </Box>
                        <Box>{children}</Box>
                    </Box>
                </Box>
            </Container>
        </Portal>
    );
}
