import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
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
    const bgColor = 'gray.200';
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
                                <Td borderBottom="0" p="2" marginBottom="4" width="300px">
                                    <Progress width="80%" rounded="lg" value={parseFloat(token.weight || '0') * 100} />
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
    );
}

export default PoolComposition;
