import { Modal, ModalBody, ModalCloseButton, ModalContent } from '@chakra-ui/modal';
import { Button, Heading, IconButton, ModalHeader, ModalOverlay, Text, useDisclosure, Box } from '@chakra-ui/react';
import { PoolInvestProportional } from '~/modules/pool/invest/components/PoolInvestProportional';
import { ChevronLeft } from 'react-feather';
import { PoolInvestPreview } from '~/modules/pool/invest/components/PoolInvestPreview';
import { useEffect, useRef, useState } from 'react';
import { PoolInvestTypeChoice } from '~/modules/pool/invest/components/PoolInvestTypeChoice';
import { PoolInvestCustom } from '~/modules/pool/invest/components/PoolInvestCustom';
import { motion } from 'framer-motion';
import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';
import { usePool } from '~/modules/pool/lib/usePool';
import { BeetsModalBody, BeetsModalContent, BeetsModalHeader } from '~/components/modal/BeetsModal';

export function PoolInvestModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { pool, formattedTypeName } = usePool();
    const [modalState, setModalState] = useState<'start' | 'proportional' | 'custom' | 'preview'>('start');
    const [type, setInvestType] = useState<'proportional' | 'custom' | null>(null);
    const initialRef = useRef(null);
    const [investComplete, setInvestComplete] = useState(false);
    const { clearInvestState } = useInvestState();

    useEffect(() => {
        if (modalState !== 'start') {
            setModalState('start');
        }

        clearInvestState();
    }, [pool.id]);

    function onModalClose() {
        if (investComplete) {
            setModalState('start');
            setInvestType(null);
        }

        onClose();
    }

    return (
        <>
            <Box>
                <Button variant="primary" onClick={onOpen} width={{ base: 'full' }} mr="2">
                    Invest
                </Button>
            </Box>
            <Modal isOpen={isOpen} onClose={onModalClose} size="lg" initialFocusRef={initialRef}>
                <ModalOverlay bg="blackAlpha.900" />
                <BeetsModalContent>
                    <ModalCloseButton />
                    {modalState !== 'start' ? (
                        <IconButton
                            aria-label={'back-button'}
                            icon={<ChevronLeft />}
                            variant="ghost"
                            p="0"
                            width="32px"
                            height="32px"
                            minWidth="32px"
                            position="absolute"
                            top="12px"
                            left="12px"
                            onClick={() => {
                                if (modalState === 'proportional' || modalState === 'custom') {
                                    setModalState('start');
                                } else if (modalState === 'preview') {
                                    if (type === 'proportional') {
                                        setModalState('proportional');
                                    } else if (type === 'custom') {
                                        setModalState('custom');
                                    }
                                }
                            }}
                        />
                    ) : null}
                    <BeetsModalHeader>
                        {modalState === 'start' ? (
                            <>
                                <Heading size="md" noOfLines={1}>
                                    Invest into {pool.name}
                                </Heading>
                                <Text color="gray.200" fontSize="md">
                                    {formattedTypeName}
                                </Text>
                            </>
                        ) : null}

                        {modalState === 'proportional' ? (
                            <Heading size="md" marginLeft='8' textAlign="left">
                                Proportional investment
                            </Heading>
                        ) : null}

                        {modalState === 'custom' ? (
                            <Heading size="md" marginLeft='8' textAlign="left">
                                Custom investment
                            </Heading>
                        ) : null}

                        {modalState === 'preview' ? (
                            <Heading size="md" marginLeft='8' textAlign="left">
                                Investment preview
                            </Heading>
                        ) : null}
                    </BeetsModalHeader>
                    <BeetsModalBody p='0'>
                        {modalState === 'start' ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <PoolInvestTypeChoice
                                    onShowProportional={() => {
                                        setInvestType('proportional');
                                        setModalState('proportional');
                                    }}
                                    onShowCustom={() => {
                                        setInvestType('custom');
                                        setModalState('custom');
                                    }}
                                />
                            </motion.div>
                        ) : null}

                        {modalState === 'proportional' ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <PoolInvestProportional
                                    onShowPreview={() => {
                                        setInvestType('proportional');
                                        setModalState('preview');
                                    }}
                                />
                            </motion.div>
                        ) : null}
                        {modalState === 'custom' ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <PoolInvestCustom
                                    onShowPreview={() => {
                                        setInvestType('custom');
                                        setModalState('preview');
                                    }}
                                />
                            </motion.div>
                        ) : null}
                        {modalState === 'preview' ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <PoolInvestPreview
                                    onInvestComplete={() => {
                                        setInvestComplete(true);
                                    }}
                                    onClose={onModalClose}
                                />
                            </motion.div>
                        ) : null}
                    </BeetsModalBody>
                </BeetsModalContent>
            </Modal>
        </>
    );
}
