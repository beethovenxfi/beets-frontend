import { Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import { TokenSelectModal } from '~/components/token-select/TokenSelectModal';

export function PoolCreateTokens() {
    const tokenSelectDisclosure = useDisclosure();

    return (
        <>
            <Grid gap="6">
                <GridItem>token input</GridItem>
            </Grid>
            <TokenSelectModal
                isOpen={tokenSelectDisclosure.isOpen}
                onOpen={tokenSelectDisclosure.onOpen}
                onClose={tokenSelectDisclosure.onClose}
            />
        </>
    );
}
