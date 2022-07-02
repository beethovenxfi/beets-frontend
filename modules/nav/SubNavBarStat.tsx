import { HStack, StackProps, Text } from '@chakra-ui/react';
import { BeetsSkeleton } from '~/components/skeleton/BeetsSkeleton';
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
                <BeetsSkeleton height="16px" width="54px" />
            ) : (
                <Text fontWeight="semibold" fontSize={{ base: 'sm', lg: 'md' }}>
                    {numeral(value).format('$0.00a')}
                </Text>
            )}
        </HStack>
    );
}
