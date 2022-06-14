import { Box, Button, Flex, Link, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import Image from 'next/image';

import LogoFull from '~/assets/logo/beets-bal.svg';
import WalletConnectButton from '../wallet/WalletConnectButton';
import { NavbarLink } from '~/components/nav/NavbarLink';
import { useRouter } from 'next/router';
import { MotionValue, useTransform, motion } from 'framer-motion';
import { NavbarAdditionalLinksMenu } from '~/components/nav/NavbarAdditionalLinksMenu';

interface Props {
    scrollY: MotionValue<number>;
}

function Navbar({ scrollY }: Props) {
    const router = useRouter();
    const opacity = useTransform(scrollY, [0, 32], [0, 1]);

    return (
        <Flex px="4" py="3" width="full" position="sticky" top="0" zIndex="10000">
            <motion.div style={{ opacity, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                <Box width="full" height="full" bg="beets.base.800" shadow="sm" />
            </motion.div>
            <Flex alignItems="center" mr={8}>
                <Image src={LogoFull} alt="Beethoven X" style={{ width: '144px', minWidth: '144px' }} />
                {/*<Box>
                    <Image src={PoweredByBalancer} alt="Powered by Balancer V2" />
                </Box>*/}
            </Flex>
            <Flex flex={1} alignItems="center" zIndex="1">
                <NavbarLink href={'/trade'} selected={router.asPath === '/trade'} text="Swap" mr={5} />
                <NavbarLink href={'/pools'} selected={router.asPath.startsWith('/pool')} text="Invest" mr={5} />
                <NavbarLink href={'/pools'} text="Stake" mr={5} />
                <NavbarLink href={'/pools'} text="Launch" mr={5} />
                <NavbarAdditionalLinksMenu />
            </Flex>
            <WalletConnectButton />
        </Flex>
    );
}

export default Navbar;
