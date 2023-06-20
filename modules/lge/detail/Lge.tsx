import { Box, Grid, GridItem, VStack, Text } from '@chakra-ui/react';
import { LgeWarning } from '~/modules/lges/components/LgeWarning';
import { useLge } from '../lib/useLge';
import Card from '~/components/card/Card';
import { LgeDetails } from './LgeDetails';

export function Lge() {
    const { lge, status } = useLge();

    const hasEnded = status === 'ended';
    const startDate = lge && new Date(lge.startDate);
    const endDate = lge && new Date(lge.endDate);

    return (
        <Box marginBottom="8">
            {status !== 'active' && (
                <Card p="4" mb="4" bg={hasEnded ? 'orange.200' : 'green.200'} color="black">
                    {`${lge?.name} Liquidity Bootstrapping Pool ${hasEnded ? 'ended' : 'starts'}: ${
                        hasEnded ? endDate : startDate
                    }`}
                </Card>
            )}
            <VStack width="full" spacing="4" mb="12">
                {!hasEnded && (
                    <LgeWarning showReadMore>
                        <Text>
                            Participating in a Liquidity Bootstrapping Pool on Beethoven X is a high-risk endeavor. This
                            is a permissionless service where <span style={{ fontWeight: 'bold' }}>ANYONE</span> can
                            create an event. Beethoven X is not liable for any losses incurred by using our platform.
                            Please be careful and do your own research before participating in any event.
                        </Text>
                    </LgeWarning>
                )}
                {!(hasEnded || lge?.adminIsMultisig) && (
                    <LgeWarning>
                        <Text>
                            The owner of this Liquidity Bootstrapping Pool is{' '}
                            <span style={{ fontWeight: 'bold' }}>NOT</span> a Gnosis Safe Multisig Wallet. This means
                            that a single person has complete control over the funds in this pool. Please proceed with
                            caution.
                        </Text>
                    </LgeWarning>
                )}
                <Grid gap="4" templateColumns={{ base: '1fr', lg: '2fr 1fr' }} width="full">
                    <GridItem>
                        <Box h="500px" border="2px">
                            chart
                        </Box>
                    </GridItem>
                    <GridItem>
                        <Box h="500px" border="2px">
                            trade box
                        </Box>
                    </GridItem>
                </Grid>
            </VStack>
            <LgeDetails />
        </Box>
    );
}
