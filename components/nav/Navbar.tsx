import { Box, Flex } from '@chakra-ui/react';
import Image from 'next/image';

import LogoFull from '~/assets/logo/beets-logo.svg';
import PoweredByBalancer from '~/assets/images/powered-by-balancer.svg';
import WalletConnectButton from '../wallet/WalletConnectButton';
import { NavbarLink } from '~/components/nav/NavbarLink';
import { useRouter } from 'next/router';

function Navbar() {
    const router = useRouter();

    return (
        <Flex width="full" padding="4">
            <Flex alignItems="center" mr={8}>
                <Image src={LogoFull} alt="Beethoven X" />
                {/*<Box>
                    <Image src={PoweredByBalancer} alt="Powered by Balancer V2" />
                </Box>*/}
            </Flex>
            <Flex flex={1} alignItems="center">
                <NavbarLink href={'/trade'} selected={router.asPath === '/trade'} text="Swap" mr={5} />
                <NavbarLink href={'/pools'} selected={router.asPath === '/pools'} text="Invest" mr={5} />
                <NavbarLink href={'/pools'} text="Stake" mr={5} />
                <NavbarLink href={'/pools'} text="Launch" />
            </Flex>
            <WalletConnectButton />
        </Flex>
    );
}

export default Navbar;
