import { Box } from '@chakra-ui/react';
import React from 'react';
import Image from 'next/image';
import { useCurrentStep } from '../../lib/useReliquaryCurrentStep';
import styles from '~/styles/Reliquary.module.css';
import Background from '~/assets/images/reliquary/background.png';
import ReliquaryInvest from '~/assets/images/reliquary/complete.png';
import ApproveVault from '~/assets/images/reliquary/approve-vault.png';
import ApproveRelayer from '~/assets/images/reliquary/approve-relayer.png';
import ApproveRelic from '~/assets/images/reliquary/approve-relic.png';
import MigrateLegacy from '~/assets/images/reliquary/migrate-legacy.png';

export function ReliquaryInvestImage() {
    const { currentStep } = useCurrentStep();

    function getCurrentStepImage(currentStep: string) {
        switch (currentStep) {
            // more cases
            case 'unstake':
                return MigrateLegacy;
            case 'batch-relayer-reliquary':
                return ApproveRelic;
            case 'batch-relayer':
                return ApproveRelayer;
            case 'approve-vault':
                return ApproveVault;
            case 'reliquary-migrate':
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
