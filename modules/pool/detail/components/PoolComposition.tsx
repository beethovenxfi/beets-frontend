import { GqlPoolUnion, useGetTokenPricesQuery } from '~/apollo/generated/graphql-codegen-generated';
<<<<<<< HEAD
import {
    Box,
    Heading,
    Link,
    Text,
    HStack,
    Flex,
    VStack,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Progress,
} from '@chakra-ui/react';
=======
import { Collapse, Box, Flex, FlexProps, Heading, Switch, Text, FormLabel } from '@chakra-ui/react';
>>>>>>> f77d21913211c1af931f62bac628344c9bd7e57e
import TokenAvatar from '~/components/token/TokenAvatar';
import { poolIsWeightedLikePool, poolGetTokensWithoutPhantomBpt } from '~/lib/services/pool/pool-util';
import { ExternalLink } from 'react-feather';
import { etherscanGetTokenUrl } from '~/lib/util/etherscan';
import { useGetTokens } from '~/lib/global/useToken';
import numeral from 'numeral';
import PoolCompositionToken from '~/modules/pool/detail/components/PoolCompositionToken';
import { BeetsBox } from '~/components/box/BeetsBox';
import { PoolCompositionChart } from '~/modules/pool/detail/components/PoolCompositionChart';
<<<<<<< HEAD
import Card from '~/components/card/Card';
=======
import { useState } from 'react';

>>>>>>> f77d21913211c1af931f62bac628344c9bd7e57e
interface Props {
    pool: GqlPoolUnion;
}

interface BreakDownProps extends FlexProps {
    index: number;
    key: string;
    nestLevel: number;
    isLast?: boolean;
    show: boolean;
}

function BreakDown(props: BreakDownProps) {
    const bgColor = 'beets.gray.200';
    return (
        <Collapse
            in={props.show}
            transition={{ enter: { duration: 0.5, ease: 'easeIn' }, exit: { duration: 0.4, ease: 'easeOut' } }}
        >
            <Flex ml="0.75rem" align="center" key={props.key}>
                {props.nestLevel === 2 && !props.isLast && <Box w="1px" bgColor={bgColor} h="4.5rem" mt="-2rem" />}
                <Box
                    w="1px"
                    bgColor={bgColor}
                    h={props.index === 0 ? '3.5rem' : '2rem'}
                    mt={props.index === 0 ? '-1rem' : '-2.5rem'}
                    ml={props.isLast ? 10 : props.nestLevel === 2 ? 8 : ''}
                />
                <Box h="1px" w="0.75rem" bgColor={bgColor} mr="0.5rem" mt="-0.5rem" />
                {props.children}
            </Flex>
        </Collapse>
    );
}

