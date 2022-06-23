import { Box, Link as ChakraLink, LinkProps, Text, TextProps, BoxProps } from '@chakra-ui/react';
import Link from 'next/link';

interface Props extends Omit<BoxProps, 'children'> {
    selected?: boolean;
    href: string;
    text: string;
}

export function NavbarLink({ href, selected, text, ...rest }: Props) {
    return (
        <Box {...rest}>
            <Link href={href}>
                <Text
                    fontSize="md"
                    color={selected ? 'beets.cyan' : 'gray.100'}
                    cursor="pointer"
                    _hover={{ color: 'beets.cyan' }}
                >
                    {text}
                </Text>
            </Link>
        </Box>
    );
}
