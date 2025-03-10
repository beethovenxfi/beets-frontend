import { Box, useDisclosure, useTheme } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { Navbar } from '~/modules/nav/Navbar';
import { SubNavBar } from '~/modules/nav/SubNavBar';
import { useEffect, useRef } from 'react';
import { useElementScroll } from 'framer-motion';
import { Footer } from '~/modules/nav/Footer';
import { NavbarMobile } from '~/modules/nav/NavbarMobile';
import { GlobalRenderer } from '~/modules/global/GlobalRenderer';
import { UserWarning } from '~/components/user-warning/UserWarning';
import useGlobalWarnings from '~/lib/global/useGlobalWarnings';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { BeetsBridgeModal } from '~/components/bridge/BeetsBridgeModal';
import { useRouter } from 'next/router';
import { networkConfig } from '~/lib/config/network-config';
import { useBeetsBalance } from '~/components/bridge/useBeetsBalance';

export function AppContent({ Component, pageProps }: AppProps) {
    const ref = useRef(null);
    const { scrollY } = useElementScroll(ref);
    const theme = useTheme();
    useGlobalWarnings();
    const { isConnected } = useUserAccount();
    const { hasBalance, isLoading } = useBeetsBalance();

    const router = useRouter();

    const {
        isOpen: isBeetsBridgeModalOpen,
        onOpen: onBeetsBridgeModalOpen,
        onClose: onBeetsBridgeModalClose,
    } = useDisclosure();

    useEffect(() => {
        if (
            !isLoading &&
            isConnected &&
            router.pathname !== '/mabeets' &&
            networkConfig.beetsMigrationEnabled &&
            hasBalance
        ) {
            onBeetsBridgeModalOpen();
        }
    }, [isConnected, isLoading]);

    return (
        <Box
            id="app-content"
            height="full"
            className="bg"
            overflowX="hidden"
            ref={ref}
            css={{
                '&::-webkit-scrollbar': {
                    width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                    width: '6px',
                    background: theme.colors.gray['400'],
                },
                '&::-webkit-scrollbar-thumb': {
                    background: theme.colors.beets.base['300'],
                    borderRadius: '24px',
                },
            }}
        >
            <GlobalRenderer />
            <Box pt="3" />
            <Navbar scrollY={scrollY} />
            <Box pt="1" />
            <SubNavBar />
            <Box display="flex" justifyContent="center" mt="8">
                <Box
                    width={{ base: 'full', '2xl': theme.breakpoints['2xl'] }}
                    px={{ base: '4', xl: '8' }}
                    pb={{ base: '4', xl: '8' }}
                >
                    <Component {...pageProps} />
                </Box>
            </Box>

            <Footer />
            <NavbarMobile />
            <UserWarning />
            <BeetsBridgeModal isOpen={isBeetsBridgeModalOpen} onClose={onBeetsBridgeModalClose} />
        </Box>
    );
}
