import { BeetsBox } from '~/components/box/BeetsBox';
import TokenAvatar from '~/components/token/TokenAvatar';
import { Box, Flex, Text } from '@chakra-ui/react';
import numeral from 'numeral';

interface Token {
    address: string;
    weight: string;
    symbol: string;
}

interface Props {
    token: Token;
    rounded?: boolean;
}

export function PoolTokenPill({ token, rounded = true }: Props) {
    const MainContent = () => (
        <Flex alignItems="center">
            <TokenAvatar address={token.address} size="xs" />
            <Text ml="2">{token.symbol}</Text>
            {token.weight ? <Text ml="2">{numeral(token.weight).format('%')}</Text> : null}
        </Flex>
    );

    return rounded ? (
        <BeetsBox p="2">
            <MainContent />
        </BeetsBox>
    ) : (
        <Box p="1">
            <MainContent />
        </Box>
    );
}
