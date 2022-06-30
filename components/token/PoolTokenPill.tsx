import { BeetsBox } from '~/components/box/BeetsBox';
import TokenAvatar from '~/components/token/TokenAvatar';
import { Box, Flex, Text } from '@chakra-ui/react';
import numeral from 'numeral';
import { GqlPoolTokenBase } from '~/apollo/generated/graphql-codegen-generated';

// make some props optional so we don't get errors elsewhere
type MakeOptional<Type, Key extends keyof Type> = Omit<Type, Key> & Partial<Pick<Type, Key>>;
type TokenProps = MakeOptional<GqlPoolTokenBase, 'balance' | 'decimals' | 'id' | 'index' | 'name' | 'priceRate'>;

interface Props {
    token: TokenProps;
    rounded?: boolean;
}

export function PoolTokenPill({ token, rounded = true }: Props) {
    const Content = () => (
        <Flex alignItems="center">
            <TokenAvatar address={token.address} size="xs" />
            <Text ml="2">{token.symbol}</Text>
            {token.weight ? <Text ml="2">{numeral(token.weight).format('%')}</Text> : null}
        </Flex>
    );

    return rounded ? (
        <BeetsBox p="2">
            <Content />
        </BeetsBox>
    ) : (
        <Box p="1">
            <Content />
        </Box>
    );
}
