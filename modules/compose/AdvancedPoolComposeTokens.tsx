import {
    Alert,
    Box,
    Button,
    Grid,
    HStack,
    Heading,
    Stack,
    Text,
    VStack,
    useBreakpointValue,
    useDisclosure,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { PoolCreationToken, useCompose } from './ComposeProvider';
import { TokenInput } from '~/components/inputs/TokenInput';
import Card from '~/components/card/Card';
import { Lock, Plus, Unlock, X } from 'react-feather';
import { BeetsBox } from '~/components/box/BeetsBox';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import { GenericTokenSelectModal } from '~/components/token-select/GenericTokenSelectModal';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import { BeetsInput } from '~/components/inputs/BeetsInput';
import { useDebouncedCallback } from 'use-debounce';
import { isNaN } from 'lodash';
import { useUserTokenBalances } from '~/lib/user/useUserTokenBalances';

interface Props {}

function AddTokenButton(_: any) {
    const { addBlankToken } = useCompose();
    return (
        <Button onClick={addBlankToken} width="full">
            <Plus />
        </Button>
    );
}

export default function AdvancedPoolComposeTokens(props: Props) {
    const { isLoading: isLoadingUserTokenBalances } = useUserTokenBalances();
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
        getTokenAndWeightValidations,
        getOptimizedLiquidity,
    } = useCompose();
    const [activeTokenSelectIndex, setActiveTokenSelectIndex] = useState<number | null>(null);
    const [hasInteractedWithTokens, setHasInteractedWithTokens] = useState(false);
    const tokenSelectDisclosure = useDisclosure();
    const { showToast } = useToast();
    const isMaxTokens = tokens.length === MAX_TOKENS;
    const finalRefTokenIn = useRef(null);
    const isMobile = useBreakpointValue({ base: true, md: false });
    const {
        hasInvalidTokenWeights,
        areTokenSelectionsValid,
        invalidTotalWeight,
        hasMoreThanMaxTotalLiquidity,
        areTokenAmountsValid,
        hasInsufficientBalances,
    } = getTokenAndWeightValidations();

    const optimizedLiquidity = getOptimizedLiquidity();

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
            setHasInteractedWithTokens(true);
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
                        <Heading size="sm">1. Choose tokens</Heading>
                        <Text lineHeight="1.25rem" fontSize="0.95rem">
                            Customize the weight of each pool token and the amount of liquidity you want to seed for
                            each. You can add up to 8 tokens.
                            <br />
                            Optimized token amounts are provided as a placeholder, which will get you the least slippage
                            whilst creating the pool.
                        </Text>
                    </VStack>
                    <Grid
                        width="full"
                        templateColumns={{ base: '1fr', md: '1fr 1fr' }}
                        columnGap="0.5rem"
                        rowGap="0.5rem"
                    >
                        {tokens.map((token, i) => (
                            <HStack key={`compose-token-select-${token}-${i}`}>
                                <BeetsBox width="full" pl="2" pr="3" py="2" key={`${token.address}-${i}`}>
                                    <HStack width="full" spacing="4">
                                        <Stack
                                            spacing="2"
                                            width="full"
                                            direction={{ base: 'column-reverse', md: 'row' }}
                                            alignItems='center'
                                        >
                                            <TokenInput
                                                toggleTokenSelect={() => showTokenSelect(i)}
                                                address={token.address}
                                                value={token.amount}
                                                onChange={handleTokenAmountChangedForIndex(i)}
                                                placeholder={
                                                    parseFloat(
                                                        optimizedLiquidity[token.address]?.balanceRequired || '0',
                                                    ).toFixed(4) || undefined
                                                }
                                            />
                                            <VStack>
                                                <BeetsTooltip noImage label="Adjust this token's pool weight">
                                                    <BeetsInput
                                                        wrapperProps={{
                                                            height: '40px',
                                                            padding: 'none',
                                                            width: isMobile ? '100%' : '85px',
                                                        }}
                                                        height="100%"
                                                        width={{ base: '100%', md: '85px' }}
                                                        py="0"
                                                        minHeight="none"
                                                        fontWeight="medium"
                                                        fontSize="1rem"
                                                        textAlign={{ base: 'center', md: 'left' }}
                                                        px="2"
                                                        placeholder="50"
                                                        value={token.weight}
                                                        onChange={handleTokenWeightChangedForIndex(i)}
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
                                        </Stack>
                                        <VStack>
                                            <BeetsTooltip noImage label="Lock this token's weight">
                                                <Button
                                                    onClick={() => toggleLockToken(token.address, i)}
                                                    bg={token.isLocked ? 'beets.highlight' : 'whiteAlpha.400'}
                                                    color={token.isLocked ? 'beets.base.700' : 'inherit'}
                                                    _hover={{
                                                        bg: 'beets.highlight',
                                                        color: 'beets.base.700',
                                                    }}
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
                    </Grid>
                </VStack>
                {!isMaxTokens && (
                    <BeetsTooltip noImage label="Add a token">
                        <HStack width="full">
                            <AddTokenButton />
                        </HStack>
                    </BeetsTooltip>
                )}
                {tokens.length > 0 && hasInvalidTokenWeights && (
                    <Alert status="error">
                        One or more of your token selections has an invalid weight. Tokens weights must be filled in and
                        greater than 1% for any one token.
                    </Alert>
                )}
                {tokens.length > 0 && !areTokenSelectionsValid && (
                    <Alert status="error">
                        Please make sure all your pool tokens have a valid token selected. The minimum number of tokens
                        is 2. You can always remove a token you do not want by clicking the red cross.
                    </Alert>
                )}
                {tokens.length > 0 && invalidTotalWeight && (
                    <Alert status="error">
                        The sum of weights for all your token selections must equal exactly 100%.
                    </Alert>
                )}
                {tokens.length > 0 && hasMoreThanMaxTotalLiquidity && (
                    <Alert status="error">
                        We enforce a max seed liquidity of $100 to protect you against significant slippage. After the
                        pool is created you can invest with as much liquidity as you wish.
                    </Alert>
                )}
                {tokens.length > 0 && hasInsufficientBalances && (
                    <Alert status="error">
                        You do not have sufficient balance(s) for one or more tokens you have chosen.
                    </Alert>
                )}
                {hasInteractedWithTokens && tokens.length > 0 && !areTokenAmountsValid && (
                    <Alert status="error">All token selections must have a seed amount greater than 0.</Alert>
                )}
            </VStack>
            <GenericTokenSelectModal
                finalFocusRef={finalRefTokenIn}
                isOpen={tokenSelectDisclosure.isOpen}
                onOpen={tokenSelectDisclosure.onOpen}
                onClose={tokenSelectDisclosure.onClose}
                handleTokenSelected={handleTokenSelectedForIndex(activeTokenSelectIndex)}
                excludeNativeToken
                title="Choose a token"
            />
        </Card>
    );
}
