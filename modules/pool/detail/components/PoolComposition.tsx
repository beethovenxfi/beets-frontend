import { GqlPoolUnion, useGetTokenPricesQuery } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Flex, Heading, Link, Text } from '@chakra-ui/react';
import TokenAvatar from '~/components/token/TokenAvatar';
import { poolIsWeightedLikePool, poolGetTokensWithoutPhantomBpt } from '~/lib/services/pool/pool-util';
import { ExternalLink } from 'react-feather';
import { etherscanGetTokenUrl } from '~/lib/util/etherscan';
import { useGetTokens } from '~/lib/global/useToken';
import numeral from 'numeral';
import PoolCompositionToken from '~/modules/pool/detail/components/PoolCompositionToken';
import { BeetsBox } from '~/components/box/BeetsBox';
import { PoolCompositionChart } from '~/modules/pool/detail/components/PoolCompositionChart';

interface Props {
    pool: GqlPoolUnion;
}

function PoolComposition({ pool }: Props) {
    const poolTokens = poolGetTokensWithoutPhantomBpt(pool);
    const { priceFor } = useGetTokens();

    return (
        <>
            <BeetsBox p={4} mt={4}>
                <Heading size="md" pb={8}>
                    Pool composition
                </Heading>
                <Flex>
                    <Box flex={1} alignItems="stretch">
                        <PoolCompositionChart />
                    </Box>
                    <Box flex={1.8}>
                        <Flex alignItems="center" mb={2}>
                            <Box flex={1}>
                                <Text fontSize="lg" fontWeight={'semibold'}>
                                    Token
                                </Text>
                            </Box>
                            {poolIsWeightedLikePool(pool) ? (
                                <Box w={125} textAlign="end" mr={4}>
                                    <Text fontSize="lg" fontWeight={'semibold'}>
                                        Weight
                                    </Text>
                                </Box>
                            ) : null}
                            <Box w={125} textAlign="end" mr={4}>
                                <Text fontSize="lg" fontWeight={'semibold'}>
                                    Balance
                                </Text>
                            </Box>
                            <Box w={125} textAlign="end">
                                <Text fontSize="lg" fontWeight={'semibold'}>
                                    Value
                                </Text>
                            </Box>
                        </Flex>
                        {poolTokens.map((token, index) => {
                            const items = [<PoolCompositionToken token={token} key={index} />];

                            if (token.__typename === 'GqlPoolTokenLinear') {
                                for (const nestedToken of token.pool.tokens) {
                                    items.push(
                                        <PoolCompositionToken
                                            token={nestedToken}
                                            key={`${token.pool.id}${nestedToken.address}`}
                                            nestLevel={1}
                                        />,
                                    );
                                }
                            } else if (token.__typename === 'GqlPoolTokenPhantomStable') {
                                for (const nestedToken of poolGetTokensWithoutPhantomBpt(token.pool)) {
                                    items.push(
                                        <PoolCompositionToken
                                            token={nestedToken}
                                            key={`${token.pool.id}${nestedToken.address}`}
                                            nestLevel={1}
                                        />,
                                    );

                                    if (nestedToken.__typename === 'GqlPoolTokenLinear') {
                                        for (const linearToken of poolGetTokensWithoutPhantomBpt(nestedToken.pool)) {
                                            items.push(
                                                <PoolCompositionToken
                                                    token={linearToken}
                                                    key={`${token.pool.id}${linearToken.address}`}
                                                    nestLevel={2}
                                                />,
                                            );
                                        }
                                    }
                                }
                            }

                            return (
                                <Box pb={index === poolTokens.length - 1 ? 0 : 4} key={index}>
                                    {items}
                                </Box>
                            );
                        })}
                    </Box>
                </Flex>
            </BeetsBox>
        </>
    );
}

export default PoolComposition;
