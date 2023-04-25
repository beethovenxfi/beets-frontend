import { Text } from '@chakra-ui/layout';
import { Grid, GridItem, GridProps, useStyleConfig } from '@chakra-ui/react';

export default function PoolTransactionHeader() {
    const styles = useStyleConfig('PoolListTableHeader') as GridProps;

    return (
        <Grid
            px="4"
            py={{ base: '4', xl: '2' }}
            borderTopLeftRadius="md"
            borderTopRightRadius="md"
            alignItems="center"
            bgColor={styles.bgColor}
            borderBottom={styles.borderBottom}
            borderColor={styles.borderColor}
            mb={{ base: '4', lg: '0' }}
            templateColumns={'200px 1fr 200px 200px'}
            gap="0"
            display={{ base: 'none', xl: 'grid' }}
        >
            <GridItem>
                <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                    Action
                </Text>
            </GridItem>
            <GridItem>
                <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                    Details
                </Text>
            </GridItem>
            <GridItem>
                <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                    Value
                </Text>
            </GridItem>
            <GridItem>
                <Text
                    fontSize="md"
                    fontWeight="semibold"
                    color="beets.base.100"
                    textAlign={{ base: 'left', lg: 'right' }}
                    mr="6"
                >
                    Time
                </Text>
            </GridItem>
        </Grid>
    );
}
