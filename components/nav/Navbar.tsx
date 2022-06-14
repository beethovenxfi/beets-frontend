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
    const scale = useTransform(scrollY, [0, 32], [1, 0.8]);
    const x = useTransform(scrollY, [0, 32], [0, -12]);
    const linksX = useTransform(scrollY, [0, 32], [0, -34]);

    return (
        <Box width="full" position="sticky" top="0" zIndex="10000">
            <motion.div style={{ width: '100%' }}>
                <Flex px="4" py="0" alignItems="center">
                    <motion.div style={{ opacity, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                        <Box width="full" height="full" bg="beets.base.800" shadow="lg" />
                    </motion.div>
                    <Flex alignItems="center" mr={8}>
                        <motion.div style={{ scale, display: 'flex', alignItems: 'center', x }}>
                            <Image src={LogoFull} alt="Beethoven X" style={{ width: '144px', minWidth: '144px' }} />
                        </motion.div>
                        {/*<Box>
                    <Image src={PoweredByBalancer} alt="Powered by Balancer V2" />
                </Box>*/}
                    </Flex>
                    <motion.div style={{ flex: 1, zIndex: 1, x: linksX }}>
                        <Flex alignItems="center">
                            <NavbarLink href={'/trade'} selected={router.asPath === '/trade'} text="Swap" mr={5} />
                            <NavbarLink
                                href={'/pools'}
                                selected={router.asPath.startsWith('/pool')}
                                text="Invest"
                                mr={5}
                            />
                            <NavbarLink href={'/pools'} text="Stake" mr={5} />
                            <NavbarLink href={'/pools'} text="Launch" mr={5} />
                            <NavbarAdditionalLinksMenu />
                        </Flex>
                    </motion.div>
                    <WalletConnectButton />
                </Flex>
            </motion.div>
        </Box>
    );
}

export default Navbar;
