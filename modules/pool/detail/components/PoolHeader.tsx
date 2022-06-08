import { Box, Flex, Heading, Text, HStack, VStack, Badge } from '@chakra-ui/react';
import numeral from 'numeral';
import { PoolTokenPill } from '~/components/token/PoolTokenPill';
import { usePool } from '~/modules/pool/lib/usePool';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { networkConfig } from '~/lib/config/network-config';
import PoolOwnerImage from '~/assets/images/pool-owner.png';
import Image from 'next/image';

function PoolHeader() {
    const { pool, poolTokensWithoutPhantomBpt } = usePool();

    const swapFeeType = !pool.owner ? 'Static' : 'Dynamic';
    return (
        <VStack width="full" spacing="8" alignItems="flex-start">
            <VStack width='full' alignItems='flex-start'>
                <HStack>
                    <Text textStyle="h3" as="h3" fontWeight="bold">
                        {pool.name}
                    </Text>
                    <HStack spacing="2">
                        {poolTokensWithoutPhantomBpt.map((token, index) => (
                            <PoolTokenPill key={index} token={token} />
                        ))}
                    </HStack>
                </HStack>
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
                    <HStack>
                        <Flex alignItems="center">
                            <Image src={PoolOwnerImage} width={24} height={24} alt="Pool Owner Image" />
                        </Flex>
                        <HStack spacing="1">
                            <Text>{numeral(pool.dynamicData.swapFee).format('0.0[00]%')}</Text>
                            <Text>{swapFeeType} Fee</Text>
                        </HStack>
                    </HStack>
                </HStack>
            </VStack>
            <Flex mt={2}>{pool.owner === networkConfig.beetsPoolOwnerAddress ? <Box ml={1}></Box> : null}</Flex>
        </VStack>
    );
}

export default PoolHeader;
