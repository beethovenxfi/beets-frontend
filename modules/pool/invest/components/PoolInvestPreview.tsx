import { Alert, AlertIcon, Box, SkeletonText, StackDivider, VStack } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { useGetTokens } from '~/lib/global/useToken';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { PoolInvestSummary } from '~/modules/pool/invest/components/PoolInvestSummary';
import { PoolInvestActions } from '~/modules/pool/invest/components/PoolInvestActions';
import TokenRow from '~/components/token/TokenRow';
import React from 'react';
import useReliquary from '~/modules/reliquary/lib/useReliquary';
import { usePool } from '../../lib/usePool';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useReliquaryDepositImpact } from '~/modules/reliquary/lib/useReliquaryDepositImpact';

interface Props {
    onInvestComplete(): void;
    onClose(): void;
    isReliquaryDeposit?: boolean;
}

export function PoolInvestPreview({ onInvestComplete, onClose, isReliquaryDeposit }: Props) {
    const { priceForAmount } = useGetTokens();
    const { selectedInvestTokensWithAmounts } = useInvest();
    const networkConfig = useNetworkConfig();
    const { selectedRelic, createRelic } = useReliquary();
    const { pool } = usePool();
    const isReliquaryFBeetsPool = pool.id === networkConfig.reliquary.fbeets.poolId;

    const totalInvestAmount = selectedInvestTokensWithAmounts.reduce(
        (total, { address, amount }) => total + priceForAmount({ address, amount }),
        0,
    );
    const fBEETSPrice = priceForAmount({ address: networkConfig.fbeets.address, amount: '1' });
    const fBEETSAmountEstimate = totalInvestAmount / fBEETSPrice;

    const { data: depositImpact, isLoading: depositImpactLoading } = useReliquaryDepositImpact(fBEETSAmountEstimate);

    return (
        <VStack spacing="4" width="full">
            <Box px="4" width="full">
                <PoolInvestSummary mt="6" />
                {!createRelic && selectedRelic && isReliquaryFBeetsPool && (
                    <Box>
                        <Alert status="warning" mb="4">
                            <AlertIcon />

                            {!depositImpactLoading && depositImpact !== undefined ? (
                                `Investing more funds into your relic will affect your level up progress. It will take you  ${
                                    depositImpact?.oldMaturity - depositImpact?.newMaturity
                                } more seconds to reach your next level after investing.`
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
            <PoolInvestActions
                isReliquaryDeposit={isReliquaryFBeetsPool}
                onInvestComplete={onInvestComplete}
                onClose={onClose}
            />
        </VStack>
    );
}
