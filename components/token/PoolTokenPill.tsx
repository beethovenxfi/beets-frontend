import { BeetsBox } from '~/components/box/BeetsBox';
import TokenAvatar from '~/components/token/TokenAvatar';
import { Flex, Text } from '@chakra-ui/react';
import numeral from 'numeral';
import { GqlPoolTokenBase } from '~/apollo/generated/graphql-codegen-generated';

interface Props {
    token: GqlPoolTokenBase;
}

export function PoolTokenPill({ token }: Props) {
    return (
        <BeetsBox p={2} mr={2}>
            <Flex alignItems="center">
                <TokenAvatar address={token.address} size={'sm'} />
                <Text ml={2}>{token.symbol}</Text>
                {token.weight ? <Text ml={2}>{numeral(token.weight).format('%')}</Text> : null}
            </Flex>
        </BeetsBox>
    );
}
