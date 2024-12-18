import { Flex, HStack, Text, VStack, Wrap, WrapItem, Stack } from '@chakra-ui/react';
import numeral from 'numeral';
import { PoolTokenPill } from '~/components/token/PoolTokenPill';
import PoolOwnerImage from '~/assets/images/pool-owner.png';
import Image from 'next/image';
import { HelpCircle } from 'react-feather';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { AddressZero } from '@ethersproject/constants';
import { usePool } from '~/modules/pool/lib/usePool';
import { CustomTooltip } from '~/components/tooltip/CustomTooltip';
import { PoolHeaderStaking } from './PoolHeaderStaking';
import { PoolHeaderPoints } from './thirdparty/PoolHeaderPoints';

function PoolHeader() {
    const networkConfig = useNetworkConfig();
    const { pool } = usePool();

    const hasBeetsOwner = pool.owner === networkConfig.beetsPoolOwnerAddress;
    const hasZeroOwner = pool.owner === AddressZero;
    const swapFeeType = hasZeroOwner ? 'Fixed' : 'Dynamic';
    const tooltipText1 = `Liquidity providers earn ${swapFeeType.toLowerCase()} swap fees on every trade utilizing the liquidity in this pool.`;

    const tooltipText2 = ` Dynamic swap fees are controlled by the ${
        hasBeetsOwner ? 'Beets Liquidity Committee Multisig' : 'pool owner'
    }.`;

    const textString = networkConfig.pointsPools.find((pointsPool) => pointsPool.poolId === pool.id)?.textString;

    return (
        <VStack width="full" alignItems="flex-start" mb="8">
            <Text textStyle="h3" as="h3" fontWeight="bold" mr="4" display={{ base: 'block', lg: 'none' }}>
                {pool.name}
            </Text>
            <Wrap>
                <WrapItem display={{ base: 'none', lg: 'flex' }}>
                    <Text textStyle="h3" as="h3" fontWeight="bold" mr="4">
                        {pool.name}
                    </Text>
                </WrapItem>
                {pool.displayTokens.map((token, index) => (
                    <WrapItem key={index}>
                        <PoolTokenPill token={token} />
                    </WrapItem>
                ))}
            </Wrap>
            <Stack direction={{ base: 'column', lg: 'row' }}>
                <CustomTooltip
                    trigger={
                        <>
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
                                <Text>{numeral(pool.dynamicData.swapFee).format('0.0[000]%')}</Text>
                                <Text>{swapFeeType} Fee</Text>
                            </HStack>
                        </>
                    }
                    content={`${tooltipText1}${!hasZeroOwner ? tooltipText2 : ''}`}
                    alignSelf="flex-start"
                />
                <PoolHeaderStaking poolId={pool.id} />
                {textString && <PoolHeaderPoints textString={textString} />}
            </Stack>
        </VStack>
    );
}

export default PoolHeader;
