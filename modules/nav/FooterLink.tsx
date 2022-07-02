import { Box, Link, LinkProps } from '@chakra-ui/react';
import { NextLink } from '~/components/link/NextLink';

interface Props extends LinkProps {
    linkType?: 'internal' | 'external';
    href: string;
}

export function FooterLink({ linkType = 'external', href, ...rest }: Props) {
    return (
        <Box mb="4">
            {linkType === 'internal' ? (
                <NextLink href={href}>{rest.children}</NextLink>
            ) : (
                <Link alignSelf="flex-start" href={href} target="_blank" {...rest} />
            )}
        </Box>
    );
}
