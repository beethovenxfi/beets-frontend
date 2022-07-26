import { Box, Link, LinkProps } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { NextLink } from '~/components/link/NextLink';

interface Props extends LinkProps {
    children: ReactNode | ReactNode[];
    linkType?: 'internal' | 'external';
    href: string;
}

export function FooterLink({ linkType = 'external', href, ...rest }: Props) {
    return (
        <Box mb="4">
            {linkType === 'internal' ? (
                <NextLink chakraProps={{ color: 'white' }} href={href}>
                    {rest.children}
                </NextLink>
            ) : (
                <Link color="white" alignSelf="flex-start" href={href} target="_blank" {...rest} />
            )}
        </Box>
    );
}
