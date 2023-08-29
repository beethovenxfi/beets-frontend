import { Box, Grid, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { useCompose } from './ComposeProvider';

import Card from '~/components/card/Card';
import { BeetsBox } from '~/components/box/BeetsBox';
import TokenRow from '~/components/token/TokenRow';

interface Props {}

export default function PreviewPoolTokenSelections(props: Props) {
    const { tokens } = useCompose();

    return (
        <Card py="3" px="3" width="100%">
            <VStack spacing="2" width="full" alignItems="flex-start">
                <VStack width="full" spacing="3">
                    <VStack spacing="1" width="full" alignItems="flex-start">
                        <Heading size="sm">Pool Tokens</Heading>
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
                                        <HStack spacing="2" width="full">
                                            <BeetsBox
                                                borderWidth={2}
                                                borderColor="beets.green"
                                                bg="beets.greenAlpha.50"
                                                py="2"
                                                px="4"
                                                minWidth="92px"
                                                display="flex"
                                                justifyContent="center"
                                            >
                                                <Text color="beets.green">{token.weight}%</Text>
                                            </BeetsBox>
                                            <TokenRow address={token.address} amount={token.amount || '0'} />
                                        </HStack>
                                    </HStack>
                                </BeetsBox>
                            </HStack>
                        ))}
                    </Grid>
                </VStack>
            </VStack>
        </Card>
    );
}
