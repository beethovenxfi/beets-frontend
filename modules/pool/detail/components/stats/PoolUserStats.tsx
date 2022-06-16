import { Divider, HStack, Text, VStack } from '@chakra-ui/layout';
import { usePool } from '../../../lib/usePool';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { usePoolUserPendingRewards } from '~/modules/pool/lib/usePoolUserPendingRewards';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';

export default function PoolUserStats() {
    const { pool, poolTokensWithoutPhantomBpt } = usePool();
    const { investedAmount } = usePoolUserBptBalance();
    const {
        pendingRewards,
        pendingRewardsTotalUSD,
        isLoading: isLoadingPendingRewards,
        refetch,
    } = usePoolUserPendingRewards();

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
                <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                    My Liquidity
                </Text>
                <Text color="white" fontSize="1.75rem">
                    {numeral(investedAmount).format('$0,0.00a')}
                </Text>
            </VStack>
            <VStack spacing="0" alignItems="flex-start">
                <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                    Pending Rewards
                </Text>
                <Text color="white" fontSize="1.75rem">
                    {numeral(pendingRewardsTotalUSD).format('$0,0.00000a')}
                </Text>
            </VStack>
            <VStack spacing="0" alignItems="flex-start">
                <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                    Staked Share
                </Text>
                <VStack spacing="none" alignItems="flex-start">
                    <Text color="white" fontSize="1.75rem">
                        {numeral(0).format('0,0.0000')}
                    </Text>
                    <Text color="white" fontSize="1rem" lineHeight="1rem">
                        {numeral(0).format('0.00%')}
                    </Text>
                </VStack>
            </VStack>
        </VStack>
    );
}
