import { Box, Button, HStack, Heading, Text, VStack, useDisclosure } from '@chakra-ui/react';
import React, { useRef } from 'react';
import { useCompose } from './ComposeProvider';
import { TokenInput } from '~/components/inputs/TokenInput';
import TokenRow from '~/components/token/TokenRow';
import Card from '~/components/card/Card';
import { Plus, X } from 'react-feather';
import { BeetsBox } from '~/components/box/BeetsBox';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import { TokenSelectModal } from '~/components/token-select/TokenSelectModal';

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
    const { poolTypes, tokens, MAX_TOKENS, removeTokenByAddress, removeTokenByIndex } = useCompose();
    const tokenSelectDisclosure = useDisclosure();

    const isMaxTokens = tokens.length === MAX_TOKENS;
    const finalRefTokenIn = useRef(null);

    function removeToken(tokenAddress: string, index: number) {
        if (!tokenAddress) {
            removeTokenByIndex(index);
        } else {
            removeTokenByAddress(tokenAddress);
        }
    }

    function showTokenSelect(tokenIndex: number) {
        tokenSelectDisclosure.onOpen();
    }

    return (
        <Card py="3" px="3" width="50%">
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
                            <HStack width="full">
                                <BeetsBox width="full" pl="4" pr="3" py="2" key={`${token.address}-${i}`}>
                                    <HStack width="full" spacing="4">
                                        <VStack spacing="0" width="full">
                                            <TokenInput
                                                toggleTokenSelect={() => showTokenSelect('tokenOut')}
                                                address={token.address}
                                                amount={token.amount}
                                            />
                                        </VStack>
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
            <TokenSelectModal
                finalFocusRef={finalRefTokenIn}
                isOpen={tokenSelectDisclosure.isOpen}
                onOpen={tokenSelectDisclosure.onOpen}
                onClose={tokenSelectDisclosure.onClose}
            />
        </Card>
    );
}
