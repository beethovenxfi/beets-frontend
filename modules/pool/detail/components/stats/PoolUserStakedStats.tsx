import { GqlPoolStaking } from '~/apollo/generated/graphql-codegen-generated';
import { Box, HStack, Text, VStack } from '@chakra-ui/layout';
import { InfoButton } from '~/components/info-button/InfoButton';
import numeral from 'numeral';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import TokenAvatar from '~/components/token/TokenAvatar';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { usePoolUserPendingRewards } from '~/modules/pool/lib/usePoolUserPendingRewards';
import { usePoolUserHarvestPendingRewards } from '~/modules/pool/lib/usePoolUserHarvestPendingRewards';
import { useStakingTotalStakedBalance } from '~/lib/global/useStakingTotalStakedBalance';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { Skeleton } from '@chakra-ui/react';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';

interface Props {
    poolAddress: string;
    staking: GqlPoolStaking;
}

export function PoolUserStakedStats({ poolAddress, staking }: Props) {
    const {
        pendingRewards,
        pendingRewardsTotalUSD,
        hasPendingRewards,
        refetch: refetchPendingRewards,
        isLoading: isLoadingPendingRewards,
    } = usePoolUserPendingRewards();
    const { harvest, ...harvestQuery } = usePoolUserHarvestPendingRewards();
    const { data, isLoading: isLoadingTotalStakedBalance } = useStakingTotalStakedBalance(poolAddress, staking);
    const { userStakedBptBalance, isLoading: isLoadingUserBptBalance } = usePoolUserBptBalance();
    const { refetch: refetchUserTokenBalances } = usePoolUserTokenBalancesInWallet();
    const isLoadingStake = isLoadingTotalStakedBalance || isLoadingUserBptBalance;

    return (
        <>
            <VStack spacing="0" alignItems="flex-start" mb="4">
                <InfoButton
                    label="My staked share"
                    infoText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pharetra, sapien eu ultrices mollis, metus libero maximus elit."
                    labelProps={{
                        lineHeight: '1rem',
                        fontWeight: 'semibold',
                        fontSize: 'sm',
                        color: 'beets.base.50',
                    }}
                />
                <VStack spacing="none" alignItems="flex-start">
                    {isLoadingStake ? (
                        <Skeleton height="34px" width="140px" mt="4px" mb="4px" />
                    ) : (
                        <Text color="white" fontSize="1.75rem">
                            {numeral(userStakedBptBalance).format('0,0.0000')}{' '}
                            <Text as="span" fontSize="md" color="beets.base.50">
                                BPT
                            </Text>
                        </Text>
                    )}
                    {isLoadingStake ? (
                        <Skeleton height="16px" width="45px" />
                    ) : (
                        <Text fontSize="1rem" lineHeight="1rem">
                            {numeral(parseFloat(userStakedBptBalance) / parseFloat(data || '1')).format('0.00%')}
                        </Text>
                    )}
                </VStack>
            </VStack>
            <VStack spacing="0" alignItems="flex-start" flex="1" mb="4">
                <InfoButton
                    label="Pending rewards"
                    infoText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pharetra, sapien eu ultrices mollis, metus libero maximus elit."
                    labelProps={{
                        lineHeight: '1rem',
                        fontWeight: 'semibold',
                        fontSize: 'sm',
                        color: 'beets.base.50',
                    }}
                />
                <Text color="white" fontSize="1.75rem">
                    {isLoadingPendingRewards ? (
                        <Skeleton height="34px" width="140px" mt="4px" mb="4px" />
                    ) : (
                        numberFormatUSDValue(pendingRewardsTotalUSD)
                    )}
                </Text>
                {pendingRewards.map((reward, index) => (
                    <HStack key={index} spacing="1">
                        <TokenAvatar size="xs" address={reward.address} />
                        <Skeleton isLoaded={!isLoadingPendingRewards}>
                            <Text fontSize="1rem" lineHeight="1rem">
                                {tokenFormatAmount(reward.amount)}
                            </Text>
                        </Skeleton>
                    </HStack>
                ))}
            </VStack>
            <Box width="full">
                <BeetsSubmitTransactionButton
                    {...harvestQuery}
                    isDisabled={!hasPendingRewards}
                    onClick={() => harvest()}
                    onConfirmed={() => {
                        refetchPendingRewards();
                        refetchUserTokenBalances();
                    }}
                    width="full"
                >
                    Claim rewards
                </BeetsSubmitTransactionButton>
            </Box>
        </>
    );
}
