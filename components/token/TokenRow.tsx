import { Box, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';
import { GqlPoolToken } from '~/apollo/generated/graphql-codegen-generated';
import { useGetTokens } from '~/lib/global/useToken';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { tokenInputBlockInvalidCharacters } from '~/lib/util/input-util';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { TokenSelectInline } from '../token-select-inline/TokenSelectInline';
import TokenAvatar from './TokenAvatar';

interface Props {
    address: string;
    amount: string;
    withInput?: boolean;
    withSlider?: boolean;
    alternateTokens?: GqlPoolToken[];
    onSelectedAlternateToken?: (address: string) => void;
    selectedAlternateToken?: string;
    onAmountChange?: (amount: string) => void;
    balance?: string;
}

export default function TokenRow({
    address,
    alternateTokens = [],
    amount,
    withInput,
    selectedAlternateToken = '',
    onSelectedAlternateToken,
    onAmountChange,
    balance,
}: Props) {
    const { getToken, priceForAmount } = useGetTokens();

    const token = getToken(address.toLowerCase());

    const _onSelectedAlternateToken = (address: string) => {
        onSelectedAlternateToken && onSelectedAlternateToken(address);
    };

    const _onAmountChange = (amount: string) => {
        onAmountChange && onAmountChange(amount);
    };


    return (
        <HStack
            width="full"
            justifyContent="space-between"
            key={`tokenrow-${address}`}
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {alternateTokens.length > 1 ? (
                <Box flex="1">
                    <TokenSelectInline
                        tokenOptions={alternateTokens}
                        selectedAddress={selectedAlternateToken}
                        onOptionSelect={_onSelectedAlternateToken}
                    />
                </Box>
            ) : (
                <HStack>
                    <TokenAvatar width="40px" height="40px" address={address} />
                    <Box>
                        {token?.name}
                        <HStack spacing="1">
                            <Text fontWeight="bold">{token?.symbol}</Text>
                        </HStack>
                    </Box>
                </HStack>
            )}
            <VStack alignItems="flex-end" spacing="0">
                {withInput && (
                    <Input
                        type="number"
                        min={0}
                        placeholder="0.0"
                        textAlign="right"
                        value={amount || ''}
                        onChange={(e) => {
                            _onAmountChange(e.currentTarget.value);
                        }}
                        _hover={{ borderColor: 'gray.200' }}
                        _focus={{ outline: 'none' }}
                        _placeholder={{ color: 'gray.400' }}
                        color="gray.100"
                        borderColor="transparent"
                        border="2px"
                        bgColor="blackAlpha.400"
                        fontWeight="semibold"
                        onKeyDown={tokenInputBlockInvalidCharacters}
                        width="full"
                        pr="1"
                        pl="2"
                        height="32px"
                    />
                )}
                {!withInput && <Text>{tokenFormatAmount(amount)}</Text>}
                <Text fontSize="sm" color="beets.base.100">
                    {numberFormatUSDValue(
                        priceForAmount({
                            address,
                            amount,
                        }),
                    )}
                </Text>
                {balance && (
                    <Text fontSize="sm" color="gray.100">
                        You have {tokenFormatAmount(balance || '0')}
                    </Text>
                )}
            </VStack>
        </HStack>
    );
}
