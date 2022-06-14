import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import Image from 'next/image';

import LogoFull from '~/assets/logo/beets-bal.svg';
import WalletConnectButton from '../wallet/WalletConnectButton';
import { NavbarLink } from '~/components/nav/NavbarLink';
import { useRouter } from 'next/router';
import { AnimatePresence, motion, MotionValue, useTransform } from 'framer-motion';
import { NavbarAdditionalLinksMenu } from '~/components/nav/NavbarAdditionalLinksMenu';
import { useState } from 'react';
import { BarChart2 } from 'react-feather';
import StarsIcon from '~/components/apr-tooltip/StarsIcon';
import { useUserAccount } from '~/lib/global/useUserAccount';

interface Props {
    scrollY: MotionValue<number>;
}

function Navbar({ scrollY }: Props) {
    const router = useRouter();
    const opacity = useTransform(scrollY, [0, 32], [0, 1]);
    const [minimized, setMinimized] = useState(false);
    const { isConnected } = useUserAccount();

    scrollY.onChange((latest) => {
        if (latest > 16 && !minimized) {
            setMinimized(true);
        } else if (latest <= 16 && minimized) {
            setMinimized(false);
        }
    });

    return (
        <Box width="full" position="sticky" top="0" zIndex="10000">
            <motion.div style={{ width: '100%' }}>
                <Flex px="4" py="0" alignItems="center">
                    <motion.div style={{ opacity, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                        <Box width="full" height="full" bg="beets.base.800" shadow="lg" />
                    </motion.div>
                    <Flex alignItems="center" mr={8}>
                        <motion.div
                            animate={{ x: minimized ? -12 : 0, scale: minimized ? 0.8 : 1 }}
                            style={{ display: 'flex', alignItems: 'center' }}
                            transition={{
                                x: { type: 'keyframes' },
                                scale: { type: 'keyframes' },
                            }}
                        >
                            <Image src={LogoFull} alt="Beethoven X" style={{ width: '144px', minWidth: '144px' }} />
                        </motion.div>
                        {/*<Box>
                    <Image src={PoweredByBalancer} alt="Powered by Balancer V2" />
                </Box>*/}
                    </Flex>
                    <motion.div
                        animate={{ x: minimized ? -34 : 0 }}
                        style={{ flex: 1, zIndex: 1 }}
                        transition={{
                            x: { type: 'keyframes' },
                        }}
                    >
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
                    <AnimatePresence>
                        {isConnected ? (
                            <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}>
                                <Button variant="unstyled" ml="3">
                                    <HStack px="2">
                                        <StarsIcon />
                                        <Box>$12.22</Box>
                                    </HStack>
                                </Button>
                                <Button variant="unstyled" mx="3">
                                    <HStack px="2">
                                        <Box
                                            bgColor="beets.base.400"
                                            width="32px"
                                            height="32px"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            borderRadius="md"
                                        >
                                            <BarChart2 />
                                        </Box>
                                        <Box>$2,234.22</Box>
                                    </HStack>
                                </Button>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                    <WalletConnectButton />
                </Flex>
            </motion.div>
        </Box>
    );
}

export default Navbar;
