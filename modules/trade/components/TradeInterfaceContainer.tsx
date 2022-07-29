import { AnimatePresence } from 'framer-motion';
import { AnimatedBox } from '~/components/animation/chakra';
import { TradeCard } from '~/modules/trade/components/TradeCard';
import { Box } from '@chakra-ui/react';

export function TradeInterfaceContainer() {
    return (
        <Box display="flex" justifyContent={{ md: 'center', xl: 'initial' }}>
            <Box w={{ base: 'full', md: '600px', xl: 'full' }} position="relative">
                {/*<AnimatePresence>
                    <AnimatedBox
                        w="full"
                        animate={{ scale: 1, transition: { type: 'spring', stiffness: 250, damping: 15 } }}
                        transformOrigin="center"
                        initial={{
                            position: 'relative',
                            scale: 0.8,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.7,
                            position: 'absolute',
                            top: 0,
                            width: 'fit-content',
                            transition: { type: 'spring', stiffness: 250, damping: 15 },
                        }}
                    >
                        <TradeCard />
                    </AnimatedBox>
                </AnimatePresence>*/}
                <TradeCard />
            </Box>
        </Box>
    );
}
