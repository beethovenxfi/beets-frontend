import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from '@chakra-ui/modal';
import { ModalOverlay, useBoolean, HStack, Box, Heading, VStack, Text, Flex } from '@chakra-ui/react';
import numeral from 'numeral';
import BeetsButton from '~/components/button/Button';
import Card from '~/components/card/Card';
import TokenInput from '~/components/inputs/TokenInput';

interface Props {}

export default function PoolInvestModal(props: Props) {
    const [isVisible, setIsVisible] = useBoolean();
    return (
        <>
            <BeetsButton onClick={() => setIsVisible.on()}>Add liquidity</BeetsButton>
            <Modal isOpen={isVisible} onClose={() => setIsVisible.off()} size="3xl">
                <ModalOverlay />
                <ModalContent backgroundColor="black">
                    <ModalCloseButton />
                    <ModalBody className="bg" padding="0">
                        <HStack height='450px' padding="4" width="full" backgroundColor="whiteAlpha.100">
                            <Flex width='50%'>
                                <VStack width='full' alignItems='flex-start'>
                                    <VStack spacing="none" alignItems="flex-start">
                                        <Heading size="md">You want to invest</Heading>
                                        <Text fontSize="2em">{numeral('0.00').format('$0,0.00a')}</Text>
                                    </VStack>
                                    <VStack width='full'>
                                        <TokenInput address='' />
                                        <TokenInput address='' />
                                    </VStack>
                                    <BeetsButton isFullWidth>Invest</BeetsButton>
                                </VStack>
                            </Flex>
                            <Flex height='full' width='50%' rounded="lg" backgroundColor='whiteAlpha.300'>

                            </Flex>
                        </HStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
