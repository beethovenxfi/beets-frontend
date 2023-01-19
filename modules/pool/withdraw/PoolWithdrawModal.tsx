import { Modal, ModalBody, ModalCloseButton, ModalContent } from '@chakra-ui/modal';
import {
    Alert,
    AlertIcon,
    Button,
    ButtonProps,
    Heading,
    IconButton,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { ChevronLeft } from 'react-feather';
import { useEffect, useRef, useState } from 'react';
import { PoolWithdrawTypeChoice } from '~/modules/pool/withdraw/components/PoolWithdrawTypeChoice';
import { PoolWithdrawProportional } from '~/modules/pool/withdraw/components/PoolWithdrawProportional';
import { PoolWithdrawSingleAsset } from '~/modules/pool/withdraw/components/PoolWithdrawSingleAsset';
import { PoolWithdrawPreview } from '~/modules/pool/withdraw/components/PoolWithdrawPreview';
import { FadeInBox } from '~/components/animation/FadeInBox';
import { useWithdrawState } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { usePool } from '~/modules/pool/lib/usePool';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

interface Props {
    activatorProps?: ButtonProps;
    noActivator?: boolean;
    isVisible?: boolean;
    onClose?: () => void;
}
export function PoolWithdrawModal({ activatorProps = {}, noActivator = false, onClose: _onClose, isVisible = false }: Props) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { pool, formattedTypeName } = usePool();
    const [modalState, setModalState] = useState<'start' | 'proportional' | 'single-asset' | 'preview'>('start');
    const [type, setInvestType] = useState<'proportional' | 'single-asset' | null>(null);
    const initialRef = useRef(null);
    const [withdrawComplete, setWithdrawComplete] = useState(false);
    const { clearWithdrawState } = useWithdrawState();
    const { warnings } = useNetworkConfig();

    useEffect(() => {
        setModalState('start');
        clearWithdrawState();
    }, [pool.id]);

    function onModalClose() {
        if (withdrawComplete) {
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

    return (
        <>
            {!noActivator && (
                <Button onClick={onOpen} variant="secondary" width={{ base: 'full', md: '140px' }} {...activatorProps}>
                    Withdraw
                </Button>
            )}
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
                                if (modalState === 'proportional' || modalState === 'single-asset') {
                                    setModalState('start');
                                } else if (modalState === 'preview') {
                                    if (type === 'proportional') {
                                        setModalState('proportional');
                                    } else if (type === 'single-asset') {
                                        setModalState('single-asset');
                                    }
                                }
                            }}
                        />
                    ) : null}
                    <ModalHeader className="bg">
                        {modalState === 'start' ? (
                            <>
                                <Heading size="md" noOfLines={1}>
                                    Withdraw from {pool.name}
                                </Heading>
                                <Text color="gray.200" fontSize="md">
                                    {formattedTypeName}
                                </Text>
                            </>
                        ) : null}

                        {modalState === 'proportional' ? (
                            <Heading size="md" textAlign="center">
                                Proportional withdraw
                            </Heading>
                        ) : null}

                        {modalState === 'single-asset' ? (
                            <Heading size="md" textAlign="center">
                                Single asset withdraw
                            </Heading>
                        ) : null}

                        {modalState === 'preview' ? (
                            <Heading size="md" textAlign="center">
                                Withdraw preview
                            </Heading>
                        ) : null}
                    </ModalHeader>
                    <ModalBody className="bg" pb="6">
                        <FadeInBox isVisible={modalState === 'start'}>
                            {warnings.poolWithdraw[pool.id] && (
                                <Alert status="warning" mb="4">
                                    <AlertIcon />
                                    {warnings.poolWithdraw[pool.id]}
                                </Alert>
                            )}
                            <PoolWithdrawTypeChoice
                                onShowProportional={() => {
                                    setInvestType('proportional');
                                    setModalState('proportional');
                                }}
                                onShowSingleAsset={() => {
                                    setInvestType('single-asset');
                                    setModalState('single-asset');
                                }}
                            />
                        </FadeInBox>
                        <FadeInBox isVisible={modalState === 'proportional'}>
                            <PoolWithdrawProportional
                                onShowPreview={() => {
                                    setInvestType('proportional');
                                    setModalState('preview');
                                }}
                            />
                        </FadeInBox>
                        <FadeInBox isVisible={modalState === 'single-asset'}>
                            <PoolWithdrawSingleAsset
                                onShowPreview={() => {
                                    setInvestType('single-asset');
                                    setModalState('preview');
                                }}
                            />
                        </FadeInBox>
                        <FadeInBox isVisible={modalState === 'preview'}>
                            <PoolWithdrawPreview
                                onWithdrawComplete={() => {
                                    setWithdrawComplete(true);
                                }}
                                onClose={onModalClose}
                            />
                        </FadeInBox>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
