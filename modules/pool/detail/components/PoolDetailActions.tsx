import { BeetsBox } from '~/components/box/BeetsBox';
import { Box, BoxProps, Flex, Text } from '@chakra-ui/react';
import { usePool } from '~/modules/pool/lib/usePool';
import numeral from 'numeral';
import TokenAvatar from '~/components/token/TokenAvatar';

interface Props extends BoxProps {}

export function PoolDetailActions({ ...rest }: Props) {
    const { pool } = usePool();

    return (
        <BeetsBox {...rest}>
            <Box borderBottomWidth={1} p={4} display="flex">
                <Text fontSize="xl" fontWeight="bold" flex={1}>
                    My pool balance
                </Text>
                <Text fontSize="xl" fontWeight="bold">
                    $1,123.42
                </Text>
            </Box>
            <Box p={4} pb={0}>
                {pool.tokens.map((token, index) => (
                    <Flex key={index} pb={4}>
                        <TokenAvatar address={token.address} size="sm" mr={4} mt={1} />
                        <Box flex={1}>
                            <Text fontSize="xl" flex={1}>
                                {token.weight ? `${numeral(token.weight).format('%')} ` : null}
                                {token.symbol}
                            </Text>
                            <Text color="beets.gray.200">{token.name}</Text>
                        </Box>

                        <Box>
                            <Text fontSize="xl" textAlign="right">
                                123.22
                            </Text>
                            <Text textAlign="right" color="beets.gray.200">
                                $225.22
                            </Text>
                        </Box>

                        <Flex></Flex>
                    </Flex>
                ))}
            </Box>
        </BeetsBox>
    );
}