function PoolComposition({ pool }: Props) {
    const poolTokens = poolGetTokensWithoutPhantomBpt(pool);
    const { priceFor } = useGetTokens();
    const [show, setShow] = useState(false);

    const toggle = (toggleVal: boolean) => {
        setShow((val) => toggleVal);
    };

    const linearType = 'GqlPoolTokenLinear';
    const phantomStableType = 'GqlPoolTokenPhantomStable';
    const hasNestedTokens = poolTokens.some((token) => [linearType, phantomStableType].includes(token.__typename));

    return (
<<<<<<< HEAD
        <Card px="2" py="2" mt={4} width="full">
            <TableContainer>
                <Table style={{ borderCollapse: 'separate', borderSpacing: '0 3px' }}>
                    <Thead width="full" paddingX="2">
                        <Tr>
                            <Th border="none" padding="2">
                                <Text fontSize="xs" color="beets.base.50">
                                    Symbol
                                </Text>
                            </Th>
                            <Th border="none" padding="2">
                                <Text fontSize="xs" color="beets.base.50">
                                    Name
                                </Text>
                            </Th>
                            <Th border="none" padding="2">
                                <Text fontSize="xs" color="beets.base.50">
                                    Weight
                                </Text>
                            </Th>
                            <Th border="none" padding="2">
                                <Text fontSize="xs" color="beets.base.50">
                                    Supply
                                </Text>
                            </Th>
                            <Th border="none" padding="2">
                                <Text fontSize="xs" color="beets.base.50">
                                    Value
                                </Text>
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {poolTokens.map((token) => (
                            <Tr
                                key={`composition-${token.symbol}`}
                                padding="2"
                                width="full"
                                background="whiteAlpha.100"
                            >
                                <Td
                                    borderBottom="0"
                                    p="2"
                                    marginBottom="4"
                                    borderTopLeftRadius="lg"
                                    borderBottomLeftRadius="lg"
                                >
                                    <HStack>
                                        <TokenAvatar size="xs" address={token.address}></TokenAvatar>
                                        <Text fontSize="sm" color="beets.base.50">
                                            {token.symbol}
                                        </Text>
                                    </HStack>
                                </Td>
                                <Td borderBottom="0" p="2" marginBottom="4">
                                    <Text fontSize="sm" color="beets.base.50">
                                        {token.name}
                                    </Text>
                                </Td>
                                <Td borderBottom="0" p="2" marginBottom="4" width='300px'>
                                    <Progress width='80%' rounded="lg" value={parseFloat(token.weight || '0') * 100} />
                                </Td>
                                <Td borderBottom="0" p="2" marginBottom="4">
                                    <Text fontSize="sm" color="beets.base.50">
                                        {numeral(token.balance).format('0,0.0000')}
                                    </Text>
                                </Td>
                                <Td
                                    borderBottom="0"
                                    p="2"
                                    marginBottom="4"
                                    borderTopRightRadius="lg"
                                    borderBottomRightRadius="lg"
                                >
                                    <Text fontSize="sm" color="beets.base.50">
                                        {numeral(parseFloat(token.balance) * priceFor(token.address)).format(
                                            '$0,0.00a',
                                        )}
                                    </Text>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Card>
=======
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
                            isDisabled={!hasNestedTokens}
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

                            if (token.__typename === linearType) {
                                token.pool.tokens.forEach((nestedToken, index) => {
                                    const nestLevel = 1;
                                    items.push(
                                        <BreakDown
                                            show={show}
                                            index={index}
                                            key={`${token.pool.id}${nestedToken.address}`}
                                            nestLevel={nestLevel}
                                        >
                                            <PoolCompositionToken token={nestedToken} nestLevel={nestLevel} />
                                        </BreakDown>,
                                    );
                                });
                            } else if (token.__typename === phantomStableType) {
                                const poolTokens = poolGetTokensWithoutPhantomBpt(token.pool);
                                poolTokens.forEach((nestedToken, index) => {
                                    const nestLevel = 1;
                                    const isLast = poolTokens.length === index + 1;
                                    items.push(
                                        <BreakDown
                                            show={show}
                                            index={index}
                                            key={`${token.pool.id}${nestedToken.address}`}
                                            nestLevel={nestLevel}
                                        >
                                            <PoolCompositionToken token={nestedToken} nestLevel={nestLevel} />
                                        </BreakDown>,
                                    );

                                    if (nestedToken.__typename === linearType) {
                                        const nestedPoolTokens = poolGetTokensWithoutPhantomBpt(nestedToken.pool);
                                        nestedPoolTokens.forEach((linearToken, index) => {
                                            const nestLevel = 2;
                                            items.push(
                                                <BreakDown
                                                    show={show}
                                                    index={index}
                                                    key={`${token.pool.id}${linearToken.address}`}
                                                    nestLevel={nestLevel}
                                                    isLast={isLast}
                                                >
                                                    <PoolCompositionToken token={linearToken} nestLevel={nestLevel} />
                                                </BreakDown>,
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
>>>>>>> f77d21913211c1af931f62bac628344c9bd7e57e
    );
}

export default PoolComposition;
