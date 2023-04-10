import { Box, BoxProps, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useMemo } from 'react';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

interface Props extends Omit<BoxProps, 'children'> {
    selected?: boolean;
    href: string;
    text: string;
}

export function NavbarLink({ href, selected, text, ...rest }: Props) {
    const { protocol } = useNetworkConfig();

    const textStyle = useMemo(() => {
        if (protocol === 'balancer') {
            return {
                color: selected ? 'beets.secondary.900' : 'beets.gray',
                fontWeight: selected ? 'medium' : 'normal',
                _hover: { color: 'beets.secondary.900' },
            };
        } else {
            return {
                color: selected ? 'beets.highlight' : 'gray.100',
                fontWeight: 'normal',
                _hover: { color: 'beets.highlight' },
            };
        }
    }, [protocol, selected]);

    return (
        <Box {...rest}>
            <Link href={href}>
                <Text
                    fontSize="md"
                    cursor="pointer"
                    {...textStyle}
                >
                    {text}
                </Text>
            </Link>
        </Box>
    );
}
