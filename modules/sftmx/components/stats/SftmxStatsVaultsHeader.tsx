import { Text } from '@chakra-ui/layout';
import { Grid, GridItem } from '@chakra-ui/react';

export default function SftmxStatsVaultsHeader() {
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
            templateColumns="1fr 100px 75px 100px"
            gap="4"
            display={{ base: 'none', xl: 'grid' }}
        >
            <GridItem>
                <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                    Vault Address
                </Text>
            </GridItem>
            <GridItem>
                <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                    Validator Id
                </Text>
            </GridItem>
            <GridItem>
                <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                    Staked
                </Text>
            </GridItem>
            <GridItem>
                <Text fontSize="md" fontWeight="semibold" color="beets.base.100" textAlign="right">
                    Unlock Time
                </Text>
            </GridItem>
        </Grid>
    );
}
