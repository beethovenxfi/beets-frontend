import { Box } from '@chakra-ui/react';
import React from 'react';
import Image from 'next/image';
import { useCurrentStep } from '../../lib/useReliquaryCurrentStep';
import styles from '~/styles/Reliquary.module.css';
import Background from '~/assets/images/reliquary/background.png';
import ReliquaryInvest from '~/assets/images/reliquary/complete.png';

export function ReliquaryInvestImage() {
    const { currentStep } = useCurrentStep();

    function getCurrentStepImage(currentStep: string) {
        switch (currentStep) {
            // more cases
            case 'reliquary-invest':
            default:
                return ReliquaryInvest;
        }
    }

    return (
        <Box mt="4">
            <div className={styles.container}>
                <div className={styles.overlapGrid}>
                    <Image src={Background} alt="background" />
                    <Image src={getCurrentStepImage(currentStep)} alt="reliquary" />
                </div>
            </div>
        </Box>
    );
}
