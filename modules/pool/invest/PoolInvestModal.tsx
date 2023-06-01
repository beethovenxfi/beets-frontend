import { Modal, ModalCloseButton } from '@chakra-ui/modal';
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    ButtonProps,
    Heading,
    IconButton,
    ModalOverlay,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { PoolInvestProportional } from '~/modules/pool/invest/components/PoolInvestProportional';
import { ChevronLeft } from 'react-feather';
import { PoolInvestPreview } from '~/modules/pool/invest/components/PoolInvestPreview';
import React, { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PoolInvestTypeChoice } from '~/modules/pool/invest/components/PoolInvestTypeChoice';
import { PoolInvestCustom } from '~/modules/pool/invest/components/PoolInvestCustom';
import { animate, AnimatePresence, motion, useAnimation } from 'framer-motion';
import { usePool } from '~/modules/pool/lib/usePool';
import { BeetsModalBody, BeetsModalContent, BeetsModalHeader } from '~/components/modal/BeetsModal';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

interface Props {
    activatorLabel?: string;
    activatorProps?: ButtonProps;
    noActivator?: boolean;
    isVisible?: boolean;
    onClose?: () => void;
}

function getInvertedTransform(startBounds: DOMRect, endBounds: DOMRect) {
    return {
        x: startBounds.x - endBounds.x,
        y: startBounds.y - endBounds.y,
        scaleX: startBounds.width / endBounds.width,
        scaleY: startBounds.height / endBounds.height,
    };
}

export function PoolInvestModal({
    activatorLabel,
    activatorProps = {},
    noActivator,
    onClose: _onClose,
    isVisible = false,
}: Props) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { pool, formattedTypeName } = usePool();
    const [modalState, setModalState] = useState<'start' | 'proportional' | 'custom' | 'preview'>('start');
    const [type, setInvestType] = useState<'proportional' | 'custom' | null>(null);
    const initialRef = useRef(null);
    const [investComplete, setInvestComplete] = useState(false);
    const { warnings } = useNetworkConfig();
    const containerControls = useAnimation();
    const modalContainerRef = useRef<HTMLDivElement | null>(null);
    const lastModalBounds = useRef<DOMRect | null>(null);

    function onModalClose() {
        if (investComplete) {
            setModalState('start');
            setInvestType(null);
        }
        onClose();
        _onClose && _onClose();
    }

    useEffect(() => {
        if (isVisible) {
            onOpen();
        } else {
            onModalClose();
        }
    }, [isVisible]);

    useLayoutEffect(() => {
        setTimeout(async () => {
            if (isOpen) {
                if (modalContainerRef.current) {
                    containerControls.set({
                        opacity: 0,
                        transform: 'scale(.75)',
                    });
                }
                await containerControls.start({
                    opacity: 1,
                    transform: 'scale(1)',
                });

                const bounds = modalContainerRef.current?.getBoundingClientRect();
                if (bounds) {
                    lastModalBounds.current = bounds;
                }
            } else {
                containerControls.start({
                    opacity: 0,
                    transform: 'scale(0.75)',
                });
            }
        }, 0);
    }, [isOpen]);

    useLayoutEffect(() => {
        if (modalContainerRef.current) {
            const bounds = modalContainerRef.current.getBoundingClientRect();
            if (lastModalBounds.current) {
                const invertedTransform = getInvertedTransform(lastModalBounds.current, bounds);
                animate(invertedTransform.scaleY, 1, {
                    onUpdate: (t) => {
                        if (modalContainerRef.current) {
                            modalContainerRef.current.style.transform = `scaleY(${t})`;
                        }
                    },
                });
            }
            lastModalBounds.current = bounds;
        }
    }, [modalState]);

    return (
        <Box width={{ base: 'full', md: 'fit-content' }}>
            {!noActivator && (
                <Button variant="primary" onClick={onOpen} width={{ base: 'full', md: '140px' }} {...activatorProps}>
                    {activatorLabel || 'Invest'}
                </Button>
            )}
            <Modal motionPreset="none" isOpen={isOpen} onClose={onModalClose} size="lg" initialFocusRef={initialRef}>
                <ModalOverlay bg="blackAlpha.900" />
                <AnimatePresence exitBeforeEnter>
                    <BeetsModalContent position="relative" isTransparent={true}>
                        <Box
                            as={motion.div}
                            width="full"
                            height="full"
                            position="absolute"
                            top="0"
                            left="0"
                            right="0"
                            zIndex={-1}
                            animate={containerControls}
                            ref={modalContainerRef}
                            rounded="md"
                            transformOrigin="top"
                            background="gray.700"
                        >
                            <Box transformOrigin="top" width="full" height="full" background="blackAlpha.400">
                                <Box width="full" height="full" className="bg" />
                            </Box>
                        </Box>
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
                                <Heading size="md" marginLeft="8" textAlign="left">
                                    Proportional investment
                                </Heading>
                            ) : null}
                        </BeetsModalHeader>
                        <BeetsModalBody p="0">
                            {modalState === 'start' ? (
                                <motion.div
                                    style={{ minHeight: '200px' }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, transition: { delay: 0.25 } }}
                                    exit={{ opacity: 0 }}
                                >
                                    {warnings.poolInvest[pool.id] && (
                                        <Box px="4">
                                            <Alert status="warning" mb="4">
                                                <AlertIcon />
                                                {warnings.poolInvest[pool.id]}
                                            </Alert>
                                        </Box>
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
                                <motion.div
                                    style={{ minHeight: '620px' }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, transition: { delay: 0.25 } }}
                                    exit={{ opacity: 0 }}
                                >
                                    <PoolInvestProportional
                                        onShowPreview={() => {
                                            setInvestType('proportional');
                                            setModalState('preview');
                                        }}
                                    />
                                </motion.div>
                            ) : null}
                            {modalState === 'custom' ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, transition: { delay: 0.25 } }}
                                    exit={{ opacity: 0 }}
                                >
                                    <PoolInvestCustom
                                        onShowPreview={() => {
                                            setInvestType('custom');
                                            setModalState('preview');
                                        }}
                                    />
                                </motion.div>
                            ) : null}
                            {modalState === 'preview' ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
                </AnimatePresence>
            </Modal>
        </Box>
    );
}
