import { Box, Button, Flex, HStack, Image, Tooltip } from '@chakra-ui/react';
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
import { networkConfig } from '~/lib/config/network-config';
import { NetworkSelectorPopover } from '~/modules/nav/NetworkSelectorPopover';
import { Badge } from '@chakra-ui/layout';

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
                            {networkConfig.stakeUrl && <NavbarLink href={networkConfig.stakeUrl} text="Stake" mr={5} />}
                            {networkConfig.launchUrl && (
                                <NavbarLink href={networkConfig.launchUrl} text="Launch" mr={5} />
                            )}

                            <Tooltip label="Welcome to the new Beethoven X UI. No new smart contracts have been introduced. We've done a complete overhaul of the UI and infrastructure that supports it. Please reach out to us on discord if you run into any issues.">
                                <Badge colorScheme="orange">UI BETA</Badge>
                            </Tooltip>
                            {/*<NavbarAdditionalLinksMenu />*/}
                        </Flex>
                    </Box>
                    <FadeInOutBox mr="3" isVisible={isConnected}>
                        <HStack spacing="3">
                            <NetworkSelectorPopover>
                                <Button
                                    bgColor="beets.lightAlpha.200"
                                    width="50px"
                                    height="40px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    flexDirection="column"
                                    _hover={{ transform: 'scale(1.1)' }}
                                    px="0"
                                >
                                    <Image width="24px" height="24px" src={networkConfig.eth.iconUrl} />
                                </Button>
                            </NetworkSelectorPopover>
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
