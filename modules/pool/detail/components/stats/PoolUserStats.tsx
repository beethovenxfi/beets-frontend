import { Box, Divider, HStack, Text, VStack } from '@chakra-ui/layout';
import { usePool } from '../../../lib/usePool';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { InfoButton } from '~/components/info-button/InfoButton';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { usePoolUserDepositBalance } from '~/modules/pool/lib/usePoolUserDepositBalance';
import { Flex, Skeleton } from '@chakra-ui/react';
import { PoolUserStakedStats } from '~/modules/pool/detail/components/stats/PoolUserStakedStats';

export default function PoolUserStats() {
    const { pool } = usePool();
    const { userPoolBalanceUSD, isLoading } = usePoolUserDepositBalance();

    return (
        <Flex width="full" alignItems="flex-start" flex={1} flexDirection="column">
            <VStack spacing="0" alignItems="flex-start" mb="4">
                <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                    My APR
                </Text>
                <HStack>
                    <div className="apr-stripes">{numeral(pool.dynamicData.apr.total).format('0.00%')}</div>
                    <AprTooltip onlySparkles data={pool.dynamicData.apr} />
                </HStack>
            </VStack>
            <Divider mb="4" />
            <VStack spacing="0" alignItems="flex-start" mb="4">
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
                {isLoading ? (
                    <Box>
                        <Skeleton height="34px" width="140px" mt="4px" mb="4px" />
                    </Box>
                ) : (
                    <Text color="white" fontSize="1.75rem">
                        {numberFormatUSDValue(userPoolBalanceUSD)}
                    </Text>
                )}
            </VStack>
            {pool.staking && <PoolUserStakedStats poolAddress={pool.address} staking={pool.staking} />}
        </Flex>
    );
}
