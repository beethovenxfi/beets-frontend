import { Alert, AlertIcon, Box, SkeletonText, StackDivider, VStack } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { useReliquaryInvest } from '~/modules/reliquary/invest/lib/useReliquaryInvest';
import { ReliquaryInvestSummary } from '~/modules/reliquary/invest/components/ReliquaryInvestSummary';
import { ReliquaryInvestActions } from '~/modules/reliquary/invest/components/ReliquaryInvestActions';
import TokenRow from '~/components/token/TokenRow';
import React from 'react';
import useReliquary from '~/modules/reliquary/lib/useReliquary';
import { useReliquaryDepositImpact } from '~/modules/reliquary/lib/useReliquaryDepositImpact';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { usePoolJoinGetBptOutAndPriceImpactForTokensIn } from '~/modules/pool/invest/lib/usePoolJoinGetBptOutAndPriceImpactForTokensIn';

interface Props {
    onInvestComplete(): void;
    onClose(): void;
}

export function ReliquaryInvestPreview({ onInvestComplete, onClose }: Props) {
    const { selectedInvestTokensWithAmounts } = useReliquaryInvest();
    const { selectedRelic, createRelic } = useReliquary();
    const { totalInvestValue } = useReliquaryInvest();
    const { bptOutAndPriceImpact, isLoading: bptOutAndPriceImpactLoading } =
        usePoolJoinGetBptOutAndPriceImpactForTokensIn();

    const { data: depositImpact, isLoading: depositImpactLoading } = useReliquaryDepositImpact(
        parseFloat(bptOutAndPriceImpact?.minBptReceived || ''),
    );

    console.log(selectedInvestTokensWithAmounts);

    return (
        <VStack spacing="4" width="full">
            <Box px="4" width="full">
                <ReliquaryInvestSummary mt="6" />
                {!createRelic && selectedRelic && (
                    <Box>
                        <Alert status="warning" mb="4">
                            <AlertIcon alignSelf="center" />
                            {!depositImpactLoading && !bptOutAndPriceImpactLoading && depositImpact !== undefined ? (
                                `Investing ${numberFormatUSDValue(
                                    totalInvestValue,
                                )} into this relic will affect its maturity. It will take an additional ${formatDistanceToNowStrict(
                                    depositImpact.diffDate,
                                )} to reach maximum maturity.`
                            ) : (
                                <SkeletonText noOfLines={3} spacing="4" skeletonHeight="2" />
                            )}
                        </Alert>
                    </Box>
                )}
                <BeetsBox>
                    <VStack width="full" divider={<StackDivider borderColor="whiteAlpha.200" />} mt="4" p="2">
                        {selectedInvestTokensWithAmounts.map((token, index) => {
                            return <TokenRow key={token.address} address={token.address} amount={token.amount} />;
                        })}
                    </VStack>
                </BeetsBox>
            </Box>
            <ReliquaryInvestActions onInvestComplete={onInvestComplete} onClose={onClose} />
        </VStack>
    );
}
