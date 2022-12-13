import { Box, Button, Flex, Heading, HStack, Image, Progress, StackDivider, Text, VStack } from '@chakra-ui/react';
import { getProvider } from '@wagmi/core';
import { motion, useAnimation } from 'framer-motion';
import numeral from 'numeral';
import React, { useEffect, useState } from 'react';
import { ReliquaryFarmPosition, ReliquaryService } from '~/lib/services/staking/reliquary.service';
import useReliquary from '../hooks/useReliquary';
import ReliquaryInvest from './ReliquaryInvest';

interface Props {
    positions: ReliquaryFarmPosition[];
}

export default function ReliquaryNFT({ positions }: Props) {
    const controls = useAnimation();
    const [imageURI, setImageURI] = useState('');
    const [depositOrWithdraw, setDepositOrWithdraw] = useState<'deposit' | 'withdraw'>();
    const { reliquaryService } = useReliquary();

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

    console.log('pos', positions);

    const relic = positions && positions[0];
    return (
        <VStack spacing='8' width="full" height="full">
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
                        <Box px="3" py="1" rounded="md" overflow="hidden" backgroundColor="whiteAlpha.200">
                            <Text fontWeight="semibold">Level {relic?.level}</Text>
                        </Box>
                        <Progress value={80} width="400px" rounded="sm" colorScheme="green" />
                    </VStack>
                    <Box initial={{ transform: 'scale(0)', opacity: 0 }} animate={controls} as={motion.div}>
                        {imageURI && <img src={imageURI} width="200px" height="200px" />}
                    </Box>
                </VStack>

                <HStack spacing="0" rounded="lg" overflow="hidden">
                    <Button rounded="none"  variant="primary" onClick={() => setDepositOrWithdraw('deposit')}>
                        Deposit
                    </Button>
                    <Button rounded="none" variant="secondary" >
                        Withdraw
                    </Button>
                </HStack>

                <HStack>
                    <Flex
                        justifyContent="center"
                        alignItems="center"
                        width="50px"
                        height="50px"
                        rounded="md"
                        bg="whiteAlpha.200"
                    >
                        0
                    </Flex>
                    <Flex
                        justifyContent="center"
                        alignItems="center"
                        width="50px"
                        height="50px"
                        rounded="md"
                        bg="whiteAlpha.200"
                    >
                        1
                    </Flex>
                    <Flex
                        justifyContent="center"
                        alignItems="center"
                        width="50px"
                        height="50px"
                        rounded="md"
                        bg="whiteAlpha.200"
                    >
                        2
                    </Flex>
                    <Flex
                        justifyContent="center"
                        alignItems="center"
                        width="50px"
                        height="50px"
                        rounded="md"
                        bg="whiteAlpha.200"
                    >
                        3
                    </Flex>
                    <Flex
                        justifyContent="center"
                        alignItems="center"
                        width="50px"
                        height="50px"
                        rounded="md"
                        bg="whiteAlpha.200"
                    >
                        4
                    </Flex>
                </HStack>
            </VStack>
        </VStack>
    );
}
