import { Flex, ButtonProps, Text, Button } from '@chakra-ui/react';
import { ArrowUp, ArrowDown } from 'react-feather';
import { GqlPoolOrderDirection } from '~/apollo/generated/graphql-codegen-generated';

interface Props extends ButtonProps {
    title: string;
    orderDirection?: GqlPoolOrderDirection | null;
}

export default function PoolListSortLink({ title, orderDirection, ...rest }: Props) {
    const selected = !!orderDirection ? { 'data-selected': true } : {};
    return (
        <Button
            variant='tableSort'
            {...selected}
            {...rest}
            >
            <Flex justifyContent="flex-end" alignItems="center">
                <Text mr={orderDirection ? 0.5 : 0} fontSize="md" fontWeight="semibold">
                    {title}
                </Text>
                {orderDirection === 'asc' ? <ArrowUp size={20} /> : null}
                {orderDirection === 'desc' ? <ArrowDown size={20} /> : null}
            </Flex>
        </Button>
    );
}
