import { Modal, ModalBody, ModalCloseButton, ModalContent } from '@chakra-ui/modal';
import {
    Alert,
    AlertIcon,
    Button,
    Heading,
    IconButton,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { PoolInvestProportional } from '~/modules/pool/invest/components/PoolInvestProportional';
import { ChevronLeft } from 'react-feather';
import { PoolInvestPreview } from '~/modules/pool/invest/components/PoolInvestPreview';
import { useEffect, useRef, useState } from 'react';
import { PoolInvestTypeChoice } from '~/modules/pool/invest/components/PoolInvestTypeChoice';
import { PoolInvestCustom } from '~/modules/pool/invest/components/PoolInvestCustom';
import { motion } from 'framer-motion';
import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';
import { usePool } from '~/modules/pool/lib/usePool';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';

export function PoolInvestModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { pool, formattedTypeName } = usePool();
    const [modalState, setModalState] = useState<'start' | 'proportional' | 'custom' | 'preview'>('start');
    const [type, setInvestType] = useState<'proportional' | 'custom' | null>(null);
    const initialRef = useRef(null);
    const [investComplete, setInvestComplete] = useState(false);
    const { clearInvestState, setSelectedOptions, hasSelectedOptions } = useInvestState();
    const { optionsWithLargestBalances } = usePoolUserTokenBalancesInWallet();

    useEffect(() => {
        if (modalState !== 'start') {
            setModalState('start');
        }

        clearInvestState();
    }, [pool.id]);

    useEffect(() => {
        if (isOpen && !hasSelectedOptions) {
            setSelectedOptions(optionsWithLargestBalances);
        }
    }, [isOpen]);

    function onModalClose() {
        if (investComplete) {
            setModalState('start');
            setInvestType(null);
        }

        onClose();
    }

    return (
        <>
            <Button variant="primary" onClick={onOpen} width={{ base: 'full', md: '140px' }} mr="2">
                Invest
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={onModalClose}
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
                                    {formattedTypeName}
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
                                {pool.id === '0xb1c9ac57594e9b1ec0f3787d9f6744ef4cb0a02400000000000000000000006e' && (
                                    <Alert status="warning" mb="4">
                                        <AlertIcon />
                                        To account for the USD+ and DAI+ deposit/withdraw fee, this pool will charge a
                                        fee on both invest and withdraw of up to 0.06%.
                                    </Alert>
                                )}
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
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
