import { Box, Button, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { getProvider } from '@wagmi/core';
import { motion, useAnimation } from 'framer-motion';
import numeral from 'numeral';
import React, { useEffect, useState } from 'react';
import { ReliquaryFarmPosition } from '~/lib/services/staking/reliquary.service';
import { PoolInvestModal } from '~/modules/pool/invest/PoolInvestModal';
import { PoolWithdrawModal } from '~/modules/pool/withdraw/PoolWithdrawModal';
import useReliquary from '../hooks/useReliquary';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import Card from '~/components/card/Card';
import AnimatedProgress from '~/components/animated-progress/AnimatedProgress';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { usePoolUserDepositBalance } from '~/modules/pool/lib/usePoolUserDepositBalance';
import { TokenAmountPill } from '~/components/token/TokenAmountPill';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { usePool } from '~/modules/pool/lib/usePool';
import { useReliquaryLevelUp } from '../hooks/useReliquaryLevelUp';

interface Props {
    positions: ReliquaryFarmPosition[];
}

export function ReliquaryHeader() {
    const controls = useAnimation();
    const [imageURI, setImageURI] = useState('');
    const [depositOrWithdraw, setDepositOrWithdraw] = useState<'deposit' | 'withdraw'>();
    const { reliquaryService, maturityThresholds, relicPositions = [] } = useReliquary();
    const { levelUp } = useReliquaryLevelUp();
    const { data, userPoolBalanceUSD } = usePoolUserDepositBalance();
    const { pool } = usePool();

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
                type: ToastType.Warn,
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
                                        Deposited fBEETS
                                    </Text>
                                    <HStack>
                                        <Text color="white" fontSize="1.75rem">
                                            {numeral(relic.amount).format('0.0000')}
                                        </Text>
                                    </HStack>
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
                </VStack>
                <HStack flex={1}>
                    <VStack spacing="8" width="full" overflow="hidden">
                        <HStack>
                            <PoolInvestModal
                                activator={
                                    <Button
                                        width="140px"
                                        variant="primary"
                                        onClick={() => setDepositOrWithdraw('deposit')}
                                    >
                                        Invest
                                    </Button>
                                }
                            />
                            <PoolWithdrawModal
                                activator={
                                    <Button width="140px" variant="secondary">
                                        Withdraw
                                    </Button>
                                }
                            />
                        </HStack>
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

                            {/*<BeetsTooltip
                                    label={
                                        canUpgradeTo
                                            ? `Click to upgrade your relic to level ${canUpgradeTo + 1}!`
                                            : null
                                    }
                                    noImage
                                >
                                    <Button
                                        onClick={() => levelUp(parseInt(relic.relicId, 10))}
                                        color="beets.base.900"
                                        className="beets-glow"
                                        variant="primary"
                                    >
                                        Level Up
                                    </Button>
                                </BeetsTooltip>*/}
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
                                {imageURI && (
                                    <Image alt="Relic NFT" src={imageURI} width="400px" height="400px" br="4" />
                                )}
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
                </HStack>
            </HStack>
        </VStack>
    );
}
