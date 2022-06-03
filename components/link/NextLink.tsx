import { Link } from '@chakra-ui/react';
import LinkFromNext, { LinkProps } from 'next/link';
import React from 'react';

export function NextLink({ children, ...rest }: React.PropsWithChildren<LinkProps>) {
    return (
        <LinkFromNext {...rest} passHref>
            <Link>{children}</Link>
        </LinkFromNext>
    );
}
