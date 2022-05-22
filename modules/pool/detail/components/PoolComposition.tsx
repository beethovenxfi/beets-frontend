import { GqlPoolUnion, useGetTokenPricesQuery } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Flex, Heading, Link, Text } from '@chakra-ui/react';
import TokenAvatar from '~/components/token-avatar/TokenAvatar';
import { poolIsWeightedLikePool, poolGetTokensWithoutPhantomBpt } from '~/lib/services/pool/pool-util';
import { ExternalLink } from 'react-feather';
import { etherscanGetTokenUrl } from '~/lib/util/etherscan';
import { useGetTokens } from '~/lib/global/useToken';
import numeral from 'numeral';
import PoolCompositionToken from '~/modules/pool/detail/components/PoolCompositionToken';

interface Props {
    pool: GqlPoolUnion;
}

function PoolComposition({ pool }: Props) {
    const poolTokens = poolGetTokensWithoutPhantomBpt(pool);
    const { priceFor } = useGetTokens();

    return (
        <>
            <Heading size="md">Pool composition</Heading>
            <Box bg="gray.900" shadow="lg" rounded="lg" p={4} mt={4}>
                <Flex alignItems="center" mb={2}>
                    <Box flex={1}>
                        <Text fontSize="lg" fontWeight={'semibold'}>
                            Token
                        </Text>
                    </Box>
                    {poolIsWeightedLikePool(pool) ? <Box mr={6}>Weight</Box> : null}
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

                    return items;
                })}
            </Box>
        </>
    );
}

export default PoolComposition;
