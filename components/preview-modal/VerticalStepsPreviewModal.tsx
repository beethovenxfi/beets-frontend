import {
    Alert,
    AlertIcon,
    Box,
    BoxProps,
    Circle,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    useTheme,
} from '@chakra-ui/react';
import BeetsButton from '~/components/button/Button';
import { ReactNode } from 'react';
import { Check } from 'react-feather';
import {
    BeetsSubmitTransactionButton,
    BeetsSubmitTransactionButtonProps,
} from '~/components/button/BeetsSubmitTransactionButton';

interface Props extends BoxProps {
    onModalClose: () => void;
    onModalOpen: () => void;
    showModalButton: {
        text: string;
        disabled?: boolean;
    };
    header: ReactNode;
    button: BeetsSubmitTransactionButtonProps;
    error?: { message: string };
    steps: {
        text: string;
        complete?: boolean;
    }[];
}

export function VerticalStepsPreviewModal({
    onModalOpen,
    onModalClose,
    showModalButton,
    header,
    error,
    button,
    steps,
    ...rest
}: Props) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const theme = useTheme();

    return (
        <Box {...rest}>
            <BeetsButton
                onClick={() => {
                    onModalOpen();
                    onOpen();
                }}
                width="full"
                disabled={showModalButton.disabled}
            >
                {showModalButton.text}
            </BeetsButton>

            <Modal
                isOpen={isOpen}
                onClose={() => {
                    onClose();
                    onModalClose();
                }}
                isCentered
            >
                <ModalOverlay />
                <ModalContent bgColor="beets.base.700">
                    <ModalHeader>{header}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody p={0}>
                        <Box px={6} pt={4} pb={4}>
                            <Text mb={4}>Requires {steps.length} transactions:</Text>
                            {steps.map((step, index) => (
                                <HStack
                                    key={index}
                                    borderWidth={1}
                                    borderColor="beets.gray.400"
                                    p={3}
                                    borderRadius="md"
                                    mb={4}
                                >
                                    <Circle
                                        borderColor={step.complete ? 'beets.green.500' : 'beets.gray.400'}
                                        borderWidth={1}
                                        size="36px"
                                    >
                                        {step.complete ? <Check color={theme.colors.beets.green['500']} /> : index + 1}
                                    </Circle>
                                    <Text fontSize="lg">{step.text}</Text>
                                </HStack>
                            ))}
                        </Box>
                    </ModalBody>

                    <ModalFooter flexDirection="column">
                        <BeetsSubmitTransactionButton width="full" {...button} />
                        {error ? (
                            <Alert status="error" mt={4}>
                                <AlertIcon />
                                An error occurred: {error.message}
                            </Alert>
                        ) : null}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}
