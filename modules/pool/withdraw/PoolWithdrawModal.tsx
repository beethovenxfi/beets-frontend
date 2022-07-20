import { Modal, ModalBody, ModalCloseButton, ModalContent } from '@chakra-ui/modal';
import { Heading, IconButton, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import BeetsButton from '~/components/button/Button';
import { usePool } from '~/modules/pool/lib/usePool';
import PoolInvestProportional from '~/modules/pool/invest/components/PoolInvestProportional';
import { ChevronLeft } from 'react-feather';
import { PoolInvestPreview } from '~/modules/pool/invest/components/PoolInvestPreview';
import { useRef, useState } from 'react';
import { PoolInvestTypeChoice } from '~/modules/pool/invest/components/PoolInvestTypeChoice';
import { PoolInvestCustom } from '~/modules/pool/invest/components/PoolInvestCustom';
import { PoolWithdrawTypeChoice } from '~/modules/pool/withdraw/components/PoolWithdrawTypeChoice';
import { PoolUnstakeModal } from '~/modules/pool/stake/PoolUnstakeModal';
import { PoolWithdrawProportional } from '~/modules/pool/withdraw/components/PoolWithdrawProportional';
import { PoolWithdrawSingleAsset } from '~/modules/pool/withdraw/components/PoolWithdrawSingleAsset';
import { PoolWithdrawPreview } from '~/modules/pool/withdraw/components/PoolWithdrawPreview';

export function PoolWithdrawModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { pool, getPoolTypeName } = usePool();
    const [modalState, setModalState] = useState<'start' | 'proportional' | 'single-asset' | 'preview'>('single-asset');
    const [type, setInvestType] = useState<'proportional' | 'single-asset' | null>(null);
    const initialRef = useRef(null);

    return (
        <>
            <BeetsButton onClick={onOpen} width="140px" buttonType="secondary">
                Withdraw
            </BeetsButton>
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
                                    {getPoolTypeName()}
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
                        {modalState === 'start' ? (
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
                        ) : null}
                        {modalState === 'proportional' ? (
                            <PoolWithdrawProportional
                                onShowPreview={() => {
                                    setInvestType('proportional');
                                    setModalState('preview');
                                }}
                            />
                        ) : null}
                        {modalState === 'single-asset' ? (
                            <PoolWithdrawSingleAsset
                                onShowPreview={() => {
                                    setInvestType('single-asset');
                                    setModalState('preview');
                                }}
                            />
                        ) : null}
                        {modalState === 'preview' ? (
                            <PoolWithdrawPreview
                                onWithdrawComplete={() => {
                                    setModalState('start');
                                    setInvestType(null);
                                    onClose();
                                }}
                            />
                        ) : null}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
