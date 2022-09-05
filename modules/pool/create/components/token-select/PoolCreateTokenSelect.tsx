import { Box, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { Modal, ModalBody, ModalCloseButton, ModalContent } from '@chakra-ui/modal';
import { useTradeCard } from '~/modules/trade/lib/useTradeCard';
import { TokenSelectSearchInput } from '~/components/token-select/TokenSelectSearchInput';
import { isAddress } from 'ethers/lib/utils';
import { TokenActionRow } from '~/components/token-select/TokenActionRow';
import { PoolCreateTokenSelectTokenList } from './PoolCreateTokenSelectTokenList';
import { TokenImportAlertDialog } from '~/components/token-select/TokenImportAlertDialog';
import { RefObject, useState } from 'react';
import { useGetTokens } from '~/lib/global/useToken';
import { useUserImportedTokens } from '~/lib/user/useUserImportedTokens';

export function PoolCreateTokenSelect() {
    const listHeight = 500;
    const [searchTerm, setSearchTerm] = useState('');
    const { handleTokenSelected } = useTradeCard();
    const { getTradableToken } = useGetTokens();
    const alertDisclosure = useDisclosure();
    const { loadToken, clearTokenImport, tokenToImport, addressToLoad, importToken } = useUserImportedTokens();

    function onTokenRowClick(address: string) {
        setTimeout(() => {
            handleTokenSelected(address);
            setSearchTerm('');
        });
    }

    return (
        <Box bg="blackAlpha.400">
            <Box p="4" boxShadow="2xl" borderBottomWidth={1} borderBottomColor="beets.base.500">
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
                    <TokenActionRow {...tokenToImport} index={0} action="import" onClick={alertDisclosure.onOpen} />
                </Box>
            ) : (
                <PoolCreateTokenSelectTokenList
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
        </Box>
    );
}
