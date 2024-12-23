import { Box, Button, Heading, HStack, Modal, ModalCloseButton, ModalOverlay, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { BeetsTokenApprovalButton } from '~/components/button/BeetsTokenApprovalButton';
import { TokenBase } from '~/lib/services/token/token-types';
import { networkConfig } from '~/lib/config/network-config';
import { BeetsMigrationButton } from './BeetsMigrationButton';
import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { BeetsModalBody, BeetsModalContent, BeetsModalHeader } from '~/components/modal/BeetsModal';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    oldBeetsBalance: string;
    tokenData: TokenBase | null;
}

export function BeetsMigration({ oldBeetsBalance, tokenData, isOpen, onClose }: Props) {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const { hasApprovalForAmount, isLoading, refetch } = useUserAllowances([tokenData], networkConfig.beets.migration);
    const hasApprovedToken = hasApprovalForAmount(tokenData?.address || '', oldBeetsBalance);

    return (
        <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                return (
                    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
                        <ModalOverlay bg="blackAlpha.800" />
                        <BeetsModalContent width="full">
                            <ModalCloseButton />
                            <BeetsModalHeader>
                                <Heading size="md" noOfLines={1}>
                                    Swap your lzBEETS for BEETS on Sonic
                                </Heading>
                            </BeetsModalHeader>
                            <BeetsModalBody>
                                {isConfirmed && <Text>You have successfully migrated lzBEETS to BEETS!</Text>}
                                {!isConfirmed && (
                                    <>
                                        <Text>
                                            You have {oldBeetsBalance} lzBEETS that you can migrate 1:1 for BEETS on
                                            Sonic.
                                        </Text>
                                        <Box mt="8" width="full">
                                            {chain?.unsupported && (
                                                <Button
                                                    variant="primary"
                                                    onClick={openChainModal}
                                                    type="button"
                                                    width="full"
                                                    size="lg"
                                                >
                                                    Switch to Sonic
                                                </Button>
                                            )}
                                            {!chain?.unsupported && hasApprovedToken && (
                                                <BeetsMigrationButton
                                                    amount={oldBeetsBalance}
                                                    onConfirmed={() => {
                                                        setIsConfirmed(true);
                                                    }}
                                                    size="lg"
                                                    isLoading={isLoading}
                                                />
                                            )}
                                            {!chain?.unsupported && !hasApprovedToken && tokenData && (
                                                <BeetsTokenApprovalButton
                                                    contractToApprove={networkConfig.beets.migration}
                                                    tokenWithAmount={{ ...tokenData, amount: oldBeetsBalance }}
                                                    onConfirmed={() => {
                                                        refetch();
                                                    }}
                                                    size="lg"
                                                    isLoading={isLoading}
                                                />
                                            )}
                                        </Box>
                                    </>
                                )}
                            </BeetsModalBody>
                            <ModalCloseButton />
                        </BeetsModalContent>
                    </Modal>
                );
            }}
        </ConnectButton.Custom>
    );

    /* return (
        <HStack>
            {isConfirmed && <Text>You have successfully migrated lzBEETS to BEETS!</Text>}
            {!isConfirmed && (
                <>
                    <Text>You have {oldBeetsBalance} lzBEETS that you can migrate 1:1 to BEETS.</Text>
                    {hasApprovedToken && (
                        <BeetsMigrationButton
                            amount={oldBeetsBalance}
                            onConfirmed={() => {
                                setIsConfirmed(true);
                            }}
                            inline
                            size="md"
                            isLoading={isLoading}
                        />
                    )}
                    {!hasApprovedToken && tokenData && (
                        <Box w="225px">
                            <BeetsTokenApprovalButton
                                contractToApprove={networkConfig.beets.migration}
                                tokenWithAmount={{ ...tokenData, amount: oldBeetsBalance }}
                                onConfirmed={() => {
                                    refetch();
                                }}
                                inline
                                size="md"
                                isLoading={isLoading}
                            />
                        </Box>
                    )}
                </>
            )}
        </HStack>
    ); */
}
