import { Box, Grid, GridItem, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
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
import { usePoolCreate } from '../../../lib/usePoolCreate';

interface Props {
    isOpen: boolean;
    onOpen(): void;
    onClose(): void;
}

export function PoolCreateTokenSelectModal({ isOpen, onClose }: Props) {
    const listHeight = 500;
    const [searchTerm, setSearchTerm] = useState('');
    const { handleTokenSelected } = useTradeCard();
    const { getTradableToken } = useGetTokens();
    const alertDisclosure = useDisclosure();
    const { loadToken, clearTokenImport, tokenToImport, addressToLoad, importToken } = useUserImportedTokens();
    const { setTokensSelected } = usePoolCreate();

    function onTokenRowClick(address: string) {
        setTokensSelected(address);
        //setSearchTerm('');
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay bg="blackAlpha.800" />
            <ModalContent borderWidth={1} borderColor="beets.base.600">
                <Box bg="blackAlpha.400">
                    <Box className="bg">
                        <ModalCloseButton />
                        <ModalHeader>Select a token</ModalHeader>
                        <ModalBody p="4" position="relative">
                            <Box pb="4" boxShadow="2xl" borderBottomWidth={1} borderBottomColor="beets.base.500">
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
                            {/* {tokenToImport ? (
                                <Box height={`${listHeight}px`}>
                                    <TokenActionRow
                                        {...tokenToImport}
                                        index={0}
                                        action="import"
                                        onClick={alertDisclosure.onOpen}
                                    />
                                </Box>
                            ) : ( */}
                            <Grid templateColumns="1fr 20px 1fr">
                                <GridItem>
                                    <Text py="2">Available tokens</Text>
                                    <Box bg="box.500" borderLeftRadius="md">
                                        <PoolCreateTokenSelectTokenList
                                            listHeight={listHeight}
                                            searchTerm={searchTerm}
                                            onTokenRowClick={(address) => onTokenRowClick(address)}
                                        />
                                    </Box>
                                </GridItem>
                                <GridItem></GridItem>
                                <GridItem>
                                    <Text py="2">Selected tokens</Text>
                                    <Box bg="box.500" borderRightRadius="md">
                                        <PoolCreateTokenSelectTokenList
                                            isForSelectedTokens
                                            listHeight={listHeight}
                                            searchTerm={searchTerm}
                                            onTokenRowClick={(address) => onTokenRowClick(address)}
                                        />
                                    </Box>
                                </GridItem>
                            </Grid>
                            {/* )}
                            <TokenImportAlertDialog
                                isOpen={alertDisclosure.isOpen}
                                onClose={alertDisclosure.onClose}
                                onImport={() => {
                                    importToken();
                                    alertDisclosure.onClose();
                                }}
                            /> */}
                        </ModalBody>
                    </Box>
                </Box>
            </ModalContent>
        </Modal>
    );
}
