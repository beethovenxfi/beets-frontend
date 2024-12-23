import {
    Box,
    Heading,
    ModalHeader,
    ModalOverlay,
    Skeleton,
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack,
    Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { Modal, ModalBody, ModalCloseButton, ModalContent } from '@chakra-ui/modal';
import { capitalize } from 'lodash';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { BeetsTransactionStepsSubmit, TransactionStep } from '~/components/button/BeetsTransactionStepsSubmit';
import { BeetsBox } from '~/components/box/BeetsBox';
import { usePoolUserDepositBalance } from '~/modules/pool/lib/usePoolUserDepositBalance';
import {
    oldBnum,
    oldBnumScaleAmount,
    oldBnumToBnum,
    oldBnumToHumanReadable,
} from '~/lib/services/pool/lib/old-big-number';
import { useStakingWithdraw } from '~/lib/global/useStakingWithdraw';
import { CardRow } from '~/components/card/CardRow';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { usePool } from '~/modules/pool/lib/usePool';
import { useUserSyncBalanceMutation } from '~/apollo/generated/graphql-codegen-generated';
import { useGaugeUnstakeGetContractCallData } from './lib/useGaugeUnstakeGetContractCallData';
import { useHasMinterApproval } from '~/lib/util/useHasMinterApproval';
import { useHasBatchRelayerApproval } from '~/lib/util/useHasBatchRelayerApproval';
import { usePoolUserPendingRewards } from '../lib/usePoolUserPendingRewards';
import { useStakingClaimRewards } from '~/lib/global/useStakingClaimRewards';

interface Props {
    isOpen: boolean;
    onOpen(): void;
    onClose(): void;
}

export function PoolUnstakeModal({ isOpen, onOpen, onClose }: Props) {
    const networkConfig = useNetworkConfig();
    const { userPoolBalanceUSD } = usePoolUserDepositBalance();
    const [percent, setPercent] = useState(100);
    const {
        userTotalBptBalance,
        userStakedBptBalance,
        hasBptStaked,
        isLoading: isLoadingBalances,
        isRefetching: isRefetchingBalances,
        refetch: refetchBptBalances,
    } = usePoolUserBptBalance();
    const [userSyncBalance] = useUserSyncBalanceMutation();
    const amount = oldBnumToHumanReadable(oldBnumScaleAmount(userStakedBptBalance).times(percent).div(100));
    const hasValue = hasBptStaked && amount !== '' && percent !== 0;
    const amountIsValid = !hasValue || parseFloat(userStakedBptBalance) >= parseFloat(amount);
    const amountValue = (parseFloat(amount) / parseFloat(userTotalBptBalance)) * userPoolBalanceUSD;
    const { pool } = usePool();
    const { withdraw, ...unstakeQuery } = useStakingWithdraw(pool.staking);
    const { claim, ...harvestQuery } = useStakingClaimRewards(pool.staking);
    const [steps, setSteps] = useState<TransactionStep[] | null>(null);
    const { data: hasMinterApproval, isLoading: isLoadingHasMinterApproval } = useHasMinterApproval();
    const { data: hasBatchRelayerApproval, isLoading: isLoadingBatchRelayerApproval } = useHasBatchRelayerApproval();
    const {
        hasPendingBalRewards,
        hasPendingNonBALRewards,
        isLoading: isLoadingPendingRewards,
    } = usePoolUserPendingRewards();

    const isLoading =
        isLoadingBalances || isLoadingHasMinterApproval || isLoadingBatchRelayerApproval || isLoadingPendingRewards;

    const { data: contractCalls } = useGaugeUnstakeGetContractCallData(
        oldBnumToBnum(oldBnum(oldBnumScaleAmount(userStakedBptBalance).times(percent).div(100).toFixed(0))),
    );

    useEffect(() => {
        if (isOpen && userStakedBptBalance) {
            setPercent(100);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isLoading) {
            setSteps([
                ...(!hasBatchRelayerApproval && !isLoadingBatchRelayerApproval
                    ? [
                          {
                              id: 'batch-relayer',
                              type: 'other' as const,
                              buttonText: 'Approve batch relayer for unstaking',
                              tooltipText: 'Unstaking requires you to approve the batch relayer.',
                          },
                      ]
                    : []),
                ...(hasPendingBalRewards && !hasMinterApproval
                    ? [
                          {
                              id: 'minter',
                              type: 'other' as const,
                              buttonText: 'Approve batch relayer for minting',
                              tooltipText: 'Approve batch relayer for minting',
                          },
                      ]
                    : []),
                ...(hasPendingNonBALRewards
                    ? [
                          {
                              id: 'claim',
                              type: 'other' as const,
                              buttonText: 'Claim rewards',
                              tooltipText: 'Claim rewards',
                          },
                      ]
                    : []),
                {
                    id: 'unstake',
                    type: 'other',
                    buttonText: 'Unstake BPT',
                    tooltipText: 'Unstake BPT',
                },
            ]);
        }
    }, [isLoading, isOpen]);

    function onCloseModal() {
        unstakeQuery.reset();
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={onCloseModal} size="xl">
            <ModalOverlay />
            <ModalContent backgroundColor="black">
                <ModalCloseButton />
                <ModalHeader className="bg">
                    <Heading size="md" noOfLines={1}>
                        {capitalize(networkConfig.farmTypeName)}
                    </Heading>
                    <Text color="gray.200" fontSize="md">
                        Claim rewards and unstake your BPT
                    </Text>
                </ModalHeader>
                <ModalBody className="bg" pt="4" pb="6">
                    <Text mb="4">
                        Drag the slider to configure the amount you would like to unstake from the{' '}
                        {networkConfig.farmTypeName}.
                    </Text>
                    <Slider mt="8" aria-label="slider-ex-1" value={percent} onChange={setPercent}>
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb boxSize={4} />
                        <SliderMark
                            value={percent}
                            textAlign="center"
                            bg="beets.base.500"
                            color="white"
                            mt="-10"
                            ml="-30px"
                            w="12"
                            fontSize="md"
                            width="60px"
                            borderRadius="md"
                        >
                            {percent}%
                        </SliderMark>
                    </Slider>

                    <BeetsBox mt="4" p="2" mb="8">
                        <CardRow mb="0">
                            <Box flex="1">
                                <Text>Amount to unstake</Text>
                            </Box>
                            <Box display="flex" flexDirection="column" alignItems="flex-end">
                                {isLoadingBalances || isRefetchingBalances ? (
                                    <>
                                        <Skeleton height="20px" width="60px" mb="2" />
                                        <Skeleton height="20px" width="40px" />
                                    </>
                                ) : (
                                    <>
                                        <Box textAlign="right">{numberFormatUSDValue(amountValue)}</Box>
                                        <Box textAlign="right" color="gray.200">
                                            {tokenFormatAmount(amount)} BPT
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </CardRow>
                    </BeetsBox>
                    <BeetsTransactionStepsSubmit
                        isLoading={isLoading}
                        loadingButtonText="Loading balances..."
                        completeButtonText="Close"
                        onCompleteButtonClick={onCloseModal}
                        onSubmit={(id) => {
                            if (id === 'claim') {
                                claim();
                            } else if (id === 'unstake') {
                                withdraw(contractCalls ? { contractCalls } : { amount });
                            }
                        }}
                        onConfirmed={async (id) => {
                            refetchBptBalances();
                            userSyncBalance({ variables: { poolId: pool.id } });
                        }}
                        steps={steps || []}
                        queries={[
                            { ...unstakeQuery, id: 'unstake' },
                            { ...harvestQuery, id: 'claim' },
                        ]}
                        isDisabled={!hasValue || !amountIsValid}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
