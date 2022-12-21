import { Box, Button, Divider, Flex, Heading, HStack, Progress, StackDivider, Text, VStack } from '@chakra-ui/react';
import { getProvider } from '@wagmi/core';
import { motion, useAnimation } from 'framer-motion';
import numeral from 'numeral';
import React, { useEffect, useState } from 'react';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import { ReliquaryFarmPosition, ReliquaryService } from '~/lib/services/staking/reliquary.service';
import { PoolInvestModal } from '~/modules/pool/invest/PoolInvestModal';
import { PoolWithdrawModal } from '~/modules/pool/withdraw/PoolWithdrawModal';
import useReliquary from '../hooks/useReliquary';
import ReliquaryInvest from './ReliquaryInvest';
import BeetsThinking from '~/assets/icons/beetx-thinking.svg';
import Image from 'next/image';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import { BeetsBox } from '~/components/box/BeetsBox';
import Card from '~/components/card/Card';
import AnimatedProgress from '~/components/animated-progress/AnimatedProgress';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { usePoolUserDepositBalance } from '~/modules/pool/lib/usePoolUserDepositBalance';
import { TokenAmountPill } from '~/components/token/TokenAmountPill';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { usePool } from '~/modules/pool/lib/usePool';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { useReliquaryLevelUp } from '../hooks/useReliquaryLevelUp';

interface Props {
    positions: ReliquaryFarmPosition[];
}

function getMaturityProgress(relic: ReliquaryFarmPosition, maturities: string[]) {
    if (!relic || !maturities.length) {
        return {
            canUpgrade: false,
            canUpgradeTo: -1,
            progressToNextLevel: 0,
        };
    }
    const relicMaturityStart = relic.entry;
    const timeElapsedSinceStart = Date.now() / 1000 - relicMaturityStart;
    const nextLevelMaturityIndex = maturities.findIndex((maturity) => timeElapsedSinceStart < parseInt(maturity, 10));
    const isMaxMaturity = timeElapsedSinceStart > parseInt(maturities[maturities.length - 1], 10);
    const canUpgradeTo = isMaxMaturity ? maturities.length : nextLevelMaturityIndex + 1;
    const canUpgrade =
        (isMaxMaturity && relic.level < maturities.length) ||
        (nextLevelMaturityIndex > 0 && nextLevelMaturityIndex > relic.level);

    const currentLevelMaturity = parseInt(maturities[relic.level], 10);
    const timeElapsedSinceCurrentLevel = Date.now() - currentLevelMaturity;
    const timeBetweenCurrentAndNextLevel = parseInt(maturities[relic.level + 1], 10) - currentLevelMaturity;
    const progressToNextLevel = canUpgrade
        ? 100
        : (timeElapsedSinceCurrentLevel / timeBetweenCurrentAndNextLevel) * 100;

    return {
        canUpgrade,
        canUpgradeTo,
        progressToNextLevel,
    };
}

