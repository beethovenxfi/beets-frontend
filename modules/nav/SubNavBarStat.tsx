import { HStack, Skeleton, StackProps, Text } from '@chakra-ui/react';

import numeral from 'numeral';

interface Props extends StackProps {
    loading: boolean;
    value: string;
    label: string;
}

export function SubNavBarStat({ label, value, loading, ...rest }: Props) {
    return (
        <HStack mr={5} {...rest}>
            <Text color="gray.200" fontSize={{ base: 'sm', lg: 'md' }}>
                {label}:
            </Text>
            {loading ? (
                <Skeleton height="16px" width="54px" />
            ) : (
                <Text fontWeight="semibold" fontSize={{ base: 'sm', lg: 'md' }}>
                    {numeral(value).format('$0.00a')}
                </Text>
            )}
        </HStack>
    );
}
