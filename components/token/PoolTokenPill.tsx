import { BeetsBox } from '~/components/box/BeetsBox';
import TokenAvatar from '~/components/token/TokenAvatar';
import { Avatar, Box, Circle, Flex, Popover, PopoverContent, PopoverTrigger, Text } from '@chakra-ui/react';
import numeral from 'numeral';
import { useGetTokens } from '~/lib/global/useToken';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { useGetLgeToken } from '~/modules/lges/components/lib/useGetLgeToken';

interface DisplayToken {
    address: string;
    weight?: string | null;
    nestedTokens?: { address: string }[] | null;
    logoUri?: string;
}

interface Props {
    token: DisplayToken;
}

export function PoolTokenPill({ token }: Props) {
    const { getToken } = useGetTokens();
    const { token: lgeToken } = useGetLgeToken(token.address);

    const content = (
        <BeetsBox p="2">
            <Flex alignItems="center">
                <TokenAvatar address={token.address} size="xs" logoURI={token.logoUri} />
                <Text ml="2">
                    {token.nestedTokens
                        ? token.nestedTokens.map((nestedToken) => getToken(nestedToken.address)?.symbol).join('/')
                        : token.logoUri
                        ? lgeToken?.symbol
                        : getToken(token.address)?.symbol}
                </Text>
                {token.weight ? <Text ml="2">{numeral(token.weight).format('%')}</Text> : null}
            </Flex>
        </BeetsBox>
    );

    if (!token.nestedTokens) {
        return content;
    }

    return (
        <>
            <Popover trigger="hover">
                <PopoverTrigger>
                    <button>{content}</button>
                </PopoverTrigger>
                <PopoverContent w="fit-content" bgColor="beets.base.800" shadow="2xl" p="1">
                    {token.nestedTokens.map((nestedToken, index) => (
                        <Box key={index}>
                            <Flex alignItems="center" p="1">
                                <TokenAvatar address={nestedToken.address} size="xs" />
                                <Text ml="2">{getToken(nestedToken.address)?.symbol}</Text>
                            </Flex>
                        </Box>
                    ))}
                </PopoverContent>
            </Popover>
        </>
    );
}
