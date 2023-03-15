import { NavbarLink } from '~/modules/nav/NavbarLink';
import { Box, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function NavbarMobile() {
    const router = useRouter();
    const networkConfig = useNetworkConfig();

    return (
        <Box
            position="sticky"
            bottom="0"
            height="54px"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            bgColor="beets.base.800"
            shadow="lg"
            display={{ base: 'flex', md: 'none' }}
            zIndex="999"
        >
            <Flex alignItems="center">
                <NavbarLink href={'/pools'} selected={router.asPath.startsWith('/pool')} text="Invest" mr="1" px="4" />
                <NavbarLink href={'/swap'} selected={router.asPath === '/swap'} text="Swap" mr="1" px="4" />
                {networkConfig.maBeetsEnabled && (
                    <NavbarLink
                        href={'/mabeets'}
                        selected={router.asPath === '/mabeets'}
                        text="maBEETS"
                        mr="1"
                        px="4"
                    />
                )}

                {networkConfig.launchUrl && <NavbarLink href={networkConfig.launchUrl} text="Launch" px="4" />}
            </Flex>
        </Box>
    );
}
