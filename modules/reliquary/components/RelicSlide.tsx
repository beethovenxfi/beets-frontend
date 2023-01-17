import { useSwiper, useSwiperSlide } from 'swiper/react';
import { useEffect, useState } from 'react';
import { Badge, Box, Heading, HStack, Image, Skeleton, VStack, Text, Flex, Button } from '@chakra-ui/react';
import useReliquary from '../lib/useReliquary';
import { AnimatePresence, motion } from 'framer-motion';
import { ReliquaryFarmPosition, reliquaryService } from '~/lib/services/staking/reliquary.service';
import AnimatedProgress from '~/components/animated-progress/AnimatedProgress';
import { relicGetMaturityProgress } from '../lib/reliquary-helpers';
import Countdown from 'react-countdown';
import RelicLevelUpButton from './RelicLevelUpButton';
import { useQuery } from 'react-query';
import { getProvider } from '@wagmi/core';
import { PoolInvestModal } from '~/modules/pool/invest/PoolInvestModal';
import { PoolWithdrawModal } from '~/modules/pool/withdraw/PoolWithdrawModal';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { useRelicDepositBalance } from '../lib/useRelicDepositBalance';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { BeetsBox } from '~/components/box/BeetsBox';
import { TokenAmountPill } from '~/components/token/TokenAmountPill';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import RelicSlideApr from './RelicSlideApr';
import RelicSlideInfo from './RelicSlideInfo';

export interface RelicSlideProps {
    relic: ReliquaryFarmPosition;
}

