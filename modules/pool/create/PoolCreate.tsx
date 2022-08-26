import { Grid, GridItem, HStack, IconButton, ListItem, OrderedList, Text } from '@chakra-ui/react';
import { PoolCreateDetails } from './components/PoolCreateDetails';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { useState } from 'react';
import { PoolCreateTokens } from './components/PoolCreateTokens';

export function PoolCreate() {
    const [state, setState] = useState<'details' | 'tokens'>('details');

    return (
        <Grid
            templateColumns="200px 1fr 275px"
            templateAreas={`"left middle right"
        "left buttons right"`}
            gap="6"
            w="1024px"
        >
            <GridItem area="left" border="1px" borderRadius="lg" p="10px">
                <Text as="h2" textStyle="h2" mb="20px">
                    Title Left
                </Text>
                <OrderedList>
                    <ListItem>Pool details</ListItem>
                    <ListItem>Tokens & weights</ListItem>
                    <ListItem>??</ListItem>
                    <ListItem>??</ListItem>
                </OrderedList>
            </GridItem>
            <GridItem area="right" border="1px" borderRadius="lg" p="10px" ml="50px">
                <Text as="h2" textStyle="h2" mb="20px">
                    Title Right
                </Text>
            </GridItem>
            <GridItem area="middle">
                {state === 'details' && <PoolCreateDetails />}
                {state === 'tokens' && <PoolCreateTokens />}
            </GridItem>
            <GridItem area="buttons">
                <HStack justify="space-between">
                    <IconButton
                        aria-label={'back-button'}
                        icon={<ChevronLeft />}
                        variant="ghost"
                        disabled={state === 'details'}
                        p="0"
                        width="32px"
                        height="32px"
                        minWidth="32px"
                        onClick={() => {
                            if (state === 'tokens') {
                                setState('details');
                            }
                        }}
                    />
                    <IconButton
                        aria-label={'next-button'}
                        icon={<ChevronRight />}
                        variant="ghost"
                        p="0"
                        width="32px"
                        height="32px"
                        minWidth="32px"
                        onClick={() => {
                            if (state === 'details') {
                                setState('tokens');
                            }
                        }}
                    />
                </HStack>
            </GridItem>
        </Grid>
    );
}
