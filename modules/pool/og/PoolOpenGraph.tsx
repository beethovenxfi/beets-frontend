import { Box, Wrap, Text, WrapItem, Grid, GridItem, VStack, Flex } from '@chakra-ui/react';
import numeral from 'numeral';
import { BeetsBox } from '~/components/box/BeetsBox';
import TokenAvatar from '~/components/token/TokenAvatar';
import { useGetTokens } from '~/lib/global/useToken';
import { usePool } from '../lib/usePool';

interface Token {
    address: string;
    weight?: string | null;
}

interface Props {
    token: Token;
    size?: string;
}

export function PoolTokenPill({ token }: Props) {
    const { getToken } = useGetTokens();

    return (
        <BeetsBox p="2" width="250px">
            <Flex alignItems="center" justifyContent="space-evenly">
                <TokenAvatar address={token.address} size="xl" />
                <VStack>
                    {token.weight ? (
                        <Text ml="2" fontWeight="bold" fontSize="2rem">
                            {numeral(token.weight).format('%')}
                        </Text>
                    ) : null}
                    <Text ml="2" fontWeight="bold" fontSize="2rem">
                        {getToken(token.address)?.symbol}
                    </Text>
                </VStack>
            </Flex>
        </BeetsBox>
    );
}

export function PoolOpenGraph() {
    const { pool } = usePool();

    return (
        <Box fontSize="xl">
            <Grid templateColumns={'1fr'} width="1200px" height="630px" id="og" p="50px">
                <GridItem>
                    <VStack width="full" alignItems="flex-start" mb="8">
                        <Text fontWeight="bold" fontSize="5rem" mr="4">
                            {pool.name}
                        </Text>
                        <Wrap>
                            {pool.tokens.map((token, index) => (
                                <WrapItem key={index}>
                                    <PoolTokenPill token={token} />
                                </WrapItem>
                            ))}
                        </Wrap>
                    </VStack>
                </GridItem>
            </Grid>
        </Box>
    );
}
