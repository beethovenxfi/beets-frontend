import { Grid, GridItem } from '@chakra-ui/react';
import { PoolCreateTokenSelect } from './token-select/PoolCreateTokenSelect';

export function PoolCreateTokens() {
    return (
        <>
            <Grid gap="6" templateColumns="1fr 1fr">
                <GridItem>token input</GridItem>
                <GridItem>
                    <PoolCreateTokenSelect />
                </GridItem>
            </Grid>
        </>
    );
}
