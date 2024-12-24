import {
    Badge,
    Box,
    Button,
    HStack,
    Portal,
    Skeleton,
    Stack,
    StackDivider,
    Text,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { sumBy } from 'lodash';
import { useEffect, useState } from 'react';
import { BarChart } from 'react-feather';
import { useSwiperSlide } from 'swiper/react';
import { GqlPoolAprTotal } from '~/apollo/generated/graphql-codegen-generated';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { InfoButton } from '~/components/info-button/InfoButton';
import TokenAvatar from '~/components/token/TokenAvatar';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import { useGetTokens } from '~/lib/global/useToken';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { getApr } from '~/lib/util/apr-util';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { usePool } from '~/modules/pool/lib/usePool';
import { useBatchRelayerHasApprovedForAll } from '../lib/useBatchRelayerHasApprovedForAll';
import { useRelicHarvestRewards } from '../lib/useRelicHarvestRewards';
import { useRelicPendingRewards } from '../lib/useRelicPendingRewards';
import useReliquary from '../lib/useReliquary';
import RelicMaturityModal from './RelicMaturityModal';
import { ReliquaryBatchRelayerApprovalButton } from './ReliquaryBatchRelayerApprovalButton';

export default function RelicSlideApr() {
    const { pool } = usePool();
    const { isActive } = useSwiperSlide();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isLoadingRelicPositions, selectedRelicLevel, relicPositions, selectedRelicApr } = useReliquary();

    const {
        data: pendingRewards = [],
        refetch: refetchPendingRewards,
        isLoading: isLoadingPendingRewards,
    } = useRelicPendingRewards();
    const [_isLoadingRelicPositions, setIsLoadingRelicPositions] = useState(false);
    const { harvest, ...harvestQuery } = useRelicHarvestRewards();

    // hack to get around next.js hydration issues with swiper
    useEffect(() => {
        setIsLoadingRelicPositions(isLoadingRelicPositions);
    }, [isLoadingRelicPositions]);

    const { data: batchRelayerHasApprovedForAll, refetch } = useBatchRelayerHasApprovedForAll();
    const { priceForAmount } = useGetTokens();
    const pendingRewardsUsdValue = sumBy(pendingRewards, priceForAmount);

    // show selected relic (beets) apr in tooltip
    const dynamicDataApr = {
        ...pool.dynamicData.apr,
        items: pool.dynamicData.apr.items.map((item) => {
            if (item.title === 'BEETS reward APR' && item.apr.__typename === 'GqlPoolAprRange') {
                return {
                    ...item,
                    apr: {
                        __typename: 'GqlPoolAprTotal',
                        total: selectedRelicApr,
                    } as GqlPoolAprTotal,
                };
            } else {
                return item;
            }
        }),
    };

    return (
        <>
            <Stack
                divider={<StackDivider />}
                left={{ base: '0', lg: '-42.5%' }}
                rounded="md"
                position={{ base: 'relative', lg: 'absolute' }}
                //spacing="4"
                width={{ base: '100%', lg: '60%' }}
                top="0"
                alignItems="flex-start"
                background="box.500"
                boxShadow="0px 0px 0px 1px #00000005,1px 1px 1px -0.5px #0000000F,3px 3px 3px -1.5px #0000000F,6px 6px 6px -3px #0000000F,12px 12px 12px -6px #0000000F,24px 24px 24px -12px #0000001A,-0.5px -1px 0px 0px #FFFFFF26"
                p="4"
                hidden={!isActive}
                as={motion.div}
                animate={{
                    opacity: isActive ? 1 : 0,
                    transform: `scale(${isActive ? '1' : '0.75'})`,
                    transition: { delay: 0.1 },
                }}
                minHeight="310px"
                justifyContent="stretch"
            >
                <VStack alignItems="flex-start" height="50%" w="full" spacing="3">
                    <Text lineHeight="1rem" fontWeight="semibold" fontSize="md" color="beets.base.50">
                        Relic APR
                    </Text>
                    <HStack>
                        <div className="apr-stripes">{getApr(pool.dynamicData.apr.apr)}</div>
                        <AprTooltip onlySparkles data={dynamicDataApr} apr={getApr(pool.dynamicData.apr.apr)} />
                    </HStack>
                    <HStack>
                        <HStack
                            px="3"
                            py="0.5"
                            rounded="md"
                            backgroundColor="beets.light"
                            width={{ base: 'min-content' }}
                            whiteSpace="nowrap"
                        >
                            <Text fontWeight="semibold">Maturity boost</Text>
                            <Badge bg="none" colorScheme="green" p="1">
                                {selectedRelicLevel?.allocationPoints}x
                            </Badge>
                        </HStack>
                        <BeetsTooltip noImage label="Click here to see the maturity curve.">
                            <Button onClick={onOpen} height="full" p="1.5">
                                <BarChart height="18px" />
                            </Button>
                        </BeetsTooltip>
                    </HStack>
                </VStack>
                <VStack alignItems="flex-start" height="50%" w="full" flexGrow="1" pt={{ base: '1', lg: undefined }}>
                    <HStack width="full" spacing="12" alignItems="flex-start" flexGrow="1">
                        <VStack spacing="0" alignItems="flex-start">
                            <InfoButton
                                labelProps={{
                                    lineHeight: '1rem',
                                    fontWeight: 'semibold',
                                    fontSize: 'sm',
                                }}
                                label="My pending rewards"
                                infoText={`Your accumulated liquidity incentives for this relic. At any time you can claim your rewards as long as the amount is more than $0.01`}
                            />
                            {isLoadingPendingRewards ? (
                                <Skeleton height="34px" width="140px" mt="4px" mb="4px" />
                            ) : (
                                <Text color="white" fontSize="1.75rem">
                                    {numberFormatUSDValue(pendingRewardsUsdValue)}
                                </Text>
                            )}
                            <Box>
                                {pendingRewards.map((reward, index) => (
                                    <HStack
                                        key={index}
                                        spacing="1"
                                        mb={index === pendingRewards.length - 1 ? '0' : '0.5'}
                                    >
                                        <TokenAvatar height="20px" width="20px" address={reward.address} />
                                        <Skeleton isLoaded={!isLoadingPendingRewards}>
                                            <Text fontSize="1rem" lineHeight="1rem">
                                                {tokenFormatAmount(reward.amount)}
                                            </Text>
                                        </Skeleton>
                                    </HStack>
                                ))}
                            </Box>
                        </VStack>
                    </HStack>
                    {!batchRelayerHasApprovedForAll ? (
                        <BeetsTooltip label="To claim your pending rewards, you first need to approve the batch relayer.">
                            <Box w="full">
                                <ReliquaryBatchRelayerApprovalButton
                                    onConfirmed={() => {
                                        refetch();
                                    }}
                                />
                            </Box>
                        </BeetsTooltip>
                    ) : (
                        <BeetsSubmitTransactionButton
                            fullWidth
                            width="full"
                            variant="primary"
                            {...harvestQuery}
                            onClick={harvest}
                            onConfirmed={() => {
                                refetchPendingRewards();
                            }}
                            disabled={pendingRewardsUsdValue < 0.01}
                        >
                            Claim now
                        </BeetsSubmitTransactionButton>
                    )}
                </VStack>
            </Stack>
            <Portal>
                <RelicMaturityModal isOpen={isOpen} onClose={onClose} />
            </Portal>
        </>
    );
}
