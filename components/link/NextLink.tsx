import { Link as ChakraLink, LinkProps as ChakraLinkProps, LinkOverlay, LinkOverlayProps } from '@chakra-ui/react';
import Link, { LinkProps } from 'next/link';
import React from 'react';

export function NextLink({
    children,
    chakraProps,
    ...rest
}: React.PropsWithChildren<LinkProps> & { chakraProps?: ChakraLinkProps }) {
    return (
        <Link {...rest} passHref legacyBehavior>
            <ChakraLink {...chakraProps}>{children}</ChakraLink>
        </Link>
    );
}

export function NextLinkOverlay({
    children,
    chakraProps,
    ...rest
}: React.PropsWithChildren<LinkProps> & { chakraProps?: LinkOverlayProps }) {
    return (
        <Link {...rest} passHref legacyBehavior>
            <LinkOverlay {...chakraProps}>{children}</LinkOverlay>
        </Link>
    );
}
