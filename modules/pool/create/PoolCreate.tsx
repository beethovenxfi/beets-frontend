import { Grid, GridItem, ListItem, OrderedList, Text } from '@chakra-ui/react';
import { PoolCreateDetails } from './components/PoolCreateDetails';
import { SetStateAction, useState } from 'react';
import { PoolCreateTokens } from './components/PoolCreateTokens';

import Card from '~/components/card/Card';
import { PoolCreateLiquidity } from './components/PoolCreateLiquidity';

export type PoolCreateState = 'details' | 'tokens' | 'liquidity' | 'confirm';

export function PoolCreate() {
    const [state, setState] = useState<PoolCreateState>('details');

    const changeState = (state: SetStateAction<PoolCreateState>) => setState(state);

    return (
        <Grid templateColumns="275px 1fr" templateAreas={`"left right"`} gap="6" w="768px">
            <GridItem area="left">
                <Card p="20px" pt="45px" height="full">
                    <OrderedList>
                        <ListItem mb="5">Set pool details</ListItem>
                        <ListItem mb="5">Choose tokens & weights</ListItem>
                        <ListItem mb="5">Set initial liquidity</ListItem>
                        <ListItem mb="5">Confirm pool creation</ListItem>
                    </OrderedList>
                </Card>
            </GridItem>
            <GridItem area="right">
                {state === 'details' && <PoolCreateDetails changeState={changeState} />}
                {state === 'tokens' && <PoolCreateTokens changeState={changeState} />}
                {state === 'liquidity' && <PoolCreateLiquidity changeState={changeState} />}
                {/* {state === 'confirm' && <PoolCreateConfirm/>} */}
            </GridItem>
        </Grid>
    );
}
