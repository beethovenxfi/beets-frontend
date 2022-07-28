import { ConnectButton } from '@rainbow-me/rainbowkit';
import BeetsButton, { BeetsButtonProps } from '../../components/button/Button';
import { Box } from '@chakra-ui/react';
import { useUserAccount } from '~/lib/user/useUserAccount';

export function WalletConnectButton(props: Omit<BeetsButtonProps, 'children' | 'onClick'>) {
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
                                    <BeetsButton onClick={openConnectModal} {...props}>
                                        Connect Wallet
                                    </BeetsButton>
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
