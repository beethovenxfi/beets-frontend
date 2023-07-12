import { Box, Button, HStack, Heading, Text, VStack, useDisclosure } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { PoolCreationToken, useCompose } from './ComposeProvider';
import { TokenInput } from '~/components/inputs/TokenInput';
import TokenRow from '~/components/token/TokenRow';
import Card from '~/components/card/Card';
import { Lock, Plus, Unlock, X } from 'react-feather';
import { BeetsBox } from '~/components/box/BeetsBox';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import { TokenSelectModal } from '~/components/token-select/TokenSelectModal';
import { GenericTokenSelectModal } from '~/components/token-select/GenericTokenSelectModal';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import { BeetsInput } from '~/components/inputs/BeetsInput';
import { useDebouncedCallback } from 'use-debounce';
import { isNaN, update } from 'lodash';
import Scales from '~/assets/icons/scales.svg';
import Image from 'next/image';

interface Props {}

function AddTokenButton(_: any) {
    const { addBlankToken, removeTokenByAddress, removeTokenByIndex } = useCompose();
    return (
        <Button onClick={addBlankToken} width="full">
            <Plus />
        </Button>
    );
}

export default function AdvancedPoolComposeTokens(props: Props) {
    const {
        poolTypes,
        tokens,
        MAX_TOKENS,
        removeTokenByAddress,
        removeTokenByIndex,
        toggleLockTokenByAddress,
        toggleLockTokenByIndex,
        setTokens,
        distributeTokenWeights,
    } = useCompose();
    const [activeTokenSelectIndex, setActiveTokenSelectIndex] = useState<number | null>(null);
    const tokenSelectDisclosure = useDisclosure();
    const { showToast } = useToast();
    const isMaxTokens = tokens.length === MAX_TOKENS;
    const finalRefTokenIn = useRef(null);

    const debouncedDistributeTokens = useDebouncedCallback((tokens: PoolCreationToken[]) => {
        distributeTokenWeights(tokens);
    }, 100);

    function removeToken(tokenAddress: string, index: number) {
        if (!tokenAddress) {
            removeTokenByIndex(index);
        } else {
            removeTokenByAddress(tokenAddress);
        }
    }

    function toggleLockToken(tokenAddress: string, index: number) {
        if (!tokenAddress) {
            toggleLockTokenByIndex(index);
        } else {
            toggleLockTokenByAddress(tokenAddress);
        }
    }

    function showTokenSelect(tokenIndex: number) {
        setActiveTokenSelectIndex(tokenIndex);
        tokenSelectDisclosure.onOpen();
    }

    function handleTokenSelectedForIndex(tokenIndex: number | null) {
        if (tokenIndex === null) return (address: string) => {};
        return function (address: string) {
            if (tokens.find((token) => token.address === address)) {
                showToast({
                    id: 'compose-existing-token',
                    content: 'You already have this token added',
                    auto: true,
                    type: ToastType.Error,
                });
                return;
            }
            const newTokens = [...tokens];
            newTokens[tokenIndex] = {
                ...newTokens[tokenIndex],
                address: address,
            };
            setTokens(newTokens);
        };
    }

    function handleTokenAmountChangedForIndex(tokenIndex: number | null) {
        // type doesn't matter here, just a blank event
        if (tokenIndex === null) return (event: any) => {};
        return function (event: { currentTarget: { value: string } }) {
            const newTokens = [...tokens];
            newTokens[tokenIndex] = {
                ...newTokens[tokenIndex],
                amount: event.currentTarget.value,
            };
            setTokens(newTokens);
        };
    }

    function handleTokenWeightChangedForIndex(tokenIndex: number | null) {
        // type doesn't matter here, just a blank event
        if (tokenIndex === null) return (event: any) => {};
        return function (event: { currentTarget: { value: string } }) {
            let updatedDecimalWeight = parseInt(event.currentTarget.value, 10);
            if (isNaN(updatedDecimalWeight)) updatedDecimalWeight = 0;
            const newTokens = [...tokens];
            newTokens[tokenIndex] = {
                ...newTokens[tokenIndex],
                weight: updatedDecimalWeight,
                isLocked: true,
            };
            setTokens(newTokens);
            debouncedDistributeTokens(newTokens);
        };
    }

    return (
        <Card py="3" px="3" width="100%">
            <VStack spacing="2" width="full" alignItems="flex-start">
                <VStack width="full" spacing="3">
                    <VStack spacing="1" width="full" alignItems="flex-start">
                        <Heading size="sm">Choose tokens</Heading>
                        <Text lineHeight="1rem" fontSize="0.85rem">
                            Customize the weight of each pool token and the amount of liquidity you want to seed for
                            each. You can add up to 8 tokens.
                        </Text>
                    </VStack>
                    <VStack width="full" spacing="2">
                        {tokens.map((token, i) => (
                            <HStack key={`compose-token-select-${token}-${i}`} width="full">
                                <BeetsBox width="full" pl="2" pr="3" py="2" key={`${token.address}-${i}`}>
                                    <HStack width="full" spacing="4">
                                        <HStack spacing="2" width="full">
                                            <TokenInput
                                                toggleTokenSelect={() => showTokenSelect(i)}
                                                address={token.address}
                                                value={token.amount}
                                                onChange={handleTokenAmountChangedForIndex(i)}
                                            />
                                            <VStack>
                                                <BeetsTooltip noImage label="Adjust this token's pool weight">
                                                    <BeetsInput
                                                        wrapperProps={{
                                                            height: '40px',
                                                            padding: 'none',
                                                            width: '70px',
                                                        }}
                                                        height="100%"
                                                        width="70px"
                                                        py="0"
                                                        minHeight="none"
                                                        fontWeight="medium"
                                                        fontSize="1rem"
                                                        px="2"
                                                        placeholder="50"
                                                        value={token.weight}
                                                        onChange={handleTokenWeightChangedForIndex(i)}
                                                        // borderColor={isUsingCustomFee ? 'beets.green' : 'transparent'}
                                                        // borderWidth={2}
                                                    >
                                                        <Box
                                                            top="0"
                                                            bottom="0"
                                                            transform="translateY(20%)"
                                                            right="12px"
                                                            position="absolute"
                                                        >
                                                            <Text color="whiteAlpha.600">%</Text>
                                                        </Box>
                                                    </BeetsInput>
                                                </BeetsTooltip>
                                            </VStack>
                                        </HStack>
                                        <VStack>
                                            <BeetsTooltip noImage label="Lock this token's weight">
                                                <Button
                                                    onClick={() => toggleLockToken(token.address, i)}
                                                    bg={token.isLocked ? 'beets.highlight' : 'whiteAlpha.400'}
                                                    color={token.isLocked ? 'beets.base.700' : 'inherit'}
                                                    _hover={{ bg: 'beets.highlight', color: 'beets.base.700' }}
                                                    rounded="full"
                                                    p="0"
                                                >
                                                    {token.isLocked && <Lock width="12px" />}
                                                    {!token.isLocked && <Unlock width="12px" />}
                                                </Button>
                                            </BeetsTooltip>
                                            <BeetsTooltip noImage label="Remove this token">
                                                <Button
                                                    onClick={() => removeToken(token.address, i)}
                                                    bg="red.500"
                                                    _hover={{ bg: 'red.600' }}
                                                    rounded="full"
                                                    p="0"
                                                >
                                                    <X width="12px" />
                                                </Button>
                                            </BeetsTooltip>
                                        </VStack>
                                    </HStack>
                                </BeetsBox>
                            </HStack>
                        ))}
                    </VStack>
                </VStack>
                {!isMaxTokens && (
                    <HStack width="full">
                        <AddTokenButton />
                    </HStack>
                )}
            </VStack>
            <GenericTokenSelectModal
                finalFocusRef={finalRefTokenIn}
                isOpen={tokenSelectDisclosure.isOpen}
                onOpen={tokenSelectDisclosure.onOpen}
                onClose={tokenSelectDisclosure.onClose}
                handleTokenSelected={handleTokenSelectedForIndex(activeTokenSelectIndex)}
                title="Choose a token"
            />
        </Card>
    );
}
