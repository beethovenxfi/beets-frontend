import { GqlPoolMinimalFragment } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Flex, Text } from '@chakra-ui/react';
import TokenAvatarSet from '~/components/token/TokenAvatarSet';
import Link from 'next/link';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { BoxProps } from '@chakra-ui/layout';

interface Props extends BoxProps {
    pool: GqlPoolMinimalFragment;
}

export default function PoolListItem({ pool, ...rest }: Props) {
    return (
        <Box {...rest}>
            <Link href={`/pool/${pool.id}`}>
                <Flex px={4} py={5} cursor="pointer" alignItems={'center'} fontSize="lg" _hover={{ bg: '#100C3A' }}>
                    <Box w={125} textAlign={'center'}>
                        <TokenAvatarSet
                            imageSize={30}
                            width={92}
                            addresses={pool.allTokens
                                .filter((token) => !token.isNested && !token.isPhantomBpt)
                                .map((token) => token.address)}
                        />
                    </Box>
                    <Flex flex={1}>
                        <Text fontSize="md">{pool.name}</Text>
                    </Flex>
                    <Box w={200} textAlign="right">
                        <Text fontSize="md">{numeral(pool.dynamicData.totalLiquidity).format('$0,0')}</Text>
                    </Box>
                    <Box w={200} textAlign="right">
                        <Text fontSize="md">{numeral(pool.dynamicData.volume24h).format('$0,0')}</Text>
                    </Box>
                    <Box w={200}>
                        <AprTooltip data={pool.dynamicData.apr} textProps={{ fontWeight: 'normal' }} />
                    </Box>
                </Flex>
            </Link>
        </Box>
    );
}
