import { Box, Flex, HStack } from '@chakra-ui/react';
import NavbarWalletConnectButton from './NavbarWalletConnectButton';
import { NavbarLink } from '~/modules/nav/NavbarLink';
import { useRouter } from 'next/router';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { FadeInOutBox } from '~/components/animation/FadeInOutBox';
import { NavbarPendingRewards } from '~/modules/nav/NavbarPendingRewards';
import { BeetsBalLogo } from '~/assets/logo/BeetsBalLogo';
import { NextLink } from '~/components/link/NextLink';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

interface Props {
    scrollY: MotionValue<number>;
}

export function Navbar({ scrollY }: Props) {
    const { chainId } = useNetworkConfig();
    const router = useRouter();
    const opacity = useTransform(scrollY, [0, 32], [0, 1]);
    const { isConnected } = useUserAccount();

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
                    <Flex alignItems="center" mr="6" zIndex="2" cursor="pointer">
                        <NextLink href="/" chakraProps={{ _focus: { boxShadow: 'none' } }}>
                            <BeetsBalLogo width="132px" />
                        </NextLink>
                    </Flex>
                    <Box flex="1" zIndex="2">
                        <Flex alignItems="center" display={{ base: 'none', md: 'flex' }}>
                            <NavbarLink
                                href={'/pools'}
                                selected={router.asPath.startsWith('/pool')}
                                text="Invest"
                                mr="5"
                            />
                            <NavbarLink href={'/swap'} selected={router.asPath === '/swap'} text="Swap" mr="5" />
                            {chainId === '250' && (
                                <>
                                    <NavbarLink href="https://beets.fi/#/stake" text="Stake" mr={5} />
                                    <NavbarLink href="https://beets.fi/#/launch" text="Launch" mr={5} />
                                </>
                            )}
                            {/*<NavbarAdditionalLinksMenu />*/}
                        </Flex>
                    </Box>
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
