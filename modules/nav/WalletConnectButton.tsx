import { ConnectButton } from '@rainbow-me/rainbowkit';
import BeetsButton from '../../components/button/Button';
import { Box, HStack, Spinner, Text } from '@chakra-ui/react';
import Image from 'next/image';
import BeetsSmart from '~/assets/icons/beetx-smarts.svg';
import { useReactiveVar } from '@apollo/client';
import { txPendingVar } from '~/lib/util/useSubmitTransaction';
import { IconWallet } from '~/components/icons/IconWallet';
import { BarChart2 } from 'react-feather';
import { useUserData } from '~/lib/user/useUserData';
import numeral from 'numeral';

export default function WalletConnectButton() {
    const txPending = useReactiveVar(txPendingVar);
    const { loading, portfolioValueUSD } = useUserData();

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
                                        <IconWallet stroke="red.500" boxSize="20px" />
                                        <Box ml="2">Connect Wallet</Box>
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
                                <HStack spacing="0" position="relative">
                                    <HStack
                                        bgColor="beets.base.500"
                                        pr="3"
                                        pl="2"
                                        spacing="1"
                                        height="40px"
                                        mr="-1"
                                        roundedTopLeft="md"
                                        roundedBottomLeft="md"
                                    >
                                        <BarChart2 size={18} />
                                        <Box fontSize="sm" fontWeight="semibold">
                                            {numeral(portfolioValueUSD).format('$0.00a')}
                                        </Box>
                                    </HStack>
                                    <BeetsButton
                                        rounded="md"
                                        fontSize="md"
                                        onClick={openAccountModal}
                                        paddingX="none"
                                        padding="3px"
                                        color="gray.100"
                                        zIndex="100"
                                        position="relative"
                                        _hover={{
                                            backgroundColor: 'none',
                                            transform: 'scale(1.05)',
                                        }}
                                        _active={{
                                            backgroundColor: 'none',
                                        }}
                                        bg="beets.base.800"
                                    >
                                        <HStack width="full" height="full" spacing="1">
                                            {/* {account.displayBalance ? ` (${account.displayBalance})` : ''} */}
                                            {/*<Box>{account.ensAvatar}</Box>*/}
                                            <HStack
                                                justifyContent="center"
                                                alignItems="center"
                                                px="2"
                                                height="40px"
                                                rounded="10px"
                                                width="full"
                                            >
                                                {txPending ? (
                                                    <Spinner color="beets.green" />
                                                ) : (
                                                    <Image src={BeetsSmart} width="24" alt="your-profile" />
                                                )}
                                                <Text>{account.displayName}</Text>
                                            </HStack>
                                        </HStack>
                                    </BeetsButton>
                                </HStack>
                            );
                        })()}
                    </Box>
                );
            }}
        </ConnectButton.Custom>
    );
}
