import { Modal, ModalCloseButton } from '@chakra-ui/modal';
import { Button, ButtonProps, Heading, IconButton, ModalOverlay, Text, VStack, useDisclosure } from '@chakra-ui/react';
import { ChevronLeft } from 'react-feather';
import { useEffect, useRef, useState } from 'react';
import { BeetsModalBody, BeetsModalContent, BeetsModalHeader } from '~/components/modal/BeetsModal';
import { GqlPoolStaking, useUserSyncBalanceMutation } from '~/apollo/generated/graphql-codegen-generated';
import { useStakingWithdraw } from '~/lib/global/useStakingWithdraw';
import { BeetsTransactionStepsSubmit, TransactionStep } from '~/components/button/BeetsTransactionStepsSubmit';
import { _usePoolUserBptBalance, usePoolUserBptBalance } from '../lib/usePoolUserBptBalance';
import { oldBnumScaleAmount, oldBnumToHumanReadable } from '~/lib/services/pool/lib/old-big-number';
import { usePool } from '../lib/usePool';
import { useStakingDeposit } from '~/lib/global/useStakingDeposit';
import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { TokenBase } from '~/lib/services/token/token-types';
import { omit } from 'lodash';

interface Props {
    activatorProps?: ButtonProps;
    noActivator?: boolean;
    isVisible?: boolean;
    onClose?: () => void;
}
export function PoolGaugeMigrateModal({
    activatorProps = {},
    noActivator = false,
    onClose: _onClose,
    isVisible = false,
}: Props) {
    const [steps, setSteps] = useState<TransactionStep[]>([]);
    const [depositAmount, setDepositAmount] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { pool } = usePool();
    const [modalState, setModalState] = useState<'start' | 'proportional' | 'single-asset' | 'preview'>('start');
    const {
        userStakedBptBalance,
        userLegacyGaugeStakedBptBalance,
        userWalletBptBalance,
        userLegacyGaugeStakedGaugeAddress,
        isLoading: isLoadingBalances,
        isRefetching: isRefetchingBalances,
        refetch: refetchBptBalances,
    } = usePoolUserBptBalance();

    const legacyGqlPoolStaking = (pool.staking?.gauge?.otherGauges || []).find(
        (g) => g.gaugeAddress === userLegacyGaugeStakedGaugeAddress,
    );
    const { withdraw, ...unstakeQuery } = useStakingWithdraw(pool.staking, legacyGqlPoolStaking);
    const { stake, ...depositQuery } = useStakingDeposit(pool.staking as GqlPoolStaking);

    const stakedAmount = oldBnumToHumanReadable(oldBnumScaleAmount(userLegacyGaugeStakedBptBalance));

    const { hasApprovalForAmount, ...rest } = useUserAllowances([pool], pool.staking?.address || '');
    const hasApprovalForDeposit = hasApprovalForAmount(pool.address, stakedAmount || depositAmount);
    const [userSyncBalance] = useUserSyncBalanceMutation();
    const initialRef = useRef(null);

    const hasLegacyBptStaked = parseFloat(userLegacyGaugeStakedBptBalance) > 0;
    const bpt = useRef<TokenBase>({
        address: pool.address,
        symbol: 'BPT',
        name: 'BPT',
        decimals: 18,
    });

    useEffect(() => {
        const _steps: TransactionStep[] = [{ id: 'deposit', tooltipText: '', type: 'other', buttonText: 'Stake' }];
        if (!hasApprovalForDeposit && bpt) {
            _steps.unshift({
                id: 'approve-gauge',
                tooltipText: 'Approve the new gauge to spend your BPT',
                type: 'tokenApproval',
                buttonText: 'Approve the new gauge',
                contractToApprove: pool.staking?.address,
                token: {
                    ...(bpt.current || {}),
                    amount: depositAmount,
                },
            });
        }
        if (hasLegacyBptStaked) {
            _steps.unshift({ id: 'unstake', tooltipText: '', type: 'other', buttonText: 'Unstake' });
        }
        if (_steps.length < steps?.length) return;
        setSteps(_steps);
    }, [hasLegacyBptStaked, depositAmount]);

    useEffect(() => {
        setModalState('start');
    }, [pool.id]);

    function onModalClose() {
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

    function handleTransactionSubmit(txId: string) {
        if (txId === 'unstake') {
            withdraw(stakedAmount);
            setDepositAmount(stakedAmount);
        }
        if (txId === 'deposit') {
            stake(depositAmount);
        }
    }

    return (
        <>
            {!noActivator && (
                <Button onClick={onOpen} bg="orange.200" {...activatorProps}>
                    Migrate
                </Button>
            )}
            <Modal isOpen={isOpen} onClose={onModalClose} size="lg" initialFocusRef={initialRef}>
                <ModalOverlay bg="blackAlpha.900" />
                <BeetsModalContent width="full">
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
                                // handle state
                            }}
                        />
                    ) : null}
                    <BeetsModalHeader className="bg">
                        <ModalCloseButton />
                        <VStack>
                            <Heading size="md" noOfLines={1}>
                                Migrate staked balance
                            </Heading>
                        </VStack>
                    </BeetsModalHeader>

                    <BeetsModalBody className="bg" p="0" width="full">
                        <VStack px="4" pb="4" spacing="4" width="full">
                            <Text fontSize="1rem" fontWeight="normal">
                                To ensure you continue receiving staking rewards for this pool, please migrate your
                                staked balance.
                            </Text>
                            <BeetsTransactionStepsSubmit
                                buttonSize="lg"
                                isLoading={false} // TODO CONFIRM
                                loadingButtonText="" // TODO CONFIRM
                                completeButtonText="Close"
                                onCompleteButtonClick={onModalClose}
                                onSubmit={handleTransactionSubmit}
                                onConfirmed={async (id) => {
                                    refetchBptBalances();
                                    userSyncBalance({ variables: { poolId: pool.id } });
                                }}
                                steps={steps}
                                queries={[
                                    { ...unstakeQuery, id: 'unstake' },
                                    { ...depositQuery, id: 'deposit' },
                                ]}
                                isDisabled={false} // TODO CONFIRM
                            />
                        </VStack>
                    </BeetsModalBody>
                </BeetsModalContent>
            </Modal>
        </>
    );
}
