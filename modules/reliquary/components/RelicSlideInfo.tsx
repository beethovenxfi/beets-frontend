import { useSwiperSlide } from 'swiper/react';
import { useEffect, useState } from 'react';
import { HStack, Skeleton, VStack, Text, Tooltip, Stack, StackDivider } from '@chakra-ui/react';
import useReliquary from '../lib/useReliquary';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import numeral from 'numeral';
import { InfoButton } from '~/components/info-button/InfoButton';
import TokenAvatar from '~/components/token/TokenAvatar';
import { useRelicPendingRewards } from '../lib/useRelicPendingRewards';
import { sumBy } from 'lodash';
import { useGetTokens } from '~/lib/global/useToken';
import { useRelicHarvestRewards } from '../lib/useRelicHarvestRewards';
import { useReliquaryGlobalStats } from '../lib/useReliquaryGlobalStats';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { networkConfig } from '~/lib/config/network-config';
import { motion } from 'framer-motion';

export default function RelicSlideInfo() {
    const { isActive } = useSwiperSlide();
    const { isLoadingRelicPositions, selectedRelicLevel, selectedRelic, weightedTotalBalance, beetsPerDay, isLoading } =
        useReliquary();
    const { priceForAmount } = useGetTokens();
    const config = useNetworkConfig();

    const { data: globalStats, loading: isLoadingGlobalStats } = useReliquaryGlobalStats();
    const weightedRelicAmount = parseFloat(selectedRelic?.amount || '0') * (selectedRelicLevel?.allocationPoints || 0);
    const relicShare = globalStats && selectedRelic ? weightedRelicAmount / weightedTotalBalance : 0;
    const relicBeetsPerDay = beetsPerDay * relicShare;
    const relicYieldPerDay = priceForAmount({ address: config.beets.address, amount: `${relicBeetsPerDay}` });

    const { data: pendingRewards = [], refetch: refetchPendingRewards } = useRelicPendingRewards();
    const [_isLoadingRelicPositions, setIsLoadingRelicPositions] = useState(false);
    const { harvest } = useRelicHarvestRewards();

    // hack to get around next.js hydration issues with swiper
    useEffect(() => {
        setIsLoadingRelicPositions(isLoadingRelicPositions);
    }, [isLoadingRelicPositions]);

    return (
        <Stack
            divider={<StackDivider />}
            right={{ base: '0', lg: '-41.25%' }}
            height="full"
            top="0"
            rounded="md"
            position={{ base: 'relative', lg: 'absolute' }}
            spacing="4"
            width={{ base: '100%', lg: '60%' }}
            alignItems="flex-start"
            background="whiteAlpha.200"
            p="4"
            hidden={!isActive}
            as={motion.div}
            animate={{
                opacity: isActive ? 1 : 0,
                transform: `scale(${isActive ? '1' : '0.75'})`,
                transition: { delay: 0.1 },
            }}
        >
            <VStack spacing="0" h="50%" w="full" alignItems="flex-start">
                <InfoButton
                    labelProps={{
                        lineHeight: '1rem',
                        fontWeight: 'semibold',
                        fontSize: 'md',
                        color: 'beets.base.50',
                    }}
                    label="Relic share"
                    infoText={`The size of your relic relative to all value stored in relics. Your staked share represents the percent of liquidity incentives you are entitled to.`}
                />
                <VStack alignItems="flex-start">
                    {isLoading || isLoadingGlobalStats ? (
                        <Skeleton height="34px" width="140px" mt="4px" mb="4px" />
                    ) : (
                        <Text color="white" fontSize="1.75rem">
                            {relicShare < 0.0001 ? '< 0.01%' : numeral(relicShare).format('0.00%')}
                        </Text>
                    )}
                    {isLoading || isLoadingGlobalStats ? (
                        <Skeleton height="16px" width="45px" />
                    ) : (
                        <Text fontSize="1rem" lineHeight="1rem">
                            {numeral(weightedRelicAmount).format('0.00a')}
                            {' / '}
                            {numeral(weightedTotalBalance).format('0.00a')}{' '}
                            <Text as="span" fontSize="md" color="beets.base.50">
                                maBEETS
                            </Text>
                        </Text>
                    )}
                </VStack>
            </VStack>
            <VStack spacing="0" h="50%" w="full" alignItems="flex-start">
                <InfoButton
                    labelProps={{
                        lineHeight: '1rem',
                        fontWeight: 'semibold',
                        fontSize: 'sm',
                        color: 'beets.base.50',
                    }}
                    label="My potential daily yield"
                    infoText="The potential daily value is an approximation based on swap fees, current token prices and your staked share. A number of external factors can influence this value from second to second."
                />
                {isLoading ? (
                    <Skeleton height="34px" width="140px" mt="4px" mb="4px" />
                ) : (
                    <Text color="white" fontSize="1.75rem">
                        {numberFormatUSDValue(relicYieldPerDay)}
                    </Text>
                )}
                {beetsPerDay > 0 && (
                    <HStack spacing="1" mb="0.5">
                        <TokenAvatar height="20px" width="20px" address={networkConfig.beets.address} />
                        <Tooltip label={`BEETS emissions for reliquary are calculated per second.`}>
                            <Text fontSize="1rem" lineHeight="1rem">
                                {numeral(relicShare * beetsPerDay).format('0,0.000')} / day
                            </Text>
                        </Tooltip>
                    </HStack>
                )}
            </VStack>
        </Stack>
    );
}
