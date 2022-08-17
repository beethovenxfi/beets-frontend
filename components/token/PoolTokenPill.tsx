import { BeetsBox } from '~/components/box/BeetsBox';
import TokenAvatar from '~/components/token/TokenAvatar';
import { Box, Flex, Text } from '@chakra-ui/react';
import numeral from 'numeral';
import { useGetTokens } from '~/lib/global/useToken';

interface Token {
    address: string;
    weight?: string | null;
}

interface Props {
    token: Token;
    size?: string;
}

export function PoolTokenPill({ token, size = 'xs' }: Props) {
    const { getToken } = useGetTokens();

    return (
        <BeetsBox p="2">
            <Flex alignItems="center" justify="center">
                <TokenAvatar address={token.address} size={size} />
                <Text ml="2">{getToken(token.address)?.symbol}</Text>
                {token.weight ? <Text ml="2">{numeral(token.weight).format('%')}</Text> : null}
            </Flex>
        </BeetsBox>
    );
}
