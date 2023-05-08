import { TradeCard } from '~/modules/trade/components/TradeCard';
import { Box } from '@chakra-ui/react';

export function TradeInterfaceContainer() {
    return (
        <Box display="flex" justifyContent={{ md: 'center', xl: 'initial' }}>
            <Box w={{ base: 'full', md: '600px', xl: 'full' }} position="relative">
                <TradeCard />
            </Box>
        </Box>
    );
}
