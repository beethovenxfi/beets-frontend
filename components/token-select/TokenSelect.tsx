// @ts-nocheck
import { Button, ButtonProps } from '@chakra-ui/button';
import { useBoolean, useMergeRefs } from '@chakra-ui/hooks';
import { Box, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/layout';
import { motion } from 'framer-motion';
import { FormEvent, memo, useCallback, useRef, useState } from 'react';
import { GqlToken } from '~/apollo/generated/graphql-codegen-generated';
import { useGetTokens } from '~/lib/global/useToken';
import Card from '../card/Card';
import BeetsInput from '../inputs/BeetsInput';
import TokenAvatar from '../token/TokenAvatar';
import { useVirtual } from 'react-virtual';
import useCVirtual from 'react-cool-virtual';
import { sortBy } from 'lodash';
import numeral from 'numeral';

type Props = {
    onClose?: any;
    onTokenSelected: (address: string) => void;
};

type TokenRowProps = GqlToken & { index: number };

const TokenRow = memo(function TokenRow({ symbol, address, index, onClick }: TokenRowProps & ButtonProps) {
    const { priceFor } = useGetTokens();
    return (
        <Button
            animate={{ opacity: 1, transition: { delay: index * 0.01 } }}
            initial={{ opacity: 0 }}
            as={motion.button}
            width="full"
            height="fit-content"
            variant="ghost"
            _hover={{ backgroundColor: 'beets.gray.400' }}
            onClick={onClick}
        >
            <HStack width="full" paddingY="4" justifyContent="space-between">
                <HStack>
                    <TokenAvatar address={address} />
                    <Heading size="md" fontWeight="semibold" color="beets.gray.100">
                        {symbol}
                    </Heading>
                </HStack>
                <Box marginTop="2px">
                    <Text color="beets.gray.300">{numeral(priceFor(address)).format('$0,0.00')}</Text>
                </Box>
            </HStack>
        </Button>
    );
});

export default function TokenSelect({ onClose, onTokenSelected }: Props) {
    const { tokens, priceFor } = useGetTokens();
    const [areTokensVisible, setAreTokensVisible] = useBoolean();
    const [searchTerm, setSearchTerm] = useState('');
    const parentRef = useRef();

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

    const filteredTokensByPrice = sortBy(filteredTokens, ['priority', (token) => priceFor(token.address)]).reverse();

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
                <Box width="full" ref={innerRef}>
                    {areTokensVisible &&
                        items.map(({ index, size }, i) => (
                            <Box width="full" key={index} height={`${size}px`}>
                                <TokenRow
                                    onClick={handleTokenSelected(filteredTokensByPrice[index]?.address)}
                                    index={i}
                                    {...filteredTokensByPrice[index]}
                                />
                            </Box>
                        ))}
                </Box>
            </Box>
            <Box
                position="absolute"
                borderBottomLeftRadius="3xl"
                borderBottomRightRadius="3xl"
                bottom="0"
                height="80px"
                width="full"
                bgGradient="linear(to-t, blackAlpha.300, rgba(0,0,0,0))"
            />
        </Card>
    );
}
