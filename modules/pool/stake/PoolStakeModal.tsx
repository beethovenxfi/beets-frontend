import {
    Box,
    Heading,
    ModalHeader,
    ModalOverlay,
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
import { networkConfig } from '~/lib/config/network-config';
import { capitalize } from 'lodash';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { usePool } from '~/modules/pool/lib/usePool';
import { useApproveToken } from '~/lib/util/useApproveToken';
import { useMasterChefDepositIntoFarm } from '~/lib/global/useMasterChefDepositIntoFarm';
import { BeetsSkeleton } from '~/components/skeleton/BeetsSkeleton';
import { usePoolUserStakingAllowance } from '~/modules/pool/stake/lib/usePoolUserStakingAllowance';
import { BeetsTransactionStepsSubmit, TransactionStep } from '~/components/button/BeetsTransactionStepsSubmit';
import { BeetsBoxLineItem } from '~/components/box/BeetsBoxLineItem';
import { BeetsBox } from '~/components/box/BeetsBox';
import { usePoolUserDepositBalance } from '~/modules/pool/lib/usePoolUserDepositBalance';
import { oldBnumScaleAmount, oldBnumToHumanReadable } from '~/lib/services/pool/lib/old-big-number';

interface Props {
    isOpen: boolean;
    onOpen(): void;
    onClose(): void;
}

export function PoolStakeModal({ isOpen, onOpen, onClose }: Props) {
    const { userPoolBalanceUSD } = usePoolUserDepositBalance();
    const [percent, setPercent] = useState(100);
    const {
        userWalletBptBalance,
        hasBptInWallet,
        isLoading: isLoadingBalances,
        isRefetching: isRefetchingBalances,
        refetch: refetchBptBalances,
    } = usePoolUserBptBalance();
    const amount = oldBnumToHumanReadable(oldBnumScaleAmount(userWalletBptBalance).times(percent).div(100));
    const hasValue = hasBptInWallet && amount !== '' && percent !== 0;
    const amountIsValid = !hasValue || parseFloat(userWalletBptBalance) >= parseFloat(amount);
    const { pool } = usePool();
    const {
        hasApprovalToStakeAmount,
        isLoading: isLoadingAllowances,
        refetch: refetchAllowances,
        isRefetching,
    } = usePoolUserStakingAllowance();

    const { approve, ...approveQuery } = useApproveToken(pool);
    const { stake, ...stakeQuery } = useMasterChefDepositIntoFarm();
    const [steps, setSteps] = useState<TransactionStep[] | null>(null);
    const loading = isLoadingAllowances || isLoadingBalances;

    useEffect(() => {
        if (!loading && steps === null) {
            const hasApproval = hasApprovalToStakeAmount(userWalletBptBalance);

            setSteps([
                ...(!hasApproval
                    ? [{ id: 'approve', type: 'other' as const, buttonText: 'Approve BPT', tooltipText: 'Approve BPT' }]
                    : []),
                {
                    id: 'stake',
                    type: 'other',
                    buttonText: 'Stake BPT',
                    tooltipText: 'Stake your BPT to earn additional rewards.',
                },
            ]);
        }
    }, [loading]);

    useEffect(() => {
        if (isOpen && userWalletBptBalance) {
            setPercent(100);
        }
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                approveQuery.reset();
                stakeQuery.reset();
                onClose();
            }}
            size="xl"
        >
            <ModalOverlay />
            <ModalContent backgroundColor="black">
                <ModalCloseButton />
                <ModalHeader className="bg">
                    <Heading size="md" noOfLines={1}>
                        {capitalize(networkConfig.farmTypeName)}
                    </Heading>
                    <Text color="gray.200" fontSize="md">
                        Stake your BPT to earn additional rewards
                    </Text>
                </ModalHeader>
                <ModalBody className="bg" pt="4" pb="6">
                    <Text mb="4">
                        Drag the slider to configure the amount you would like to stake. To maximize your rewards, stake
                        all of your BPT into the {networkConfig.farmTypeName}.
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

                    <BeetsBox mt="4" pt="0.5" mb="8">
                        <BeetsBoxLineItem
                            last={true}
                            pl="3"
                            center={true}
                            leftContent={
                                <Box flex="1">
                                    <Text>Amount to stake</Text>
                                </Box>
                            }
                            rightContent={
                                <Box display="flex" flexDirection="column" alignItems="flex-end">
                                    {isLoadingBalances || isRefetchingBalances ? (
                                        <>
                                            <BeetsSkeleton height="20px" width="60px" mb="2" />
                                            <BeetsSkeleton height="20px" width="40px" />
                                        </>
                                    ) : (
                                        <>
                                            <Box textAlign="right">
                                                {numberFormatUSDValue(userPoolBalanceUSD * (percent / 100))}
                                            </Box>
                                            <Box textAlign="right" color="gray.200">
                                                {tokenFormatAmount(amount)} BPT
                                            </Box>
                                        </>
                                    )}
                                </Box>
                            }
                        />
                    </BeetsBox>

                    <BeetsTransactionStepsSubmit
                        isLoading={loading || steps === null}
                        loadingButtonText="Loading balances..."
                        completeButtonText="Return to pool"
                        onCompleteButtonClick={() => {
                            onClose();
                        }}
                        onSubmit={(id) => {
                            if (id === 'approve') {
                                approve(pool.staking?.address || '');
                            } else if (id === 'stake') {
                                stake(pool.staking?.id || '', amount || '0');
                            }
                        }}
                        onConfirmed={async (id) => {
                            if (id === 'approve') {
                                refetchAllowances();
                            } else if (id === 'stake') {
                                refetchBptBalances();
                            }
                        }}
                        steps={steps || []}
                        queries={[
                            { ...stakeQuery, id: 'stake' },
                            { ...approveQuery, id: 'approve' },
                        ]}
                        isDisabled={!hasValue || !amountIsValid}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
