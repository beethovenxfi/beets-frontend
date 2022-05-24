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
                    fontSize="lg"
                    color={selected ? 'beets.highlight.alpha.100' : 'beets.gray.100'}
                    cursor="pointer"
                    _hover={{ color: 'beets.highlight.alpha.100' }}
                >
                    {text}
                </Text>
            </Link>
        </Box>
    );
}
