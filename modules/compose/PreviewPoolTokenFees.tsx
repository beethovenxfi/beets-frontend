import { HStack, Heading, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { useCompose } from './ComposeProvider';
import { BeetsBox } from '~/components/box/BeetsBox';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useUserAccount } from '~/lib/user/useUserAccount';
import BeetsSmart from '~/assets/icons/beetx-smarts.svg';
import Image from 'next/image';

export default function PreviewPoolTokenFees() {
    const { userAddress } = useUserAccount();
    const { feeManager, currentFee } = useCompose();
    const { beetsPoolOwnerAddress } = useNetworkConfig();

    const isDAOManager = beetsPoolOwnerAddress === feeManager;
    const isSelfManager = userAddress === feeManager;
    const manager = isDAOManager ? 'BeethovenX DAO' : isSelfManager ? 'Your current address' : feeManager;

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
                    <HStack>
                        <BeetsBox rounded="full" px="2" pt="2" pb="0">
                            <Image src={BeetsSmart} width="24" height="24" alt="your-profile" />
                        </BeetsBox>
                        <VStack alignItems="flex-start" spacing="0.5">
                            <Heading size="sm">
                                <HStack spacing="0">
                                    <Text color="beets.highlight">{currentFee}%&nbsp;</Text>
                                    <Text>swap fee managed by</Text>
                                </HStack>
                            </Heading>
                            <Text fontSize="0.95rem">{manager}</Text>
                        </VStack>
                    </HStack>
                </VStack>
            </BeetsBox>
        </HStack>
    );
}
