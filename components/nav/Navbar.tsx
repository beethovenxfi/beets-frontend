import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import Image from 'next/image';
import NextLink from 'next/link';
import LogoFull from '~/assets/logo/beets-bal.svg';
import WalletConnectButton from '../wallet/WalletConnectButton';
import { NavbarLink } from '~/components/nav/NavbarLink';
import { useRouter } from 'next/router';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { NavbarAdditionalLinksMenu } from '~/components/nav/NavbarAdditionalLinksMenu';
import { useState } from 'react';
import StarsIcon from '~/components/apr-tooltip/StarsIcon';
import { useUserAccount } from '~/lib/global/useUserAccount';
import { NavbarPortfolioDrawer } from '~/components/nav/NavbarPortfolioDrawer';
import { FadeInOutBox } from '~/components/animation/FadeInOutBox';

interface Props {
    scrollY: MotionValue<number>;
}

export function Navbar({ scrollY }: Props) {
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
        <Box width="full" position="sticky" top="0" zIndex="3">
            <Flex px={{ base: '4', xl: '8' }} py="0" alignItems="center">
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
                        <NextLink href="/">
                            <Box cursor="pointer">
                                <Image src={LogoFull} alt="Beethoven X" style={{ width: '144px', minWidth: '144px' }} />
                            </Box>
                        </NextLink>
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
                        <NavbarLink href={'/pools'} selected={router.asPath.startsWith('/pool')} text="Invest" mr={5} />
                        <NavbarLink href={'/pools'} text="Stake" mr={5} />
                        <NavbarLink href={'/pools'} text="Launch" mr={5} />
                        <NavbarAdditionalLinksMenu />
                    </Flex>
                </motion.div>
                <FadeInOutBox mr="3" isVisible={isConnected}>
                    <HStack spacing="3">
                        <Button
                            variant="unstyled"
                            bgColor="beets.lightAlpha.200"
                            width="54px"
                            height="40px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                        >
                            <StarsIcon width={15} height={16} />
                            <Box fontSize="11px" pt="0.5">
                                $112.23
                            </Box>
                        </Button>
                        <NavbarPortfolioDrawer />
                    </HStack>
                </FadeInOutBox>
                <WalletConnectButton />
            </Flex>
        </Box>
    );
}
