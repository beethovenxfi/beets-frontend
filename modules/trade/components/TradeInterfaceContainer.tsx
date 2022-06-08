import { useEffect } from 'react';
import { useTrade } from '~/modules/trade/lib/useTrade';
import { AnimatePresence, useAnimation } from 'framer-motion';
import { AnimatedBox } from '~/components/animation/chakra';
import TradeCard from '~/modules/trade/components/TradeCard';
import { VStack } from '@chakra-ui/react';
import Image from 'next/image';
import BeetsSmart from '~/assets/icons/beetx-smarts.svg';
import TradePreview from '~/modules/trade/components/TradePreview';

export function TradeInterfaceContainer() {
    const { tradeContext, setPreviewVisible } = useTrade();
    const beetsHeadControls = useAnimation();
    const tradePreviewControls = useAnimation();

    const handlePreviewClosed = () => {
        setPreviewVisible(false);
    };

    useEffect(() => {
        if (tradeContext.isPreviewVisible) {
            setTimeout(() => {
                beetsHeadControls.start({
                    opacity: 1,
                    scale: 1.75,
                    transition: { type: 'spring', stiffness: 250, damping: 15 },
                });
            }, 250);
            setTimeout(() => {
                beetsHeadControls.start({
                    opacity: 0,
                    scale: 0,
                });
            }, 500);
            setTimeout(() => {
                tradePreviewControls.start({
                    opacity: 1,
                    scale: 1,
                });
            }, 700);
        }
    }, [tradeContext.isPreviewVisible]);

    return (
        <VStack w="full" position="relative">
            <AnimatePresence>
                {!tradeContext.isPreviewVisible && (
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
                )}
            </AnimatePresence>
            <AnimatePresence>
                {tradeContext.isPreviewVisible && (
                    <>
                        <AnimatedBox
                            // animate={{ opacity: 1, scale: 1, transition: { delay: 0.25 } }}
                            animate={beetsHeadControls}
                            initial={{ opacity: 0, scale: 0 }}
                            exit={{ opacity: 0, scale: 0 }}
                            position="absolute"
                            top="100px"
                        >
                            <VStack alignItems="center">
                                <Image src={BeetsSmart} width="64px" alt="smart-beets" />
                            </VStack>
                        </AnimatedBox>
                        <AnimatedBox
                            w="full"
                            animate={tradePreviewControls}
                            initial={{ opacity: 0, scale: 0.7 }}
                            exit={{
                                opacity: 0,
                                scale: 0.7,
                                position: 'absolute',
                                transition: { type: 'spring', stiffness: 250, damping: 15 },
                            }}
                        >
                            <TradePreview onClose={handlePreviewClosed} />
                        </AnimatedBox>
                    </>
                )}
            </AnimatePresence>
        </VStack>
    );
}