export default function RelicSlide({ relic }: RelicSlideProps) {
    const swiper = useSwiper();
    const { isActive } = useSwiperSlide();
    const [showRelicInfo, setShowRelicInfo] = useState(false);

    const {
        maturityThresholds,
        selectedRelic,
        selectedRelicId,
        isLoadingRelicPositions,
        setSelectedRelicId,
        relicPositions,
    } = useReliquary();
    const { progressToNextLevel, levelUpDate, canUpgrade } = relicGetMaturityProgress(
        selectedRelic,
        maturityThresholds,
    );
    const config = useNetworkConfig();
    const { relicBalanceUSD } = useRelicDepositBalance();
    const [_isLoadingRelicPositions, setIsLoadingRelicPositions] = useState(false);

    // hack to get around next.js hydration issues with swiper
    useEffect(() => {
        setIsLoadingRelicPositions(isLoadingRelicPositions);
    }, [isLoadingRelicPositions]);

    const hasNoRelics = relicPositions.length === 0;

    const { data: nftURI = '' } = useQuery(['relicNFT', { selectedRelicId, isLoadingRelicPositions }], async () => {
        if (!_isLoadingRelicPositions && hasNoRelics) {
            return 'https://beethoven-assets.s3.eu-central-1.amazonaws.com/reliquary/9.png';
        }
        if (selectedRelicId) {
            return await reliquaryService.getRelicNFT({ tokenId: selectedRelicId, provider: getProvider() });
        }
    });

    const handleClick = (isNext: boolean) => {
        if (isActive) return;
        const relicPositionIndex = relicPositions.findIndex((position) => position.relicId === relic.relicId);

        if (isNext) {
            setSelectedRelicId(relicPositions[relicPositionIndex + 1].relicId);
        } else {
            setSelectedRelicId(relicPositions[relicPositionIndex - 1].relicId);
        }
    };

    function getContainerOpacity() {
        if (hasNoRelics) {
            return 0.25;
        }
        if (isActive) {
            return 1;
        } else {
            return 0.35;
        }
    }

    function getUnderglowClass() {
        if (isActive) return '';
        if (isActive) {
            return 'relic-glow';
        }
        return '';
    }

    return (
        <AnimatePresence>
            <VStack
                filter="auto"
                blur={hasNoRelics ? '10px' : '0'}
                as={motion.div}
                animate={{
                    opacity: getContainerOpacity(),
                    transform: isActive ? 'scale(1)' : 'scale(0.5)',
                    transition: { type: 'spring', mass: 0.1 },
                }}
                rounded="lg"
                spacing="8"
            >
                <Flex justifyContent="center" width={{ base: '100%', lg: '47.5%' }} rounded="lg">
                    <HStack spacing="4" width="full" alignItems="start">
                        <Badge rounded="md" colorScheme="green" p="2">
                            <Heading textAlign="center" size="sm">
                                Level {relic?.level} - Baby Boo
                            </Heading>
                        </Badge>
                        <Badge p="2" rounded="md" colorScheme="purple">
                            <Heading size="sm">Relic #{relic?.relicId}</Heading>
                        </Badge>
                    </HStack>
                </Flex>
                <Flex position="relative" className={getUnderglowClass()} as={motion.div}>
                    {canUpgrade && isActive && (
                        <Flex
                            animate={{ opacity: 1 }}
                            initial={{ opacity: 0 }}
                            exit={{ opacity: 0 }}
                            alignItems="center"
                            justifyContent="center"
                            rounded="lg"
                            width="full"
                            height="full"
                            position="absolute"
                            bg="blackAlpha.500"
                            as={motion.div}
                            zIndex={2}
                        >
                            <RelicLevelUpButton />
                        </Flex>
                    )}

                    <Box
                        filter="auto"
                        blur={isActive && canUpgrade && !_isLoadingRelicPositions ? '10px' : '0px'}
                        style={{ marginTop: '0 !important' }}
                        rounded="lg"
                        overflow="hidden"
                    >
                        {_isLoadingRelicPositions && (
                            <Skeleton>
                                <Image height="400px" width="400px" src={nftURI} />
                            </Skeleton>
                        )}
                        {!_isLoadingRelicPositions && <Image height="400px" width="400px" src={nftURI} />}
                    </Box>
                </Flex>
                <Box position="relative" width="full">
                    <RelicSlideApr />
                    {isActive && !_isLoadingRelicPositions && (
                        <Box position="relative" width="full">
                            {relicPositions.length > 1 && (
                                <Button
                                    px="2"
                                    zIndex={2}
                                    position="absolute"
                                    left="3rem"
                                    top="50%"
                                    transform="translateY(-50%)"
                                    onClick={() => swiper.slidePrev()}
                                >
                                    <ChevronLeft />
                                </Button>
                            )}

                            <VStack
                                as={motion.div}
                                animate={{ opacity: 1, transform: 'scale(1)', transition: { delay: 0.1 } }}
                                initial={{ opacity: 0, transform: 'scale(0.75)' }}
                                exit={{ opacity: 0, transform: 'scale(0.75)' }}
                                overflow="hidden"
                                width="full"
                                position="relative"
                            >
                                <Box width={{ base: '100%', lg: '60%' }} rounded="lg" background="whiteAlpha.200" p="4">
                                    <VStack spacing="3" width="full">
                                        <VStack width="full" spacing="4">
                                            <VStack alignItems="flex-start" spacing="4" rounded="lg" width="full">
                                                <VStack spacing="1" alignItems="flex-start">
                                                    <Box>
                                                        <Text
                                                            lineHeight="1rem"
                                                            fontWeight="semibold"
                                                            fontSize="md"
                                                            color="beets.base.50"
                                                        >
                                                            Relic liquidity
                                                        </Text>
                                                        <Text color="white" fontSize="1.75rem">
                                                            {numberFormatUSDValue(relicBalanceUSD)}
                                                        </Text>
                                                    </Box>
                                                    <BeetsBox>
                                                        <TokenAmountPill
                                                            key={`relic-token-${config.fbeets.address}`}
                                                            address={config.fbeets.address}
                                                            amount={selectedRelic?.amount || '0'}
                                                        />
                                                        {/* <Box display={{ base: 'block', md: 'flex' }}>
                                                                    {relicTokenBalances &&
                                                                        relicTokenBalances.map((token) => (
                                                                            <TokenAmountPill
                                                                                mt={{ base: '2', md: '0' }}
                                                                                ml={{ base: '0', md: '1' }}
                                                                                key={`relic-token-${token.address}`}
                                                                                address={token.address}
                                                                                amount={token.amount}
                                                                            />
                                                                        ))}
                                                                </Box> */}
                                                    </BeetsBox>
                                                </VStack>
                                                <VStack spacing="1" width="full" alignItems="flex-start">
                                                    <HStack spacing="1" color="beets.green">
                                                        <Text>Next level in</Text>
                                                        <Countdown date={levelUpDate} />
                                                    </HStack>
                                                    <AnimatedProgress
                                                        rounded="none"
                                                        color="black"
                                                        width="full"
                                                        value={progressToNextLevel}
                                                    />
                                                </VStack>
                                            </VStack>
                                            <HStack width="full">
                                                <PoolInvestModal
                                                    activatorLabel="Deposit"
                                                    activatorProps={{
                                                        width: 'full',
                                                        size: 'sm',
                                                        rounded: 'lg',
                                                        disabled: hasNoRelics,
                                                    }}
                                                />
                                                <PoolWithdrawModal
                                                    activatorProps={{
                                                        width: 'full',
                                                        size: 'sm',
                                                        rounded: 'lg',
                                                        disabled: hasNoRelics,
                                                    }}
                                                />
                                            </HStack>
                                        </VStack>
                                    </VStack>
                                </Box>
                            </VStack>

                            {relicPositions.length > 1 && (
                                <Button
                                    px="2"
                                    zIndex={2}
                                    position="absolute"
                                    right="3rem"
                                    top="50%"
                                    transform="translateY(-50%)"
                                    onClick={() => swiper.slideNext()}
                                >
                                    <ChevronRight />
                                </Button>
                            )}
                        </Box>
                    )}
                    <RelicSlideInfo />
                </Box>
            </VStack>
        </AnimatePresence>
    );
}
