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
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PoolInvestTypeChoice } from '~/modules/pool/invest/components/PoolInvestTypeChoice';
import { PoolInvestCustom } from '~/modules/pool/invest/components/PoolInvestCustom';
import { animate, AnimatePresence, motion, useAnimation } from 'framer-motion';
import { usePool } from '~/modules/pool/lib/usePool';
import { BeetsModalBody, BeetsModalContent, BeetsModalHeader } from '~/components/modal/BeetsModal';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useInvestState } from './lib/useInvestState';
import { FadeInBox } from '~/components/animation/FadeInBox';
import { ReliquaryFarmPosition } from '~/lib/services/staking/reliquary.service';
import { ReliquaryInvestPreview } from '~/modules/reliquary/invest/components/ReliquaryInvestPreview';
import { useInvest } from './lib/useInvest';

interface Props {
    activatorLabel?: string;
    activatorProps?: ButtonProps;
    noActivator?: boolean;
    isVisible?: boolean;
    onClose?: () => void;
    isConnected?: boolean;
    createRelic?: boolean;
    selectedRelic?: ReliquaryFarmPosition | null;
    setCreateRelic?: (value: boolean) => void;
    isReliquary?: boolean;
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
    isConnected = true,
    createRelic = false,
    selectedRelic,
    setCreateRelic,
    isReliquary = false,
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
    const { setInitialInvestState, clearInvestState, setInputAmountsForType, inputAmounts, selectedOptions } =
        useInvestState();
    const { totalInvestValue, selectedInvestTokensWithAmounts } = useInvest();

    function onModalClose() {
        if (investComplete) {
            setModalState('start');
            setInvestType(null);
            setInvestComplete(false);
            setCreateRelic && setCreateRelic(false);
            clearInvestState();
        }
        onClose();
        _onClose && _onClose();
    }

    function onModalOpen() {
        if (createRelic) {
            setCreateRelic && setCreateRelic(true);
        } else {
            setCreateRelic && setCreateRelic(false);
        }
        setInitialInvestState();
        onOpen();
    }

    useEffect(() => {
        if (isVisible) {
            onModalOpen();
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
        <Box width={{ base: 'full', md: isReliquary ? 'full' : 'fit-content' }}>
            {!noActivator && (
                <Button
                    variant="primary"
                    onClick={onModalOpen}
                    width={{ base: 'full', md: isReliquary ? 'full' : '140px' }}
                    disabled={!isConnected}
                    {...activatorProps}
                >
                    {activatorLabel || 'Invest'}
                </Button>
            )}
            <Modal motionPreset="none" isOpen={isOpen} onClose={onModalClose} size="lg" initialFocusRef={initialRef}>
                <ModalOverlay bg="blackAlpha.900" />
                <AnimatePresence exitBeforeEnter>
                    <BeetsModalContent position="relative" isTransparent>
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
                                        {`Invest into ${
                                            isReliquary
                                                ? `${createRelic ? 'a new  ' : 'an existing '}relic `
                                                : `${pool.name}`
                                        }`}
                                    </Heading>
                                    <Text color="gray.200" fontSize="md">
                                        {isReliquary
                                            ? 'Deposit into the fresh BEETS farm to get maBEETS.'
                                            : formattedTypeName}
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
                            <FadeInBox isVisible={modalState === 'start'}>
                                {warnings.poolInvest[pool.id] && (
                                    <Box px="4">
                                        <Alert status="warning" mb="4">
                                            <AlertIcon />
                                            {warnings.poolInvest[pool.id]}
                                        </Alert>
                                    </Box>
                                )}
                                {!createRelic && selectedRelic && (
                                    <Box px="4">
                                        <Alert status="warning" mb="4">
                                            <AlertIcon />
                                            Investing more funds into your relic will affect your level up progress.
                                        </Alert>
                                    </Box>
                                )}
                                <PoolInvestTypeChoice
                                    onShowProportional={() => {
                                        setInvestType('proportional');
                                        setModalState('proportional');
                                        setInputAmountsForType('proportional');
                                    }}
                                    onShowCustom={() => {
                                        setInvestType('custom');
                                        setModalState('custom');
                                        setInputAmountsForType('custom');
                                    }}
                                />
                            </FadeInBox>
                            <FadeInBox isVisible={modalState === 'proportional'}>
                                <PoolInvestProportional
                                    onShowPreview={() => {
                                        setInvestType('proportional');
                                        setModalState('preview');
                                    }}
                                />
                            </FadeInBox>
                            <FadeInBox isVisible={modalState === 'custom'}>
                                <PoolInvestCustom
                                    onShowPreview={() => {
                                        setInvestType('custom');
                                        setModalState('preview');
                                    }}
                                />
                            </FadeInBox>
                            <FadeInBox isVisible={modalState === 'preview'}>
                                {isReliquary ? (
                                    <ReliquaryInvestPreview
                                        totalInvestValue={totalInvestValue}
                                        selectedInvestTokensWithAmounts={selectedInvestTokensWithAmounts}
                                        onInvestComplete={() => {
                                            setInvestComplete(true);
                                        }}
                                        onClose={onModalClose}
                                        inputAmounts={inputAmounts}
                                        selectedOptions={selectedOptions}
                                    />
                                ) : (
                                    <PoolInvestPreview
                                        onInvestComplete={() => {
                                            setInvestComplete(true);
                                        }}
                                        onClose={onModalClose}
                                    />
                                )}
                            </FadeInBox>
                        </BeetsModalBody>
                    </BeetsModalContent>
                </AnimatePresence>
            </Modal>
        </Box>
    );
}
