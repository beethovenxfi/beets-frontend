import { Link as ChakraLink, LinkProps as ChakraLinkProps } from '@chakra-ui/react';
import Link, { LinkProps } from 'next/link';
import React from 'react';

export function NextLink({
    children,
    chakraProps,
    ...rest
}: React.PropsWithChildren<LinkProps> & { chakraProps?: ChakraLinkProps }) {
    return (
        <Link {...rest} passHref>
            <ChakraLink {...chakraProps}>{children}</ChakraLink>
        </Link>
    );
}