export default function ReliquaryNFT() {
    const controls = useAnimation();
    const [imageURI, setImageURI] = useState('');
    const [depositOrWithdraw, setDepositOrWithdraw] = useState<'deposit' | 'withdraw'>();
    const { reliquaryService, maturityThresholds, relicPositions = [] } = useReliquary();
    const { levelUp } = useReliquaryLevelUp();
    const { data, userPoolBalanceUSD } = usePoolUserDepositBalance();
    const { pool } = usePool();

    const { canUpgrade, canUpgradeTo, progressToNextLevel } = getMaturityProgress(
        relicPositions[0],
        maturityThresholds,
    );
    const { showToast } = useToast();
    const hoverNFT = async (translate: number) => {
        controls.start({
            transform: `translateY(${translate}px)`,
            transition: { type: 'spring', mass: 15, damping: 15 },
        });
        setTimeout(() => {
            hoverNFT(translate > 0 ? -1 : 1);
        }, 1250);
    };

    const startAnimation = async () => {
        await controls.start({
            transform: 'scale(1)',
            opacity: 1,
            transition: { type: 'spring', mass: 0.5, damping: 15 },
        });
        hoverNFT(1);
    };

    const fetchNFT = async () => {
        const imageURI = await reliquaryService.getRelicNFT({ tokenId: '1', provider: getProvider() });
        setImageURI(imageURI);
    };

    useEffect(() => {
        if (canUpgrade) {
            showToast({
                id: 'level-up-toast',
                content: (
                    <HStack>
                        <Text>You can level up your relic to level {canUpgradeTo}</Text>
                        <Button size="sm" onClick={() => levelUp(parseInt(relic.relicId, 10))}>
                            Level Up
                        </Button>
                    </HStack>
                ),
                type: ToastType.Success,
            });
        }
    }, [canUpgrade]);

    useEffect(() => {
        fetchNFT();
        setTimeout(() => {
            startAnimation();
        }, 500);
    }, []);

    const relic = relicPositions && relicPositions[0];
    return (
        <VStack width="full" alignItems="center">
            <HStack width="full" alignItems="flex-start" spacing="0" height="full">
                <VStack alignItems="flex-start" mt="8" spacing="4" width="40%">
                    {/* <VStack alignItems="flex-start" marginTop="4" width="full">
                        <Heading size="lg">Your relic</Heading>
                        <Divider borderColor="whiteAlpha.400" />
                    </VStack> */}
                    <Heading size="lg">Relic #{relic.relicId}</Heading>

                    <Card p="4" width="full">
                        <VStack width="full" spacing="8" justifyContent="flex-start">
                            <VStack width="full" spacing="0" alignItems="flex-start">
                                <Heading lineHeight="1rem" fontWeight="semibold" size="" color="beets.base.50">
                                    Relic APR
                                </Heading>
                                <HStack>
                                    <div className="apr-stripes">
                                        {numeral(pool.dynamicData.apr.total).format('0.00%')}
                                    </div>
                                    <AprTooltip onlySparkles data={pool.dynamicData.apr} />
                                </HStack>
                                <Text color="orange">1.8x maturity boost</Text>
                            </VStack>
                            <HStack width="full" spacing="12" alignItems="flex-start">
                                <VStack spacing="0" alignItems="flex-start">
                                    <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                                        Claimabe Rewards
                                    </Text>
                                    <Text color="white" fontSize="1.75rem">
                                        {numberFormatUSDValue(999.99)}
                                    </Text>
                                </VStack>
                            </HStack>
                        </VStack>
                        <Button mt="4" width="full" variant="primary">
                            Claim now
                        </Button>
                    </Card>
                    <Card p="4" width="full">
                        <VStack spacing="8">
                            <HStack width="full" spacing="12" alignItems="flex-start">
                                <VStack spacing="0" alignItems="flex-start">
                                    <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                                        Total Liquidity
                                    </Text>
                                    <Text color="white" fontSize="1.75rem">
                                        {numberFormatUSDValue(userPoolBalanceUSD)}
                                    </Text>
                                </VStack>
                                <VStack spacing="0" alignItems="flex-start">
                                    <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                                        Deposited BPT
                                    </Text>
                                    <HStack>
                                        <Text color="white" fontSize="1.75rem">
                                            {numeral(relic.amount).format('0.0000')}
                                        </Text>
                                    </HStack>
                                </VStack>
                            </HStack>
                            <HStack width="full" alignItems="flex-start">
                                <VStack spacing="0" alignItems="flex-start">
                                    <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                                        Relic level
                                    </Text>
                                    <Text color="white" fontSize="1.75rem">
                                        {relic.level + 1}
                                    </Text>
                                </VStack>
                            </HStack>
                            <VStack width="full" spacing="3" alignItems="flex-start">
                                <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                                    Token breakdown
                                </Text>
                                <HStack>
                                    {data &&
                                        data.map((token) => (
                                            <TokenAmountPill
                                                key={`relic-token-${token.address}`}
                                                address={token.address}
                                                amount={token.amount}
                                            />
                                        ))}
                                </HStack>
                            </VStack>
                        </VStack>
                    </Card>
                    <Card p="4" width="full">
                        <VStack spacing="8">
                            <HStack width="full" spacing="12" alignItems="flex-start">
                                <VStack spacing="0" alignItems="flex-start">
                                    <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                                        Achievements
                                    </Text>
                                </VStack>
                            </HStack>
                        </VStack>
                    </Card>
                    <Card p="4" width="full">
                        <VStack spacing="8">
                            <HStack width="full" spacing="12" alignItems="flex-start">
                                <VStack spacing="0" alignItems="flex-start">
                                    <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                                        Maturity
                                    </Text>
                                </VStack>
                            </HStack>
                        </VStack>
                    </Card>
                    {/* <Box backgroundColor="whiteAlpha.100" py="3" px="4" rounded="md">
                    <HStack divider={<StackDivider borderColor="whiteAlpha.100" />} spacing="8">
                        <VStack spacing="0" alignItems="flex-start">
                            <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                                Minimum APR
                            </Text>
                            <HStack>
                                <div className="apr-stripes">{numeral('0.4').format('0.00%')}</div>
                            </HStack>
                        </VStack>
                        <VStack spacing="0" alignItems="flex-start">
                            <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                                Maximum APR
                            </Text>
                            <HStack>
                                <div className="apr-stripes">{numeral('0.4').format('0.00%')}</div>
                            </HStack>
                        </VStack>
                        <VStack spacing="0" alignItems="flex-start">
                            <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                                Total Relics Minted
                            </Text>
                            <HStack>
                                <div className="apr-stripes">{numeral('4').format('0')}</div>
                            </HStack>
                        </VStack>
                    </HStack>
                </Box> */}
                </VStack>
                <HStack flex={1}>
                    <Box px="4">
                        <ChevronLeft size={40} />
                    </Box>
                    <VStack spacing="8" width="full" overflow="hidden">
                        <VStack width="full" spacing="4" mt="8">
                            {/* <VStack spacing="4">
                            <HStack>
                                <Box px="3" py="1" rounded="md" overflow="hidden" backgroundColor="whiteAlpha.200">
                                    <Text fontWeight="semibold">Level {relic?.level + 1}</Text>
                                </Box>
                                <BeetsTooltip
                                    label={
                                        canUpgradeTo
                                            ? `Click to upgrade your relic to level ${canUpgradeTo + 1}!`
                                            : null
                                    }
                                    noImage
                                >
                                    <Button color="beets.base.900" className="beets-glow" variant="primary" size="sm">
                                        Level Up
                                    </Button>
                                </BeetsTooltip>
                            </HStack>
                        </VStack> */}
                            <HStack>
                                <HStack spacing="0" rounded="lg" overflow="hidden">
                                    <PoolInvestModal
                                        activator={
                                            <Button
                                                rounded="none"
                                                variant="primary"
                                                onClick={() => setDepositOrWithdraw('deposit')}
                                            >
                                                Invest
                                            </Button>
                                        }
                                    />
                                    <PoolWithdrawModal
                                        activator={
                                            <Button rounded="none" variant="secondary">
                                                Withdraw
                                            </Button>
                                        }
                                    />
                                </HStack>
                                <BeetsTooltip
                                    label={
                                        canUpgradeTo
                                            ? `Click to upgrade your relic to level ${canUpgradeTo + 1}!`
                                            : null
                                    }
                                    noImage
                                >
                                    <Button onClick={() => levelUp(parseInt(relic.relicId, 10))} color="beets.base.900" className="beets-glow" variant="primary">
                                        Level Up
                                    </Button>
                                </BeetsTooltip>
                            </HStack>
                            <HStack width="80%" py="4" position="relative" spacing="0" justifyContent="center">
                                <Box
                                    zIndex="tooltip"
                                    position="absolute"
                                    left="calc(-50px)"
                                    px="3"
                                    py="1"
                                    rounded="md"
                                    overflow="hidden"
                                    backgroundColor="beets.light"
                                >
                                    <Text fontWeight="semibold">Level {relic?.level + 1}</Text>
                                </Box>
                                <AnimatedProgress value={progressToNextLevel} width="100%" rounded="md" />
                            </HStack>
                            <Box
                                rounded="lg"
                                overflow="hidden"
                                initial={{ transform: 'scale(0)', opacity: 0 }}
                                animate={controls}
                                as={motion.div}
                            >
                                {imageURI && <Image alt="Relic NFT" src={imageURI} width="400px" height="400px" />}
                            </Box>
                        </VStack>

                        {/* <HStack spacing="1">
                        <Heading size="md">Relic Maturity Track</Heading>
                        <BeetsTooltip
                            noImage
                            label="These are all the levels that your relic can mature to! The more time you hold onto your
                                relic, the more it matures and generates more rewards for you!"
                        >
                            <Box>
                                <Image width="25px" height="25px" src={BeetsThinking} alt="thinking-emoji" />
                            </Box>
                        </BeetsTooltip>
                    </HStack> */}
                        {/* <HStack>
                            {maturityThresholds.map((_, index) => {
                                const borderColor = relic.level >= index ? 'beets.highlight' : 'transparent';
                                const color = relic.level >= index ? 'beets.highlight' : 'white';
                                const bg = relic.level >= index ? 'beets.highlightAlpha.100' : 'whiteAlpha.200';
                                return (
                                    <Flex
                                        key={`relic-level-${index}`}
                                        justifyContent="center"
                                        alignItems="center"
                                        width="50px"
                                        height="50px"
                                        rounded="md"
                                        color={color}
                                        bg={bg}
                                        borderColor={borderColor}
                                    >
                                        {index + 1}
                                    </Flex>
                                );
                            })}
                        </HStack> */}
                    </VStack>
                    <Box px="4">
                        <ChevronRight size={40} />
                    </Box>
                </HStack>
            </HStack>
        </VStack>
    );
}
