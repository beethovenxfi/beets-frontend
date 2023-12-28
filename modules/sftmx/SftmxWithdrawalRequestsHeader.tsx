import { Text } from '@chakra-ui/layout';
import { Grid, GridItem } from '@chakra-ui/react';

export default function SftmxWithdrawalRequestsHeader() {
    return (
        <Grid alignItems="center" templateColumns={'repeat(3, 1fr)'} gap="0" p="4">
            <GridItem>
                <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                    Amount
                </Text>
            </GridItem>
            <GridItem justifySelf="flex-end">
                <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                    Withdraw on
                </Text>
            </GridItem>
            {/* no header for third column */}
        </Grid>
    );
}
