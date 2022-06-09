import { useBoolean } from '@chakra-ui/hooks';
import { Box, VStack } from '@chakra-ui/layout';
import { FormEvent, useState } from 'react';
import { useGetTokens } from '~/lib/global/useToken';
import Card from '../card/Card';
import BeetsInput from '../inputs/BeetsInput';
import useCVirtual from 'react-cool-virtual';
import { orderBy, sortBy } from 'lodash';
import { TokenRow } from '~/components/token-select/TokenRow';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { tokenFindTokenAmountForAddress, tokenGetAmountForAddress } from '~/lib/services/token/token-util';

type Props = {
    onClose?: any;
    onTokenSelected: (address: string) => void;
    userBalances: TokenAmountHumanReadable[];
    userBalancesLoading: boolean;
};

export default function TokenSelect({ onClose, onTokenSelected, userBalances, userBalancesLoading }: Props) {
    const { tokens, priceForAmount } = useGetTokens();
    const [areTokensVisible, setAreTokensVisible] = useBoolean();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchTermChange = (event: FormEvent<HTMLInputElement>) => setSearchTerm(event.currentTarget.value);

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

    const filteredTokens = searchTerm
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
            title="Choose a token"
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
                            const userBalance = tokenFindTokenAmountForAddress(
                                filteredTokensByPrice[index].address,
                                userBalances,
                            );

                            return (
                                <Box width="full" key={index} height={`${size}px`}>
                                    <TokenRow
                                        onClick={handleTokenSelected(filteredTokensByPrice[index]?.address)}
                                        index={i}
                                        {...filteredTokensByPrice[index]}
                                        userBalance={userBalance.amount}
                                        userBalanceUSD={priceForAmount(userBalance)}
                                        loading={userBalancesLoading}
                                    />
                                </Box>
                            );
                        })}
                </Box>
            </Box>
            <Box
                position="absolute"
                borderBottomLeftRadius="lg"
                borderBottomRightRadius="lg"
                bottom="0"
                height="80px"
                width="full"
                bgGradient="linear(to-t, blackAlpha.300, rgba(0,0,0,0))"
            />
        </Card>
    );
}
