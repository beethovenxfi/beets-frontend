import React from 'react';
import { useCompose } from './ComposeProvider';
import Card from '~/components/card/Card';
import { Alert, Box, Button, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import { BeetsInput } from '~/components/inputs/BeetsInput';

interface Props {}

export function AdvancedPoolComposeName(props: Props) {
    const { getPoolSymbol, setPoolName, poolName, isPoolNameValid } = useCompose();

    function handlePoolNameChanged(event: { currentTarget: { value: string } }) {
        setPoolName(event.currentTarget.value);
    }

    function getInputBorderColour() {
        if (!isPoolNameValid()) {
            return 'red.400';
        }
        return 'transparent';
    }

    const poolSymbol = getPoolSymbol();
    return (
        <Card py="3" px="3" width="full" height="full">
            <VStack alignItems="flex-start" spacing="3">
                <VStack alignItems="flex-start" spacing="1">
                    <Heading size="sm">4. Pool Name</Heading>
                    <Text lineHeight="1.25rem" fontSize="0.95rem">
                        Finally, choose a name for you pool. You can leave it as the auto-generated pool name based on
                        the tokens and their weights, or pick one yourself. The pool symbol is determined by your token
                        selections and their weights.
                    </Text>
                </VStack>
                <VStack width="full" height="40px">
                    <BeetsInput
                        wrapperProps={{ height: '100%', padding: 'none', width: '100%' }}
                        height="100%"
                        width="100%"
                        value={poolName}
                        py="0"
                        minHeight="none"
                        fontWeight="medium"
                        fontSize="1rem"
                        px="2"
                        placeholder="My very cool pool name"
                        onChange={handlePoolNameChanged}
                        borderWidth={2}
                        borderColor={getInputBorderColour()}
                    />
                </VStack>
                {poolSymbol && (
                    <VStack alignItems="flex-start" spacing="1">
                        <Heading size="sm">Symbol</Heading>
                        <Text lineHeight="1rem" fontSize="0.95rem">
                            {getPoolSymbol()}
                        </Text>
                    </VStack>
                )}
                {!isPoolNameValid() && <Alert status="error">Please ensure the pool name is filled in.</Alert>}
            </VStack>
        </Card>
    );
}
