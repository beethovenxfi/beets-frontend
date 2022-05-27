import {
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Modal,
} from '@chakra-ui/modal';
import { useDisclosure } from '@chakra-ui/hooks';
import { Button } from '@chakra-ui/react';

export function AprBreakdownModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Button onClick={onOpen}>Open Modal</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In dapibus vehicula lacus in aliquet.
                        Nam mattis, ligula nec mattis viverra, lacus orci luctus sem, vel lacinia nisi tellus et velit.
                        Nam dapibus lacinia turpis, sed lacinia elit iaculis vel. Donec nec tortor eu diam scelerisque
                        auctor. Curabitur luctus, dui in congue congue, metus nulla accumsan magna, sed blandit dui ante
                        sed magna. Suspendisse rhoncus tempus scelerisque. Sed at lectus non libero consequat semper. Ut
                        non nunc ac turpis accumsan tincidunt ut at turpis. Sed a suscipit nisl. Duis congue a nisi eu
                        cursus.
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant="ghost">Secondary Action</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
