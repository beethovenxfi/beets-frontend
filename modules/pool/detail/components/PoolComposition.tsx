import { GqlPoolUnion, useGetTokenPricesQuery } from '~/apollo/generated/graphql-codegen-generated';
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
import TokenAvatar from '~/components/token/TokenAvatar';
import { poolIsWeightedLikePool, poolGetTokensWithoutPhantomBpt } from '~/lib/services/pool/pool-util';
import { ExternalLink } from 'react-feather';
import { etherscanGetTokenUrl } from '~/lib/util/etherscan';
import { useGetTokens } from '~/lib/global/useToken';
import numeral from 'numeral';
import PoolCompositionToken from '~/modules/pool/detail/components/PoolCompositionToken';
import { BeetsBox } from '~/components/box/BeetsBox';
import { PoolCompositionChart } from '~/modules/pool/detail/components/PoolCompositionChart';
import Card from '~/components/card/Card';
interface Props {
    pool: GqlPoolUnion;
}

function PoolComposition({ pool }: Props) {
    const poolTokens = poolGetTokensWithoutPhantomBpt(pool);
    const { priceFor } = useGetTokens();

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
    );
}

export default PoolComposition;
