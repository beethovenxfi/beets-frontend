import { Flex, Link, LinkProps, Text } from '@chakra-ui/react';
import { ArrowUp, ArrowDown } from 'react-feather';
import { GqlPoolOrderDirection } from '~/apollo/generated/graphql-codegen-generated';

interface Props extends LinkProps {
    title: string;
    orderDirection?: GqlPoolOrderDirection | null;
}

export default function PoolListSortLink({ title, orderDirection, ...rest }: Props) {
    return (
        <Link color={orderDirection ? 'beets.green.500' : 'beets.gray.100'} {...rest} userSelect="none">
            <Flex justifyContent="flex-end" alignItems="center">
                <Text mr={orderDirection ? 0.5 : 0} fontSize="md" fontWeight="medium">
                    {title}
                </Text>
                {orderDirection === 'asc' ? <ArrowUp size={20} /> : null}
                {orderDirection === 'desc' ? <ArrowDown size={20} /> : null}
            </Flex>
        </Link>
    );
}
