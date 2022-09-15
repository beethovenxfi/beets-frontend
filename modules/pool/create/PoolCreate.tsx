import { Grid, GridItem, ListItem, OrderedList, Text } from '@chakra-ui/react';
import { PoolCreateDetails } from './components/PoolCreateDetails';
import { SetStateAction, useState } from 'react';
import { PoolCreateTokens } from './components/PoolCreateTokens';
import Card from '~/components/card/Card';

export type PoolCreateState = 'details' | 'tokens';

export function PoolCreate() {
    const [state, setState] = useState<PoolCreateState>('details');

    const changeState = (state: SetStateAction<PoolCreateState>) => setState(state);

    return (
        <Grid templateColumns="200px 1fr" templateAreas={`"left right"`} gap="6" w="1024px">
            <GridItem area="left">
                <Card p="20px" height="full">
                    <Text as="h2" textStyle="h2" mb="20px">
                        Title
                    </Text>
                    <OrderedList>
                        <ListItem>Pool details</ListItem>
                        <ListItem>Tokens & weights</ListItem>
                        <ListItem>Summary</ListItem>
                        <ListItem>Done</ListItem>
                    </OrderedList>
                </Card>
            </GridItem>
            <GridItem area="right">
                {state === 'details' && <PoolCreateDetails changeState={changeState} />}
                {state === 'tokens' && <PoolCreateTokens changeState={changeState} />}
            </GridItem>
        </Grid>
    );
}
