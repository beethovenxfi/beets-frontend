import { Text } from '@chakra-ui/layout';
import { Grid, GridItem } from '@chakra-ui/react';

interface LgeTransactionHeaderProps {
    symbol: string;
}

interface gridRowProps {
    title: string;
}

function GridRow({ title }: gridRowProps) {
    return (
        <GridItem>
            <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                {title}
            </Text>
        </GridItem>
    );
}

export default function LgeTransactionHeader({ symbol }: LgeTransactionHeaderProps) {
    return (
        <Grid
            px="4"
            py={{ base: '4', xl: '2' }}
            borderTopLeftRadius="md"
            borderTopRightRadius="md"
            alignItems="center"
            bgColor="rgba(255,255,255,0.08)"
            borderBottom="2px"
            borderColor="beets.base.500"
            mb={{ base: '4', lg: '0' }}
            templateColumns={'repeat(6, 1fr)'}
            gap="0"
            display={{ base: 'none', xl: 'grid' }}
        >
            <GridRow title="Time" />
            <GridRow title="Type" />
            <GridRow title="Input" />
            <GridRow title="Output" />
            <GridRow title={`${symbol} Price`} />
            <GridRow title="Wallet" />
        </Grid>
    );
}
