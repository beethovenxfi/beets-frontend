import { GqlPoolTokenUnion } from '~/apollo/generated/graphql-codegen-generated';
import { Box, HStack, Progress, Td, Text, Tr } from '@chakra-ui/react';
import numeral from 'numeral';
import TokenAvatar from '~/components/token/TokenAvatar';
import { CornerDownRight } from 'react-feather';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { tokenFormatAmount } from '~/lib/services/token/token-util';

interface Props {
    token: GqlPoolTokenUnion;
    tokenPrice: number;
    userHasBalance: boolean;
    userBalance: AmountHumanReadable;
    nestedLevel: 0 | 1 | 2;
}

export function PoolCompositionRow({ token, tokenPrice, userHasBalance, userBalance, nestedLevel }: Props) {
    return (
        <>
            <Tr key={`composition-${token.symbol}`} padding="2" width="full" background="whiteAlpha.100">
                <Td
                    borderBottom="0"
                    p="2"
                    marginBottom="4"
                    borderTopLeftRadius="lg"
                    borderBottomLeftRadius="lg"
                    paddingLeft={nestedLevel === 0 ? '2' : nestedLevel * 8}
                >
                    <HStack>
                        {nestedLevel > 0 ? (
                            <Box color="whiteAlpha.400">
                                <CornerDownRight />
                            </Box>
                        ) : null}
                        <TokenAvatar size="xs" address={token.address} />
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
                    {nestedLevel === 0 && (
                        <Progress width="80%" rounded="lg" value={parseFloat(token.weight || '0') * 100} />
                    )}
                </Td>
                {userHasBalance && nestedLevel === 0 && (
                    <>
                        <Td borderBottom="0" p="2" marginBottom="4">
                            <Text fontSize="sm" color="beets.base.50">
                                {tokenFormatAmount(userBalance)}
                            </Text>
                        </Td>
                        <Td borderBottom="0" p="2" marginBottom="4">
                            <Text fontSize="sm" color="beets.base.50">
                                {numeral(parseFloat(userBalance) * tokenPrice).format('$0,0.00a')}
                            </Text>
                        </Td>
                    </>
                )}
                {userHasBalance && nestedLevel > 0 && (
                    <>
                        <Td borderBottom="0" p="2" marginBottom="4" />
                        <Td borderBottom="0" p="2" marginBottom="4" />
                    </>
                )}
                <Td borderBottom="0" p="2" marginBottom="4">
                    <Text fontSize="sm" color="beets.base.50">
                        {tokenFormatAmount(token.balance)}
                    </Text>
                </Td>
                <Td borderBottom="0" p="2" marginBottom="4" borderTopRightRadius="lg" borderBottomRightRadius="lg">
                    <Text fontSize="sm" color="beets.base.50">
                        {numeral(parseFloat(token.balance) * tokenPrice).format('$0,0.00a')}
                    </Text>
                </Td>
            </Tr>
        </>
    );
}
