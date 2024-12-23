import { Modal, ModalBody, ModalCloseButton, ModalContent } from '@chakra-ui/modal';
import { Button, ButtonProps, Heading, ModalHeader, ModalOverlay, useDisclosure, Box, Text } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { FadeInBox } from '~/components/animation/FadeInBox';
import { ReliquaryWithdrawTypeChoice } from '~/modules/reliquary/withdraw/components/ReliquaryWithdrawTypeChoice';
import { useReliquaryWithdrawState } from '~/modules/reliquary/withdraw/lib/useReliquaryWithdrawState';
import useReliquary from '../lib/useReliquary';
import { ReliquarySonicMigrateBridgeBeets } from './components/ReliquarySonicMigrateBridgeBeets';
import { ReliquarySonicMigrateNextSteps } from './components/ReliquarySonicMigrateNextSteps';
import { ReliquarySonicMigrateBridgeFtm } from './components/ReliquarySonicMigrateBridgeFtm';
import { ReliquarySonicMigrateUnwrapFtm } from './components/ReliquarySonicMigrateUnwrapFtm';
import { ReliquarySonicMigrateExitRelics } from './components/ReliquarySonicMigrateExitRelics';
import { CurrentStepProvider } from '../lib/useReliquaryCurrentStep';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}
export function ReliquarySonicMigrateModal({ isOpen, onClose }: Props) {
    const initialRef = useRef(null);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl" initialFocusRef={initialRef}>
            <ModalOverlay />
            <ModalContent backgroundColor="black">
                <ModalCloseButton />
                <ModalHeader className="bg">
                    <Heading size="md" noOfLines={1}>
                        Upgrade to Sonic
                    </Heading>
                </ModalHeader>
                <ModalBody className="bg" p="0">
                    <FadeInBox isVisible={true}>
                        <Box px="6" pb="6">
                            <Text mb="6">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a turpis lacinia,
                                pellentesque metus a, sollicitudin mi. Ut non velit euismod, consectetur orci at,
                                condimentum metus.{' '}
                            </Text>
                            <CurrentStepProvider>
                                <Box pb="8">
                                    <ReliquarySonicMigrateExitRelics />
                                </Box>
                            </CurrentStepProvider>
                            <Box pb="8">
                                <ReliquarySonicMigrateUnwrapFtm />
                            </Box>
                            <Box pb="8">
                                <ReliquarySonicMigrateBridgeBeets />
                            </Box>
                            <Box pb="6">
                                <ReliquarySonicMigrateBridgeFtm />
                            </Box>
                            <ReliquarySonicMigrateNextSteps />
                        </Box>
                    </FadeInBox>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
