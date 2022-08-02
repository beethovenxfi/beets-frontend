import { Modal, ModalBody, ModalCloseButton, ModalContent } from '@chakra-ui/modal';
import { Button, Heading, IconButton, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import { usePool } from '~/modules/pool/lib/usePool';
import { PoolInvestProportional } from '~/modules/pool/invest/components/PoolInvestProportional';
import { ChevronLeft } from 'react-feather';
import { PoolInvestPreview } from '~/modules/pool/invest/components/PoolInvestPreview';
import { useRef, useState } from 'react';
import { PoolInvestTypeChoice } from '~/modules/pool/invest/components/PoolInvestTypeChoice';
import { PoolInvestCustom } from '~/modules/pool/invest/components/PoolInvestCustom';
import { motion } from 'framer-motion';

export function PoolInvestModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { pool, getPoolTypeName } = usePool();
    const [modalState, setModalState] = useState<'start' | 'proportional' | 'custom' | 'preview'>('start');
    const [type, setInvestType] = useState<'proportional' | 'custom' | null>(null);
    const initialRef = useRef(null);

    return (
        <>
            <Button variant="primary" onClick={onOpen} width={{ base: 'full', md: '140px' }} mr="2">
                Invest
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size={modalState === 'start' ? '3xl' : '2xl'}
                initialFocusRef={initialRef}
            >
                <ModalOverlay />
                <ModalContent backgroundColor="black">
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
                            top="8px"
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
                    <ModalHeader className="bg">
                        {modalState === 'start' ? (
                            <>
                                <Heading size="md" noOfLines={1}>
                                    Invest into {pool.name}
                                </Heading>
                                <Text color="gray.200" fontSize="md">
                                    {getPoolTypeName()}
                                </Text>
                            </>
                        ) : null}

                        {modalState === 'proportional' ? (
                            <Heading size="md" textAlign="center">
                                Proportional investment
                            </Heading>
                        ) : null}

                        {modalState === 'custom' ? (
                            <Heading size="md" textAlign="center">
                                Custom investment
                            </Heading>
                        ) : null}

                        {modalState === 'preview' ? (
                            <Heading size="md" textAlign="center">
                                Investment preview
                            </Heading>
                        ) : null}
                    </ModalHeader>
                    <ModalBody className="bg" pb="6">
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
                                        setModalState('start');
                                        setInvestType(null);
                                        onClose();
                                    }}
                                />
                            </motion.div>
                        ) : null}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
