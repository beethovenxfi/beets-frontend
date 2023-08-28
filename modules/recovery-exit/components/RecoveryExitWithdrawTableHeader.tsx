import { Grid, GridItem, Text } from '@chakra-ui/react';

export function RecoveryExitWithdrawTableHeader() {
    return (
        <>
            <Grid
                px="4"
                py="3"
                borderTopLeftRadius="md"
                borderTopRightRadius="md"
                alignItems={'center'}
                bgColor="rgba(255,255,255,0.08)"
                borderBottom="2px"
                borderColor="beets.base.500"
                templateColumns="1fr 130px 130px 120px"
                gap="0"
            >
                <GridItem>
                    <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                        Pool details
                    </Text>
                </GridItem>
                <GridItem textAlign="right">
                    <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                        Balance
                    </Text>
                </GridItem>
                <GridItem textAlign="right">
                    <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                        Value
                    </Text>
                </GridItem>
                <GridItem textAlign="right">
                    <Text fontSize="md" fontWeight="semibold" color="beets.base.100"></Text>
                </GridItem>
            </Grid>
        </>
    );
}
