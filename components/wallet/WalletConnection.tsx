import { apiProvider, configureChains, ConnectButton, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { createClient } from 'wagmi';
import BeetsButton from '../button/Button';
import { Box, HStack, Text } from '@chakra-ui/layout';
import Image from 'next/image';
import { ChevronDown } from 'react-feather';
import BeetsSmart from '~/assets/icons/beetx-smarts.svg';

const fantomChain = {
    id: 250,
    name: 'Fantom Opera',
    nativeCurrency: {
        name: 'Fantom',
        symbol: 'FTM',
        decimals: 18,
    },
    rpcUrls: {
        default: 'https://rpc.ftm.tools/',
    },
    blockExplorers: {
        etherscan: {
            name: 'FTM Scan',
            url: 'https://ftmscan.com/',
        },
        default: {
            name: 'FTM Scan',
            url: 'https://ftmscan.com/',
        },
    },
    testnet: false,
};

export const { chains, provider } = configureChains(
    [fantomChain],
    [apiProvider.jsonRpc((_) => ({ rpcUrl: 'https://rpc.ftm.tools/' }))],
);

const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    chains,
});

export const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

export default function BeetsConnectButton() {
    return (
        <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                return (
                    <Box>
                        {(() => {
                            if (!mounted || !account || !chain) {
                                return (
                                    <BeetsButton
                                        backgroundColor="beets.navy.400"
                                        _hover={{
                                            backgroundColor: 'beets.navy.300',
                                            transform: 'scale(1.1)',
                                        }}
                                        _active={{
                                            backgroundColor: 'beets.navy.300',
                                        }}
                                        color="beets.gray.100"
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
                                    <BeetsButton
                                        bg="beets.navy.400"
                                        rounded="xl"
                                        fontSize="md"
                                        onClick={openAccountModal}
                                        paddingX="none"
                                        padding="3px"
                                        color="beets.gray.100"
                                        _hover={{
                                            backgroundColor: 'none',
                                            transform: 'scale(1.05)',
                                        }}
                                        _active={{
                                            backgroundColor: 'none',
                                        }}
                                    >
                                        <HStack width="full" height="full" spacing="1">
                                            <Box paddingLeft="2">{account.balanceFormatted} FTM</Box>
                                            {/* {account.displayBalance ? ` (${account.displayBalance})` : ''} */}
                                            <Box>{account.ensAvatar}</Box>
                                            <HStack
                                                justifyContent="center"
                                                alignItems="center"
                                                padding="2"
                                                height="full"
                                                rounded="10px"
                                                bg="beets.navy.700"
                                                width="full"
                                            >
                                                <Image src={BeetsSmart} width="24" alt="your-profile" />
                                                <Text>{account.displayName}</Text>
                                                <ChevronDown />
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
