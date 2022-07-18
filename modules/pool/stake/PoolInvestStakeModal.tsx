import { Box, Flex, Heading, Input, InputGroup, Link, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { numberLimitInputToNumDecimals } from '~/lib/util/number-formats';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { Modal, ModalBody, ModalCloseButton, ModalContent } from '@chakra-ui/modal';
import { networkConfig } from '~/lib/config/network-config';
import { capitalize } from 'lodash';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { usePool } from '~/modules/pool/lib/usePool';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { useApproveToken } from '~/lib/util/useApproveToken';
import { useMasterChefDepositIntoFarm } from '~/lib/global/useMasterChefDepositIntoFarm';
import { FadeInOutBox } from '~/components/animation/FadeInOutBox';
import { BeetsSkeleton } from '~/components/skeleton/BeetsSkeleton';
import { usePoolUserStakingAllowance } from '~/modules/pool/stake/lib/usePoolUserStakingAllowance';
import { BeetsTransactionStepsSubmit, TransactionStep } from '~/components/button/BeetsTransactionStepsSubmit';

interface Props {
    isOpen: boolean;
    onOpen(): void;
    onClose(): void;
}

export function PoolInvestStakeModal({ isOpen, onOpen, onClose }: Props) {
    const {
        userWalletBptBalance,
        hasBptInWallet,
        isLoading: isLoadingBalances,
        isRefetching: isRefetchingBalances,
        refetch: refetchBptBalances,
    } = usePoolUserBptBalance();
    const [amount, setAmount] = useState(userWalletBptBalance);
    const hasValue = hasBptInWallet && amount !== '';
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
                        The balance below indicates the amount of pool tokens (BPT) that you have in your wallet. To
                        maximize your rewards, stake your BPT into the {networkConfig.farmTypeName}.
                    </Text>
                    <InputGroup>
                        <Input
                            type="number"
                            placeholder={'0.0'}
                            textAlign="right"
                            size="lg"
                            value={amount}
                            onChange={(e) => {
                                setAmount(numberLimitInputToNumDecimals(e.target.value));
                            }}
                            isInvalid={!amountIsValid}
                            border="2px"
                            _hover={{ borderColor: 'gray.200' }}
                            _placeholder={{ color: 'gray.400' }}
                        />
                    </InputGroup>
                    {isLoadingBalances || isRefetchingBalances ? (
                        <BeetsSkeleton width="140px" height="20px" mt="2" mb="8" />
                    ) : (
                        <Flex mt="1" mb="8">
                            <Box flex={1}>
                                <Text color="gray.200">
                                    Balance: {tokenFormatAmount(userWalletBptBalance)}
                                    {hasBptInWallet ? (
                                        <Link
                                            ml={2}
                                            color="beets.cyan"
                                            userSelect="none"
                                            onClick={() => {
                                                setAmount(userWalletBptBalance);
                                            }}
                                        >
                                            Max
                                        </Link>
                                    ) : null}
                                </Text>
                            </Box>
                            <FadeInOutBox isVisible={!amountIsValid} color="red.500">
                                Exceeds wallet balance
                            </FadeInOutBox>
                        </Flex>
                    )}

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
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
