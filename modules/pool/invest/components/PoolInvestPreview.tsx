import { Box, StackDivider, VStack } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { PoolInvestSummary } from '~/modules/pool/invest/components/PoolInvestSummary';
import { PoolInvestActions } from '~/modules/pool/invest/components/PoolInvestActions';
import TokenRow from '~/components/token/TokenRow';
import React from 'react';

interface Props {
    onInvestComplete(): void;
    onClose(): void;
}

export function PoolInvestPreview({ onInvestComplete, onClose }: Props) {
    const { selectedInvestTokensWithAmounts } = useInvest();

    return (
        <VStack spacing="4" width="full">
            <Box px="4" width="full">
                <PoolInvestSummary mt="6" />
                <BeetsBox>
                    <VStack width="full" divider={<StackDivider borderColor="whiteAlpha.200" />} mt="4" p="2">
                        {selectedInvestTokensWithAmounts.map((token) => {
                            return <TokenRow key={token.address} address={token.address} amount={token.amount} />;
                        })}
                    </VStack>
                </BeetsBox>
            </Box>
            <PoolInvestActions onInvestComplete={onInvestComplete} onClose={onClose} />
        </VStack>
    );
}
