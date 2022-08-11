import {
    Box,
    Flex,
    HStack,
    Popover,
    PopoverContent,
    PopoverTrigger as OrigPopoverTrigger,
    Text,
    VStack,
    Wrap,
    WrapItem,
} from '@chakra-ui/react';
import numeral from 'numeral';
import { PoolTokenPill } from '~/components/token/PoolTokenPill';
import PoolOwnerImage from '~/assets/images/pool-owner.png';
import Image from 'next/image';
import { HelpCircle } from 'react-feather';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { AddressZero } from '@ethersproject/constants';
import { usePool } from '~/modules/pool/lib/usePool';

function PoolHeaderOpenGraph() {
    const networkConfig = useNetworkConfig();
    const { pool } = usePool();

    const hasBeetsOwner = pool.owner === networkConfig.beetsPoolOwnerAddress;
    const hasZeroOwner = pool.owner === AddressZero;
    const swapFeeType = hasZeroOwner ? 'Fixed' : 'Dynamic';

    return (
        <VStack width="full" alignItems="flex-start" mb="8">
            <Text textStyle="h3" as="h3" fontWeight="bold" mr="4">
                {pool.name}
            </Text>
            <Wrap>
                {pool.tokens.map((token, index) => (
                    <WrapItem key={index}>
                        <PoolTokenPill token={token} />
                    </WrapItem>
                ))}
            </Wrap>

            <HStack
                paddingX="3"
                paddingY="2"
                bg="whiteAlpha.200"
                spacing="2"
                fontSize="md"
                rounded="full"
                color="beets.base.50"
                justifyContent="center"
                fontWeight="semibold"
            >
                {!hasZeroOwner && (
                    <Flex alignItems="center">
                        {hasBeetsOwner ? (
                            <Image src={PoolOwnerImage} width="24" height="24" alt="Pool Owner Image" />
                        ) : (
                            <HelpCircle size="24" />
                        )}
                    </Flex>
                )}
                <HStack spacing="1">
                    <Text>{numeral(pool.dynamicData.swapFee).format('0.0[00]%')}</Text>
                    <Text>{swapFeeType} Fee</Text>
                </HStack>
            </HStack>
        </VStack>
    );
}

export default PoolHeaderOpenGraph;
