import { Grid, GridItem, Text } from '@chakra-ui/react';

export function LinearPoolTableHeader() {
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
                templateColumns="1fr 130px 130px 130px 130px 130px 130px 130px 130px 120px"
                gap="0"
            >
                <GridItem>
                    <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                        Pool details
                    </Text>
                </GridItem>
                <GridItem textAlign="center">
                    <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                        Variance
                    </Text>
                </GridItem>
                <GridItem textAlign="right">
                    <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                        Main
                    </Text>
                </GridItem>
                <GridItem textAlign="right">
                    <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                        Wrapped
                    </Text>
                </GridItem>
                <GridItem textAlign="right">
                    <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                        % Wrapped
                    </Text>
                </GridItem>
                <GridItem textAlign="right">
                    <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                        Lower
                    </Text>
                </GridItem>
                <GridItem textAlign="right">
                    <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                        Upper
                    </Text>
                </GridItem>
                <GridItem textAlign="right">
                    <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                        Apr
                    </Text>
                </GridItem>
                <GridItem textAlign="right">
                    <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                        TVL
                    </Text>
                </GridItem>
            </Grid>
        </>
    );
}
