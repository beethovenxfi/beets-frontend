import {
    GqlPoolLinearNested,
    GqlPoolLinearPoolData,
    GqlPoolTokenUnion,
    GqlPoolUnion,
} from '~/apollo/generated/graphql-codegen-generated';
import {
    Box,
    Text,
    HStack,
    Flex,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Collapse,
    Progress,
    FlexProps,
} from '@chakra-ui/react';
import TokenAvatar from '~/components/token/TokenAvatar';
import { poolIsWeightedLikePool, poolGetTokensWithoutPhantomBpt } from '~/lib/services/pool/pool-util';
import { useGetTokens } from '~/lib/global/useToken';
import numeral from 'numeral';
import Card from '~/components/card/Card';
import { useState } from 'react';
import { CornerDownRight } from 'react-feather';
import { usePoolUserPoolTokenBalances } from '~/modules/pool/lib/usePoolUserPoolTokenBalances';

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

type PoolToken = GqlPoolTokenUnion & { pool?: GqlPoolLinearNested };

interface PoolCompositionRowProps {
    token: PoolToken;
    hasNestedToken?: boolean;
    hasBpt?: boolean;
}
function PoolCompositionRow({ token, hasNestedToken, hasBpt }: PoolCompositionRowProps) {
    const { priceFor } = useGetTokens();
    const isBoostedToken = !!token.pool;

    const sharedCells = (_token: PoolToken, isLinearToken: boolean) => {
        const weight = !isLinearToken
            ? parseFloat(_token.weight || '0')
            : parseFloat(_token.balance) / parseFloat(token.balance);

        return (
            <>
                <Td borderBottom="0" p="2" marginBottom="4">
                    <Text fontSize="sm" color="beets.base.50">
                        {_token.name}
                    </Text>
                </Td>
                {!hasNestedToken && (
                    <Td borderBottom="0" p="2" marginBottom="4" width="300px">
                        {!isLinearToken && <Progress width="80%" rounded="lg" value={weight * 100} />}
                    </Td>
                )}
                {hasBpt && (
                    <>
                        <Td borderBottom="0" p="2" marginBottom="4">
                            <Text fontSize="sm" color="beets.base.50">
                                {numeral(_token.balance).format('0,0.0000')}
                            </Text>
                        </Td>
                        <Td borderBottom="0" p="2" marginBottom="4">
                            <Text fontSize="sm" color="beets.base.50">
                                {numeral(parseFloat(_token.balance) * priceFor(_token.address)).format('$0,0.00a')}
                            </Text>
                        </Td>
                    </>
                )}
                <Td borderBottom="0" p="2" marginBottom="4">
                    <Text fontSize="sm" color="beets.base.50">
                        {numeral(_token.balance).format('0,0.0000')}
                    </Text>
                </Td>
                <Td borderBottom="0" p="2" marginBottom="4" borderTopRightRadius="lg" borderBottomRightRadius="lg">
                    <Text fontSize="sm" color="beets.base.50">
                        {numeral(parseFloat(_token.balance) * priceFor(_token.address)).format('$0,0.00a')}
                    </Text>
                </Td>
            </>
        );
    };

    return (
        <>
            <Tr key={`composition-${token.symbol}`} padding="2" width="full" background="whiteAlpha.100">
                <Td borderBottom="0" p="2" marginBottom="4" borderTopLeftRadius="lg" borderBottomLeftRadius="lg">
                    <HStack>
                        <TokenAvatar size="xs" address={token.address}></TokenAvatar>
                        <Text fontSize="sm" color="beets.base.50">
                            {token.symbol}
                        </Text>
                    </HStack>
                </Td>
                {sharedCells(token, false)}
            </Tr>
            {isBoostedToken &&
                token.pool?.tokens.map((token: any) => (
                    <Tr key={`composition-${token.symbol}`} width="full" background="blackAlpha.100">
                        <Td
                            borderBottom="0"
                            p="2"
                            paddingLeft="8"
                            marginBottom="4"
                            borderTopLeftRadius="lg"
                            borderBottomLeftRadius="lg"
                        >
                            <HStack>
                                <Box color="whiteAlpha.400">
                                    <CornerDownRight />
                                </Box>
                                <TokenAvatar size="xs" address={token.address}></TokenAvatar>
                                <Text fontSize="sm" color="beets.base.50">
                                    {token.symbol}
                                </Text>
                            </HStack>
                        </Td>
                        {sharedCells(token, true)}
                    </Tr>
                ))}
        </>
    );
}

function PoolComposition({ pool }: Props) {
    const poolTokens = poolGetTokensWithoutPhantomBpt(pool) as PoolToken[];
    const { isLoading: isLoadingUserPoolBalances, hasBpt, investedAmount } = usePoolUserPoolTokenBalances();
    const [show, setShow] = useState(false);

    const toggle = (toggleVal: boolean) => {
        setShow((val) => toggleVal);
    };

    const linearType = 'GqlPoolTokenLinear';
    const phantomStableType = 'GqlPoolTokenPhantomStable';
    const hasNestedTokens = poolTokens.some((token) => [linearType, phantomStableType].includes(token.__typename));

    return (
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
                            {!hasNestedTokens && (
                                <Th border="none" padding="2">
                                    <Text fontSize="xs" color="beets.base.50">
                                        Weight
                                    </Text>
                                </Th>
                            )}
                            {hasBpt && (
                                <>
                                    <Th border="none" padding="2">
                                        <Text fontSize="xs" color="beets.base.50">
                                            Your supply
                                        </Text>
                                    </Th>
                                    <Th border="none" padding="2">
                                        <Text fontSize="xs" color="beets.base.50">
                                            Supplied value
                                        </Text>
                                    </Th>
                                </>
                            )}
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
                        {poolTokens.map((token, i) => (
                            <PoolCompositionRow
                                hasNestedToken={hasNestedTokens}
                                hasBpt={hasBpt}
                                key={`composition-${i}`}
                                token={token}
                            />
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Card>
    );
}

export default PoolComposition;
