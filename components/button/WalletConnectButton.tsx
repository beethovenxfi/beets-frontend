import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Box, Button } from '@chakra-ui/react';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { ButtonProps } from '@chakra-ui/button';
import { MotionProps } from 'framer-motion';
import { IconWallet } from '../icons/IconWallet';

export function WalletConnectButton(props: Omit<ButtonProps, 'children' | 'onClick'> & MotionProps) {
    const { isConnected } = useUserAccount();

    if (isConnected) {
        return null;
    }

    return (
        <ConnectButton.Custom>
            {({ account, chain, openConnectModal, mounted }) => {
                return (
                    <Box>
                        {(() => {
                            if (!mounted || !account || !chain) {
                                return (
                                    <Button variant="primary" onClick={openConnectModal} {...props}>
                                        <IconWallet stroke="black" boxSize="20px" />
                                        <Box ml="2">Connect Wallet</Box>
                                    </Button>
                                );
                            }

                            return null;
                        })()}
                    </Box>
                );
            }}
        </ConnectButton.Custom>
    );
}
