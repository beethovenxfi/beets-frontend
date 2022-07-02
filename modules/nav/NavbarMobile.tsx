import { NavbarLink } from '~/modules/nav/NavbarLink';
import { Box, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export function NavbarMobile() {
    const router = useRouter();

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
        >
            <Flex alignItems="center">
                <NavbarLink href={'/pools'} selected={router.asPath.startsWith('/pool')} text="Invest" mr="1" px="4" />
                <NavbarLink href={'/trade'} selected={router.asPath === '/trade'} text="Swap" mr="1" px="4" />
                <NavbarLink href={'/pools'} text="Stake" mr="1" px="4" />
                <NavbarLink href={'/pools'} text="Launch" px="4" />
            </Flex>
        </Box>
    );
}
