import { Box, Wrap, Text, WrapItem, Grid, GridItem, VStack, Flex } from '@chakra-ui/react';
import numeral from 'numeral';
import { BeetsBox } from '~/components/box/BeetsBox';
import TokenAvatar from '~/components/token/TokenAvatar';
import { useGetTokens } from '~/lib/global/useToken';
import { usePool } from '../lib/usePool';
import Image from 'next/image';
import InvestMastheadImage from '~/assets/images/invest-masthead-image.png';
import InvestMastheadOpImage from '~/assets/images/invest-masthead-image-OP.png';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
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
        <BeetsBox p="2" width="265px">
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
    const { chainId } = useNetworkConfig();

    return (
        <Box fontSize="xl">
            <Box position="relative" top="297.5px" left="925px">
                <Image
                    src={chainId === '10' ? InvestMastheadOpImage : InvestMastheadImage}
                    width="208.62px"
                    height="68px"
                    alt="masthead"
                />
            </Box>
            <Grid templateColumns={'1fr'} width="1200px" height="630px" id="og" p="50px">
                <GridItem>
                    <VStack height="full" justify="space-between">
                        <Text
                            fontWeight="bold"
                            fontSize="5rem"
                            mr="4"
                            borderBottomWidth="5px"
                            borderBottomColor="beets.base.500"
                        >
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
