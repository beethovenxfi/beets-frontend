import { ConnectButton } from '@rainbow-me/rainbowkit';
import BeetsButton from '../button/Button';
import { Box, HStack, Text, Spinner, Button } from '@chakra-ui/react';
import Image from 'next/image';
import BeetsSmart from '~/assets/icons/beetx-smarts.svg';
import { useReactiveVar } from '@apollo/client';
import { txPendingVar } from '~/lib/util/useSubmitTransaction';

export default function WalletConnectButton() {
    const txPending = useReactiveVar(txPendingVar);

    return (
        <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                return (
                    <Box>
                        {(() => {
                            if (!mounted || !account || !chain) {
                                return (
                                    <BeetsButton
                                        _hover={{
                                            backgroundColor: 'beets.green',
                                            transform: 'scale(1.1)',
                                        }}
                                        _active={{
                                            backgroundColor: 'beets.green',
                                        }}
                                        onClick={openConnectModal}
                                        type="button"
                                    >
                                        Connect Wallet
                                    </BeetsButton>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <BeetsButton
                                        backgroundColor="red.400"
                                        _hover={{ backgroundColor: 'red.600' }}
                                        onClick={openChainModal}
                                        type="button"
                                    >
                                        Wrong network
                                    </BeetsButton>
                                );
                            }

                            return (
                                <HStack>
                                    <Button onClick={openAccountModal} variant="unstyled">
                                        <HStack height="40px" width="full" px="2">
                                            {txPending ? (
                                                <Spinner color="beets.green" />
                                            ) : (
                                                <Image src={BeetsSmart} width="28" alt="your-profile" />
                                            )}
                                            <Text>{account.displayName}</Text>
                                        </HStack>
                                    </Button>
                                </HStack>
                            );
                        })()}
                    </Box>
                );
            }}
        </ConnectButton.Custom>
    );
}
