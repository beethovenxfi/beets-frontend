import { Grid, GridItem, Text } from '@chakra-ui/react';

export function LbpTableHeader() {
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
                templateColumns="250px 1fr 300px 150px"
                gap="0"
            >
                <GridItem>
                    <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                        Token
                    </Text>
                </GridItem>
                <GridItem>
                    <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                        Project
                    </Text>
                </GridItem>
                <GridItem>
                    <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                        Status
                    </Text>
                </GridItem>
                <GridItem>
                    <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                        Links
                    </Text>
                </GridItem>
            </Grid>
        </>
    );
}
