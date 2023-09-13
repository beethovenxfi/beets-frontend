import { StackDivider, VStack } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { ReliquaryInvestActions } from '~/modules/reliquary/invest/components/ReliquaryInvestActions';
import TokenRow from '~/components/token/TokenRow';
import React from 'react';
import useReliquary from '~/modules/reliquary/lib/useReliquary';
import { ReliquaryInvestDepositImpact } from './ReliquaryInvestDepositImpact';
import { ReliquaryInvestImage } from './ReliquaryInvestImage';
import { CurrentStepProvider } from '~/modules/reliquary/lib/useReliquaryCurrentStep';
import { ReliquaryInvestTitle } from './ReliquaryInvestTitle';
import { PoolInvestSummary } from '~/modules/pool/invest/components/PoolInvestSummary';
import { GqlPoolToken } from '~/apollo/generated/graphql-codegen-generated';

interface Props {
    onInvestComplete(): void;
    onClose(): void;
    totalInvestValue: number;
    selectedInvestTokensWithAmounts: (GqlPoolToken & { amount: string })[];
}

export function ReliquaryInvestPreview({
    onInvestComplete,
    onClose,
    totalInvestValue,
    selectedInvestTokensWithAmounts,
}: Props) {
    const { selectedRelic, createRelic } = useReliquary();

    return (
        <CurrentStepProvider>
            <VStack spacing="4" width="full">
                <VStack px="4" width="full" spacing="0">
                    <ReliquaryInvestImage />
                    <ReliquaryInvestTitle investTypeText="maBEETS" />
                    <PoolInvestSummary totalInvestValue={totalInvestValue} />
                    {!createRelic && selectedRelic && (
                        <ReliquaryInvestDepositImpact
                            totalInvestValue={totalInvestValue}
                            relicId={selectedRelic.relicId}
                        />
                    )}
                    <BeetsBox width="full">
                        <VStack width="full" divider={<StackDivider borderColor="whiteAlpha.200" />} p="2">
                            {selectedInvestTokensWithAmounts &&
                                selectedInvestTokensWithAmounts.map((token: any) => {
                                    return (
                                        <TokenRow key={token.address} address={token.address} amount={token.amount} />
                                    );
                                })}
                        </VStack>
                    </BeetsBox>
                </VStack>
                <ReliquaryInvestActions onInvestComplete={onInvestComplete} onClose={onClose} />
            </VStack>
        </CurrentStepProvider>
    );
}
