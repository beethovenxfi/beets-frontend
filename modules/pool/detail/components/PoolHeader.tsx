import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import numeral from 'numeral';
import { PoolTokenPill } from '~/components/token/PoolTokenPill';
import { usePool } from '~/modules/pool/lib/usePool';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { networkConfig } from '~/lib/config/network-config';
import PoolOwnerImage from '~/assets/images/pool-owner.png';
import Image from 'next/image';

function PoolHeader() {
    const { pool, poolTokensWithoutPhantomBpt } = usePool();

    return (
        <>
            <Heading size="2xl" color="#C3C5E9">
                {pool.name}
            </Heading>
            <Flex mt={4} mb={3}>
                {poolTokensWithoutPhantomBpt.slice(0, 4).map((token, index) => (
                    <PoolTokenPill key={index} token={token} />
                ))}
            </Flex>
            {poolTokensWithoutPhantomBpt.length > 4 ? (
                <Flex mt={4} mb={3}>
                    {poolTokensWithoutPhantomBpt.slice(4).map((token, index) => (
                        <PoolTokenPill key={index} token={token} />
                    ))}
                </Flex>
            ) : null}
            <Flex alignItems="flex-end">
                <AprTooltip
                    data={pool.dynamicData.apr}
                    textProps={{ fontSize: '3xl', fontWeight: 'bold', color: '#CCFFCC' }}
                />
                <Text ml={1} mb={1.5} fontWeight="medium" fontSize="lg" color="#C3C5E9">
                    APR
                </Text>
                <Text fontSize="3xl" color="#CCFFCC" fontWeight="bold" ml={4}>
                    {numeral(pool.dynamicData.totalLiquidity).format('$0,0')}
                </Text>
                <Text ml={1} mb={1.5} fontWeight="medium" fontSize="lg" color="#C3C5E9">
                    TVL
                </Text>
                <Text fontSize="3xl" color="#CCFFCC" fontWeight="bold" ml={4}>
                    {numeral(pool.dynamicData.volume24h).format('$0,0')}
                </Text>
                <Text ml={1} mb={1.5} fontWeight="medium" fontSize="lg" color="#C3C5E9">
                    24H VOL
                </Text>
            </Flex>
            <Flex mt={2}>
                <Text color="#CCFFCC" fontSize="lg" fontWeight="medium">
                    {numeral(pool.dynamicData.swapFee).format('0.0[00]%')}
                </Text>
                {!pool.owner ? (
                    <Text fontSize="lg" fontWeight="medium">
                        &nbsp;static swap fee
                    </Text>
                ) : (
                    <Text fontSize="lg" fontWeight="medium">
                        &nbsp;dynamic swap fee
                    </Text>
                )}
                {pool.owner === networkConfig.beetsPoolOwnerAddress ? (
                    <Box ml={1}>
                        <Image src={PoolOwnerImage} width={24} height={24} />
                    </Box>
                ) : null}
            </Flex>
        </>
    );
}

export default PoolHeader;
