import { VStack, Box } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import SwitchButton from '~/components/switch-button/SwitchButton';
import { PoolInvestCustom } from '~/modules/pool/invest/components/PoolInvestCustom';
import { PoolInvestPreview } from '~/modules/pool/invest/components/PoolInvestPreview';
import { PoolInvestProportional } from '~/modules/pool/invest/components/PoolInvestProportional';

interface Props {
    onInvestComplete: () => void;
}

const investOptions = [
    { label: 'Proportional', id: 'proportional' },
    { label: 'Custom', id: 'custom' },
];

export default function ReliquaryInvest({ onInvestComplete }: Props) {
    const [investmentStep, setInvestmentStep] = useState('proportional');

    return (
        <VStack spacing="0">
            <SwitchButton
                onChange={(id: string) => setInvestmentStep(id)}
                value={investmentStep}
                options={investOptions}
            />
            {/* TODO MOVE PRICE IMPACT WARNING ON DEBOUNCE */}
            <AnimatePresence exitBeforeEnter>
                {investmentStep === 'custom' && (
                    <Box
                        key="custom"
                        as={motion.div}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        initial={{
                            opacity: 0,
                        }}
                        width="100%"
                        minWidth="550px"
                        maxWidth="550px"
                    >
                        <PoolInvestCustom onShowPreview={() => setInvestmentStep('preview')} />
                    </Box>
                )}
                {investmentStep === 'proportional' && (
                    <Box
                        as={motion.div}
                        key="proportional"
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        initial={{
                            opacity: 0,
                        }}
                        width="100%"
                        minWidth="550px"
                        maxWidth="550px"
                    >
                        <PoolInvestProportional onShowPreview={() => setInvestmentStep('preview')} />
                    </Box>
                )}
                {investmentStep === 'preview' && (
                    <Box
                        as={motion.div}
                        key="preview"
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        initial={{
                            opacity: 0,
                        }}
                        width="100%"
                        minWidth="550px"
                        maxWidth="550px"
                    >
                        <PoolInvestPreview
                            isReliquaryDeposit
                            onInvestComplete={onInvestComplete}
                            onClose={() => false}
                        />
                    </Box>
                )}
            </AnimatePresence>
        </VStack>
    );
}
