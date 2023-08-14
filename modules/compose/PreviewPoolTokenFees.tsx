import { Box, Grid, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { useCompose } from './ComposeProvider';

import Card from '~/components/card/Card';
import { BeetsBox } from '~/components/box/BeetsBox';
import TokenRow from '~/components/token/TokenRow';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useUserAccount } from '~/lib/user/useUserAccount';
import BeetsSmart from '~/assets/icons/beetx-smarts.svg';
import Image from 'next/image';

interface Props {}

export default function PreviewPoolTokenFees(props: Props) {
    const { userAddress } = useUserAccount();
    const { feeManager, isUsingCustomFee, currentFee } = useCompose();
    const { beetsPoolOwnerAddress } = useNetworkConfig();

    const isDAOManager = beetsPoolOwnerAddress === feeManager;
    const isSelfManager = userAddress === feeManager;

    return (
        <HStack spacing="4" width="full" justifyContent="flex-start">
            <BeetsBox
                py="3"
                pl="4"
                pr="6"
                display="flex"
                justifyContent="flex-start"
                width={{ base: '100%', md: 'fit-content' }}
            >
                <VStack width="full" alignItems="flex-start">
                    {isDAOManager && (
                        <HStack>
                            <BeetsBox rounded="full" px="2" pt="2" pb="0">
                                <Image src={BeetsSmart} width="24" height="24" alt="your-profile" />
                            </BeetsBox>
                            <VStack alignItems="flex-start" spacing="0.5">
                                <Heading size="sm">
                                    <HStack spacing="0">
                                        <Text color="beets.highlight">{parseFloat(currentFee) * 100}%&nbsp;</Text>
                                        <Text>swap fee managed by</Text>
                                    </HStack>
                                </Heading>
                                <Text fontSize="0.95rem">BeethovenX DAO</Text>
                            </VStack>
                        </HStack>
                    )}
                    {isSelfManager && (
                        <HStack>
                            <BeetsBox rounded="full" px="2" pt="2" pb="0">
                                <Image src={BeetsSmart} width="24" height="24" alt="your-profile" />
                            </BeetsBox>
                            <VStack alignItems="flex-start" spacing="0">
                                <Heading size="sm">
                                    <HStack spacing="0">
                                        <Text color="beets.highlight">{parseFloat(currentFee) * 100}%&nbsp;</Text>
                                        <Text>swap fee managed by</Text>
                                    </HStack>
                                </Heading>
                                <Text fontSize="0.95rem">Your current address</Text>
                            </VStack>
                        </HStack>
                    )}
                    {!isSelfManager && !isDAOManager && (
                        <HStack>
                            <BeetsBox rounded="full" px="2" pt="2" pb="0">
                                <Image src={BeetsSmart} width="24" height="24" alt="your-profile" />
                            </BeetsBox>
                            <VStack alignItems="flex-start" spacing="0.5">
                                <Heading size="sm">
                                    <HStack spacing="0">
                                        <Text color="beets.highlight">{parseFloat(currentFee) * 100}%&nbsp;</Text>
                                        <Text>swap fee managed by</Text>
                                    </HStack>
                                </Heading>
                                <Text fontSize="0.95rem">{feeManager}</Text>
                            </VStack>
                        </HStack>
                    )}
                </VStack>
            </BeetsBox>
        </HStack>
    );
}
