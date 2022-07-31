import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Box, Button } from '@chakra-ui/react';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { ButtonProps } from '@chakra-ui/button';

export function WalletConnectButton(props: Omit<ButtonProps, 'children' | 'onClick'>) {
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
                                        Connect Wallet
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
