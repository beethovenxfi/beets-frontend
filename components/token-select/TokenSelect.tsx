import { FormEvent, useState } from 'react';
import { useGetTokens } from '~/lib/global/useToken';
import Card from '../card/Card';
import BeetsInput from '../inputs/BeetsInput';
import useCVirtual from 'react-cool-virtual';
import { orderBy } from 'lodash';
import { TokenRow } from '~/components/token-select/TokenRow';
import { tokenFindTokenAmountForAddress } from '~/lib/services/token/token-util';
import { useUserTokenBalances } from '~/lib/user/useUserTokenBalances';
import { isAddress } from 'ethers/lib/utils';
import { useUserImportedTokens } from '~/lib/user/useUserImportedTokens';
import { TokenActionRow } from '~/components/token-select/TokenActionRow';
import { TokenImportAlertDialog } from '~/components/token-select/TokenImportAlertDialog';
import { Link, useDisclosure, Text, Box, VStack, useBoolean } from '@chakra-ui/react';
import { ChevronRight } from 'react-feather';

type Props = {
    onClose?: any;
    onTokenSelected: (address: string) => void;
};

export default function TokenSelect({ onClose, onTokenSelected }: Props) {
    const importDialogDisclosure = useDisclosure();
    const { tokens, priceForAmount, getTradableToken } = useGetTokens();
    const [areTokensVisible, setAreTokensVisible] = useBoolean();
    const [searchTerm, setSearchTerm] = useState('');
    const { userBalances, isLoading: userBalancesLoading } = useUserTokenBalances();
    const [showImportedTokenList, setShowImportedTokenList] = useState(false);

    const {
        loadToken,
        removeToken,
        removeAllUserImportedTokens,
        clearTokenImport,
        isLoading,
        tokenToImport,
        addressToLoad,
        importToken,
        userImportedTokens,
    } = useUserImportedTokens();

    const handleSearchTermChange = (event: FormEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        setSearchTerm(value);

        if (isAddress(value) && !getTradableToken(value)) {
            loadToken(event.currentTarget.value);
        } else if (addressToLoad || tokenToImport) {
            clearTokenImport();
        }
    };

    const handleTokenSelected = (address: string) => () => {
        setAreTokensVisible.off();
        onTokenSelected && onTokenSelected(address);
        onClose();
    };

    // needed so the mounting of the many tokens does not jank
    // the animation, mount them as the animation completes
    const onMountAnimationComplete = () => {
        setAreTokensVisible.on();
    };

    const filteredTokens = tokenToImport
        ? [tokenToImport]
        : showImportedTokenList
        ? userImportedTokens
        : searchTerm
        ? tokens.filter((token) => {
              return (
                  token.address.toLowerCase() === searchTerm.toLowerCase() ||
                  token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
              );
          })
        : tokens;

    const filteredTokensByPrice = orderBy(
        filteredTokens,
        [
            (token) => {
                const userBalance = tokenFindTokenAmountForAddress(token.address, userBalances);
                return priceForAmount(userBalance);
            },
            'priority',
        ],
        ['desc', 'desc'],
    );

    const { outerRef, innerRef, items } = useCVirtual({
        itemCount: filteredTokensByPrice.length, // Provide the total number for the list items
        itemSize: 80, // The size of each item (default = 50)
    });

    return (
        <Card
            shadow="lg"
            title={showImportedTokenList ? 'My token list' : 'Choose a token'}
            width="full"
            animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 30 } }}
            initial={{ scale: 0.8, height: '400px', opacity: 0, position: 'absolute' }}
            exit={{ scale: 0.9, opacity: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } }}
            onAnimationComplete={onMountAnimationComplete}
            onClose={onClose}
            minHeight="800px"
            position="relative"
        >
            <VStack padding="4">
                <BeetsInput
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    placeholder="0x.."
                    type="text"
                    label="Search or copy token address"
                />
            </VStack>
            <Box
                overflowY="auto"
                padding="4"
                flexGrow={1}
                // @ts-ignore
                ref={outerRef}
                css={{
                    '&::-webkit-scrollbar': {
                        width: '0px !important',
                    },
                    '&::-webkit-scrollbar-track': {
                        width: '0px !important',
                    },
                }}
            >
                <Box
                    width="full"
                    // @ts-ignore
                    ref={innerRef}
                >
                    {areTokensVisible &&
                        items.map(({ index, size }, i) => {
                            const token = filteredTokensByPrice[index];

                            if (!token) {
                                return null;
                            }

                            const userBalance = tokenFindTokenAmountForAddress(token.address, userBalances);
                            const isImportToken = token.address === tokenToImport?.address;

                            return (
                                <Box width="full" key={index} height={`${size}px`}>
                                    {isImportToken || showImportedTokenList ? (
                                        <TokenActionRow
                                            index={i}
                                            {...token}
                                            onClick={
                                                isImportToken
                                                    ? importDialogDisclosure.onOpen
                                                    : () => removeToken(token.address)
                                            }
                                            action={isImportToken ? 'import' : 'remove'}
                                        />
                                    ) : (
                                        <TokenRow
                                            //this is here because of virtualization of the list.
                                            onClick={handleTokenSelected(filteredTokensByPrice[index]?.address)}
                                            index={i}
                                            {...token}
                                            userBalance={userBalance.amount}
                                            userBalanceUSD={priceForAmount(userBalance)}
                                            loading={userBalancesLoading}
                                        />
                                    )}
                                </Box>
                            );
                        })}
                </Box>
            </Box>
            {!showImportedTokenList ? (
                <Box p="4">
                    <Link display="flex" onClick={() => setShowImportedTokenList(true)}>
                        <Text>Edit my token list</Text>
                        <ChevronRight />
                    </Link>
                </Box>
            ) : null}
            <Box
                position="absolute"
                borderBottomLeftRadius="lg"
                borderBottomRightRadius="lg"
                bottom="0"
                height="80px"
                width="full"
                bgGradient="linear(to-t, blackAlpha.300, rgba(0,0,0,0))"
                pointerEvents="none"
            />
            <TokenImportAlertDialog
                onImport={() => {
                    importToken();
                    importDialogDisclosure.onClose();
                }}
                onClose={importDialogDisclosure.onClose}
                isOpen={importDialogDisclosure.isOpen}
            />
        </Card>
    );
}
