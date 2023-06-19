import { Grid, GridItem, Text } from '@chakra-ui/react';

export function LgeListTableHeader() {
    return (
        <Grid
            pl="4"
            py="3"
            borderTopLeftRadius="md"
            borderTopRightRadius="md"
            alignItems={'center'}
            bgColor="rgba(255,255,255,0.08)"
            borderBottom="2px"
            borderColor="beets.base.500"
            mb={{ base: '4', lg: '0' }}
            templateColumns={'repeat(4, 1fr)'}
            gap="0"
            display={{ base: 'none', lg: 'grid' }}
        >
            <GridItem>Project</GridItem>
            <GridItem>Name</GridItem>
            <GridItem>Status</GridItem>
            <GridItem>Links</GridItem>
        </Grid>
    );
}
