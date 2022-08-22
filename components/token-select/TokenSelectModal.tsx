import { Box, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { Modal, ModalBody, ModalCloseButton, ModalContent } from '@chakra-ui/modal';
import { useTradeCard } from '~/modules/trade/lib/useTradeCard';
import { TokenSelectSearchInput } from '~/components/token-select/TokenSelectSearchInput';
import { isAddress } from 'ethers/lib/utils';
import { TokenActionRow } from '~/components/token-select/TokenActionRow';
import { TokenSelectTokenList } from '~/components/token-select/TokenSelectTokenList';
import { TokenImportAlertDialog } from '~/components/token-select/TokenImportAlertDialog';
import { useState } from 'react';
import { useGetTokens } from '~/lib/global/useToken';
import { useUserImportedTokens } from '~/lib/user/useUserImportedTokens';

interface Props {
    isOpen: boolean;
    onOpen(): void;
    onClose(): void;
}

export function TokenSelectModal({ isOpen, onClose }: Props) {
    const listHeight = 500;
    const [searchTerm, setSearchTerm] = useState('');
    const { handleTokenSelected, tokenSelectKey } = useTradeCard();
    const { getTradableToken } = useGetTokens();
    const alertDisclosure = useDisclosure();
    const { loadToken, clearTokenImport, tokenToImport, addressToLoad, importToken } = useUserImportedTokens();

    function onTokenRowClick(address: string) {
        onClose();

        setTimeout(() => {
            handleTokenSelected(address);
            setSearchTerm('');
        });
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay bg="blackAlpha.800" />
            <ModalContent borderWidth={1} borderColor="beets.base.600">
                <Box bg="blackAlpha.400">
                    <Box className="bg">
                        <ModalCloseButton />
                        <ModalHeader>Select a token to {tokenSelectKey === 'tokenIn' ? 'sell' : 'buy'}</ModalHeader>
                        <ModalBody p="0" position="relative">
                            <Box px="6" pb="6" boxShadow="2xl" borderBottomWidth={1} borderBottomColor="beets.base.500">
                                <TokenSelectSearchInput
                                    placeholder="Search by symbol or address..."
                                    value={searchTerm}
                                    setValue={(value) => {
                                        setSearchTerm(value);

                                        if (isAddress(value) && !getTradableToken(value)) {
                                            loadToken(value);
                                        } else if (addressToLoad || tokenToImport) {
                                            clearTokenImport();
                                        }
                                    }}
                                />
                            </Box>
                            {tokenToImport ? (
                                <Box height={`${listHeight}px`}>
                                    <TokenActionRow
                                        {...tokenToImport}
                                        index={0}
                                        action="import"
                                        onClick={alertDisclosure.onOpen}
                                    />
                                </Box>
                            ) : (
                                <TokenSelectTokenList
                                    listHeight={listHeight}
                                    searchTerm={searchTerm}
                                    onTokenRowClick={(address) => onTokenRowClick(address)}
                                />
                            )}
                            <TokenImportAlertDialog
                                isOpen={alertDisclosure.isOpen}
                                onClose={alertDisclosure.onClose}
                                onImport={() => {
                                    importToken();
                                    alertDisclosure.onClose();
                                }}
                            />
                            <Box height="20px" boxShadow="dark-lg" borderTopWidth={1} borderTopColor="beets.base.600" />
                        </ModalBody>
                    </Box>
                </Box>
            </ModalContent>
        </Modal>
    );
}
