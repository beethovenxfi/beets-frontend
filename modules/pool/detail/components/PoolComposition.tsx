import { GqlPoolUnion, useGetTokenPricesQuery } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Flex, FlexProps, Heading, Switch, Text, FormLabel } from '@chakra-ui/react';
import TokenAvatar from '~/components/token/TokenAvatar';
import { poolIsWeightedLikePool, poolGetTokensWithoutPhantomBpt } from '~/lib/services/pool/pool-util';
import { ExternalLink } from 'react-feather';
import { etherscanGetTokenUrl } from '~/lib/util/etherscan';
import { useGetTokens } from '~/lib/global/useToken';
import numeral from 'numeral';
import PoolCompositionToken from '~/modules/pool/detail/components/PoolCompositionToken';
import { BeetsBox } from '~/components/box/BeetsBox';
import { PoolCompositionChart } from '~/modules/pool/detail/components/PoolCompositionChart';
import { useState } from 'react';

interface Props {
    pool: GqlPoolUnion;
}

interface BreakDownProps extends FlexProps {
    index: number;
    key: string;
    nestLevel: number;
    isLast?: boolean;
}

function BreakDown(props: BreakDownProps) {
    return (
        <Flex ml="0.75rem" align="center" key={props.key}>
            {props.nestLevel === 2 && !props.isLast && (
                <Box
                    w="1px"
                    bgColor="beets.gray.200"
                    m="0.25rem"
                    h={props.index === 0 ? '3rem' : '2.5rem'}
                    mt="-2rem"
                />
            )}
            <Box
                w="1px"
                bgColor="beets.gray.200"
                m="0.25rem"
                h={props.index === 0 ? '1.25rem' : '2.5rem'}
                mt={props.index === 0 ? '-1rem' : '-2.25rem'}
                ml={props.isLast ? 10 : props.nestLevel === 2 ? 8 : ''}
            />
            <Box h="1px" w="0.75rem" bgColor="beets.gray.200" mr="0.5rem" ml="-0.25rem" />

            {props.children}
        </Flex>
    );
}

function PoolComposition({ pool }: Props) {
    const poolTokens = poolGetTokensWithoutPhantomBpt(pool);
    const { priceFor } = useGetTokens();
    const [show, setShow] = useState(false);

    const toggle = (toggleVal: boolean) => {
        setShow((val) => toggleVal);
    };

    return (
        <>
            <BeetsBox p={4} mt={4}>
                <Flex justifyContent="space-between">
                    <Heading size="md" pb={8}>
                        Pool composition
                    </Heading>
                    <Flex>
                        <FormLabel htmlFor="nested-tokens" mb="0">
                            Show nested tokens?
                        </FormLabel>
                        <Switch
                            id="nested-tokens"
                            onChange={(event) => {
                                toggle(event.target.checked);
                            }}
                        />
                    </Flex>
                </Flex>
                <Flex>
                    <Box flex={1} alignItems="stretch">
                        <PoolCompositionChart />
                    </Box>
                    <Box flex={1.8}>
                        <Flex alignItems="center" mb={2}>
                            <Box flex={1}>
                                <Text fontSize="lg" fontWeight="semibold">
                                    Token
                                </Text>
                            </Box>
                            {poolIsWeightedLikePool(pool) ? (
                                <Box w={125} textAlign="end" mr={4}>
                                    <Text fontSize="lg" fontWeight="semibold">
                                        Weight
                                    </Text>
                                </Box>
                            ) : null}
                            <Box w={125} textAlign="end" mr={4}>
                                <Text fontSize="lg" fontWeight="semibold">
                                    Balance
                                </Text>
                            </Box>
                            <Box w={125} textAlign="end">
                                <Text fontSize="lg" fontWeight="semibold">
                                    Value
                                </Text>
                            </Box>
                        </Flex>
                        {poolTokens.map((token, index) => {
                            const items = [
                                <Flex align="center" key={index}>
                                    <PoolCompositionToken token={token} />
                                </Flex>,
                            ];

                            if (token.__typename === 'GqlPoolTokenLinear') {
                                token.pool.tokens.forEach((nestedToken, index) => {
                                    const nestLevel = 1;
                                    items.push(
                                        <>
                                            {show && (
                                                <BreakDown
                                                    index={index}
                                                    key={`${token.pool.id}${nestedToken.address}`}
                                                    nestLevel={nestLevel}
                                                >
                                                    <PoolCompositionToken token={nestedToken} nestLevel={nestLevel} />
                                                </BreakDown>
                                            )}
                                        </>,
                                    );
                                });
                            } else if (token.__typename === 'GqlPoolTokenPhantomStable') {
                                const poolTokens = poolGetTokensWithoutPhantomBpt(token.pool);
                                poolTokens.forEach((nestedToken, index) => {
                                    const nestLevel = 1;
                                    const isLast = poolTokens.length === index + 1;
                                    items.push(
                                        <>
                                            {show && (
                                                <BreakDown
                                                    index={index}
                                                    key={`${token.pool.id}${nestedToken.address}`}
                                                    nestLevel={nestLevel}
                                                >
                                                    <PoolCompositionToken token={nestedToken} nestLevel={nestLevel} />
                                                </BreakDown>
                                            )}
                                        </>,
                                    );

                                    if (nestedToken.__typename === 'GqlPoolTokenLinear') {
                                        const nestedPoolTokens = poolGetTokensWithoutPhantomBpt(nestedToken.pool);
                                        nestedPoolTokens.forEach((linearToken, index) => {
                                            const nestLevel = 2;
                                            items.push(
                                                <>
                                                    {show && (
                                                        <BreakDown
                                                            index={index}
                                                            key={`${token.pool.id}${linearToken.address}`}
                                                            nestLevel={nestLevel}
                                                            isLast={isLast}
                                                        >
                                                            <PoolCompositionToken
                                                                token={linearToken}
                                                                nestLevel={nestLevel}
                                                            />
                                                        </BreakDown>
                                                    )}
                                                </>,
                                            );
                                        });
                                    }
                                });
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
