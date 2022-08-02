import { Box, Flex, HStack, chakra } from '@chakra-ui/react';
import Image from 'next/image';
import NextLink from 'next/link';
import LogoFull from '~/assets/logo/beets-bal.svg';
import NavbarWalletConnectButton from './NavbarWalletConnectButton';
import { NavbarLink } from '~/modules/nav/NavbarLink';
import { useRouter } from 'next/router';
import { motion, MotionValue, useAnimation, useTransform } from 'framer-motion';
import { NavbarAdditionalLinksMenu } from '~/modules/nav/NavbarAdditionalLinksMenu';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { FadeInOutBox } from '~/components/animation/FadeInOutBox';
import { NavbarPendingRewards } from '~/modules/nav/NavbarPendingRewards';
import { BeetsBalLogo } from '~/assets/logo/BeetsBalLogo';

interface Props {
    scrollY: MotionValue<number>;
}

const ChakraImage = chakra(Image);

const transition = { type: 'spring', stiffness: 250, damping: 25 };

export function Navbar({ scrollY }: Props) {
    const router = useRouter();
    const opacity = useTransform(scrollY, [0, 32], [0, 1]);
    const logoControls = useAnimation();
    const menuControls = useAnimation();
    const { isConnected } = useUserAccount();

    scrollY.onChange((latest) => {
        if (latest > 16) {
            logoControls.start({
                translateX: -12,
                scale: 1,
                transition,
            });
            menuControls.start({
                translateX: -34,
                transition,
            });
        } else if (latest <= 16) {
            logoControls.start({
                translateX: 0,
                scale: 1.2,
                transition,
            });
            menuControls.start({
                translateX: 0,
                transition,
            });
        }
    });

    /*function template({ scale, translateX }: { scale: number; translateX: number }) {
        return `scale(${scale}) translateX(${translateX})`;
    }*/

    return (
        <>
            <Box
                width="full"
                position="sticky"
                top="0"
                zIndex="3"
                height="54px"
                display="flex"
                flexDirection="column"
                justifyContent="center"
            >
                <Flex px={{ base: '4', xl: '8' }} py="0" alignItems="center">
                    <motion.div style={{ opacity, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                        <Box width="full" height="full" bg="beets.base.800" shadow="lg" />
                    </motion.div>
                    <Flex alignItems="center" mr={8} ml="3">
                        <motion.div
                            initial={{ scale: 1.2 }}
                            //transformTemplate={template}
                            animate={logoControls}
                            style={{ display: 'flex', alignItems: 'center' }}
                            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                        >
                            <NextLink href="/">
                                <Box cursor="pointer">
                                    <BeetsBalLogo
                                        //alt="Beethoven X"
                                        //style={{ width: '115px', minWidth: '115px' }}
                                        // width="142px"
                                        width="115px"
                                        //height="30px"
                                    />
                                </Box>
                            </NextLink>
                        </motion.div>
                        {/*<Box>
                    <Image src={PoweredByBalancer} alt="Powered by Balancer V2" />
                </Box>*/}
                    </Flex>
                    <motion.div
                        animate={menuControls}
                        style={{ flex: 1, zIndex: 1 }}
                        transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                    >
                        <Flex alignItems="center" display={{ base: 'none', md: 'flex' }}>
                            <NavbarLink
                                href={'/pools'}
                                selected={router.asPath.startsWith('/pool')}
                                text="Invest"
                                mr={5}
                            />
                            <NavbarLink href={'/swap'} selected={router.asPath === '/swap'} text="Swap" mr={5} />
                            <NavbarLink href={'/pools'} text="Stake" mr={5} />
                            <NavbarLink href={'/pools'} text="Launch" mr={5} />
                            {/*<NavbarAdditionalLinksMenu />*/}
                        </Flex>
                    </motion.div>
                    <FadeInOutBox mr="3" isVisible={isConnected}>
                        <HStack spacing="3">
                            <NavbarPendingRewards />
                            {/*<NavbarAlerts />*/}
                            {/*<NavbarPortfolioDrawer />*/}
                        </HStack>
                    </FadeInOutBox>
                    <NavbarWalletConnectButton />
                </Flex>
            </Box>
        </>
    );
}
