import { Box, Divider, HStack, Text, VStack } from '@chakra-ui/layout';
import { usePool } from '../../../lib/usePool';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { usePoolUserPendingRewards } from '~/modules/pool/lib/usePoolUserPendingRewards';
import { InfoButton } from '~/components/info-button/InfoButton';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { usePoolUserDepositBalance } from '~/modules/pool/lib/usePoolUserDepositBalance';
import { usePoolUserHarvestPendingRewards } from '~/modules/pool/lib/usePoolUserHarvestPendingRewards';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { useGetTokens } from '~/lib/global/useToken';

export default function PoolUserStats() {
    const { pool } = usePool();
    const { pendingRewards, pendingRewardsTotalUSD } = usePoolUserPendingRewards();
    const { userPoolBalanceUSD } = usePoolUserDepositBalance();
    const { harvest, ...harvestQuery } = usePoolUserHarvestPendingRewards();
    const { getToken } = useGetTokens();

    return (
        <VStack spacing="4" width="full" alignItems="flex-start" flex={1}>
            <VStack spacing="0" alignItems="flex-start">
                <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                    My APR
                </Text>
                <HStack>
                    <div className="apr-stripes">{numeral(pool.dynamicData.apr.total).format('0.00%')}</div>
                    <AprTooltip onlySparkles data={pool.dynamicData.apr} />
                </HStack>
            </VStack>
            <Divider />
            <VStack spacing="0" alignItems="flex-start">
                <InfoButton
                    label="My liquidity"
                    infoText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pharetra, sapien eu ultrices mollis, metus libero maximus elit."
                    labelProps={{
                        lineHeight: '1rem',
                        fontWeight: 'semibold',
                        fontSize: 'sm',
                        color: 'beets.base.50',
                    }}
                />
                <Text color="white" fontSize="1.75rem">
                    {numeral(userPoolBalanceUSD).format('$0,0.00a')}
                </Text>
            </VStack>
            <VStack spacing="0" alignItems="flex-start">
                <InfoButton
                    label="Staked share"
                    infoText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pharetra, sapien eu ultrices mollis, metus libero maximus elit."
                    labelProps={{
                        lineHeight: '1rem',
                        fontWeight: 'semibold',
                        fontSize: 'sm',
                        color: 'beets.base.50',
                    }}
                />
                <VStack spacing="none" alignItems="flex-start">
                    <Text color="white" fontSize="1.75rem">
                        {numeral(0).format('0,0.0000')}
                    </Text>
                    <Text fontSize="1rem" lineHeight="1rem">
                        {numeral(0).format('0.00%')}
                    </Text>
                </VStack>
            </VStack>
            <VStack spacing="0" alignItems="flex-start">
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
                    {numberFormatUSDValue(pendingRewardsTotalUSD)}
                </Text>
                {pendingRewards.map((reward, index) => (
                    <Text key={index} fontSize="1rem" lineHeight="1rem">
                        {numeral(reward.amount).format('0.0[0000]')} {getToken(reward.address)?.symbol}
                    </Text>
                ))}
            </VStack>
            <Box width="full">
                <BeetsSubmitTransactionButton
                    {...harvestQuery}
                    isDisabled={pendingRewardsTotalUSD < 0.01}
                    onClick={() => harvest()}
                    width="full"
                >
                    Claim rewards
                </BeetsSubmitTransactionButton>
            </Box>
        </VStack>
    );
}
