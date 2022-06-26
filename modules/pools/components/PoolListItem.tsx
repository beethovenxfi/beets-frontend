import { GqlPoolMinimalFragment } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Flex, Text } from '@chakra-ui/react';
import TokenAvatarSet from '~/components/token/TokenAvatarSet';
import Link from 'next/link';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { BoxProps } from '@chakra-ui/layout';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { numberFormatUSDValue } from '~/lib/util/number-formats';

interface Props extends BoxProps {
    pool: GqlPoolMinimalFragment;
    userBalance?: AmountHumanReadable;
    showUserBalance: boolean;
}

export default function PoolListItem({ pool, userBalance, showUserBalance, ...rest }: Props) {
    console.log(pool.name, pool.dynamicData.apr);
    return (
        <Box {...rest}>
            <Link href={`/pool/${pool.id}`} passHref>
                <a>
                    <Flex px="4" py="4" cursor="pointer" alignItems={'center'} fontSize="lg" _hover={{ bg: '#100C3A' }}>
                        <Box w={90} textAlign={'center'}>
                            <TokenAvatarSet
                                imageSize={25}
                                width={92}
                                addresses={pool.allTokens
                                    .filter((token) => !token.isNested && !token.isPhantomBpt)
                                    .map((token) => token.address)}
                            />
                        </Box>
                        <Flex flex={1}>
                            <Text fontSize="md">{pool.name}</Text>
                        </Flex>
                        {showUserBalance && (
                            <Box w={150} textAlign="right">
                                <Text fontSize="md">{numberFormatUSDValue(userBalance || '0')}</Text>
                            </Box>
                        )}
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
                </a>
            </Link>
        </Box>
    );
}
