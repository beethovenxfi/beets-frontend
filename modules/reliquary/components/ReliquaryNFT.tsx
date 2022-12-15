import { Box, Button, Flex, Heading, HStack, Progress, StackDivider, Text, VStack } from '@chakra-ui/react';
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
    const canUpgrade = nextLevelMaturityIndex > 0 && nextLevelMaturityIndex > relic.level;

    const currentLevelMaturity = parseInt(maturities[relic.level], 10);
    const timeElapsedSinceCurrentLevel = Date.now() - currentLevelMaturity;
    const timeBetweenCurrentAndNextLevel = parseInt(maturities[relic.level + 1], 10) - currentLevelMaturity;
    const progressToNextLevel = canUpgrade
        ? 100
        : (timeElapsedSinceCurrentLevel / timeBetweenCurrentAndNextLevel) * 100;
    return {
        canUpgrade,
        canUpgradeTo: nextLevelMaturityIndex - 1,
        progressToNextLevel,
    };
}

export default function ReliquaryNFT() {
    const controls = useAnimation();
    const [imageURI, setImageURI] = useState('');
    const [depositOrWithdraw, setDepositOrWithdraw] = useState<'deposit' | 'withdraw'>();
    const { reliquaryService, maturityThresholds, relicPositions = [] } = useReliquary();
    const { canUpgrade, canUpgradeTo, progressToNextLevel } = getMaturityProgress(
        relicPositions[0],
        maturityThresholds,
    );
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
        fetchNFT();
        setTimeout(() => {
            startAnimation();
        }, 500);
    }, []);

    const relic = relicPositions && relicPositions[0];
    return (
        <VStack spacing="8" width="full" height="full">
            <VStack spacing="8" mx="16">
                <Box backgroundColor="whiteAlpha.100" py="3" px="4" rounded="md">
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
                </Box>
            </VStack>
            <VStack spacing="8" overflow="hidden">
                <VStack spacing="8">
                    <VStack spacing="4">
                        <HStack>
                            <Box px="3" py="1" rounded="md" overflow="hidden" backgroundColor="whiteAlpha.200">
                                <Text fontWeight="semibold">Level {relic?.level + 1}</Text>
                            </Box>
                            <BeetsTooltip
                                label={
                                    canUpgradeTo ? `Click to upgrade your relic to level ${canUpgradeTo + 1}!` : null
                                }
                                noImage
                            >
                                <Button variant="primary" size="sm">
                                    Level Up
                                </Button>
                            </BeetsTooltip>
                        </HStack>

                        <HStack>
                            <Box px="3" py="1" rounded="md" overflow="hidden" backgroundColor="whiteAlpha.100">
                                <Text fontWeight="semibold">{relic?.level}</Text>
                            </Box>
                            <Progress value={progressToNextLevel} width="400px" rounded="sm" colorScheme="green" />
                            <Box px="3" py="1" rounded="md" overflow="hidden" backgroundColor="whiteAlpha.100">
                                <Text fontWeight="semibold">{canUpgradeTo + 1}</Text>
                            </Box>
                        </HStack>
                    </VStack>
                    <Box initial={{ transform: 'scale(0)', opacity: 0 }} animate={controls} as={motion.div}>
                        {imageURI && <Image alt="Relic NFT" src={imageURI} width="200px" height="200px" />}
                    </Box>
                </VStack>

                <HStack spacing="0" rounded="lg" overflow="hidden">
                    <PoolInvestModal
                        activator={
                            <Button rounded="none" variant="primary" onClick={() => setDepositOrWithdraw('deposit')}>
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

                <VStack>
                    <HStack spacing="1">
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
                    </HStack>
                    <HStack>
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
                    </HStack>
                </VStack>
            </VStack>
        </VStack>
    );
}
