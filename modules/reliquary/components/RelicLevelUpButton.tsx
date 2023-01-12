import { HStack, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import useReliquary from '../lib/useReliquary';
import { useReliquaryLevelUp } from '../lib/useReliquaryLevelUp';

interface Props {}

export default function RelicLevelUpButton({}: Props) {
    const { selectedRelic } = useReliquary();
    const { levelUp, ...levelUpQuery } = useReliquaryLevelUp();
    const { showToast } = useToast();
    if (!selectedRelic) return null;

    useEffect(() => {
        if (levelUpQuery.submitError) {
            showToast({
                id: 'level-up-error',
                auto: true,
                type: ToastType.Error,
                content: (
                    <HStack>
                        <Text>{levelUpQuery.submitError.message}</Text>
                    </HStack>
                ),
            });
        }
    }, [levelUpQuery.submitError]);
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
