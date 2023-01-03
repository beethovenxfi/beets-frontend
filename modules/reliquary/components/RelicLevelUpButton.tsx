import React from 'react';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import useReliquary from '../lib/useReliquary';
import { useReliquaryLevelUp } from '../lib/useReliquaryLevelUp';

interface Props {}

export default function RelicLevelUpButton({}: Props) {
    const { selectedRelic } = useReliquary();
    const { levelUp, ...levelUpQuery } = useReliquaryLevelUp();
    if (!selectedRelic) return null;
    return (
        <BeetsSubmitTransactionButton
            inline
            submittingText="Confirm..."
            pendingText="Waiting..."
            onClick={() => levelUp(selectedRelic.relicId)}
            {...levelUpQuery}
        >
            Level Up
        </BeetsSubmitTransactionButton>
    );
}
