import { usePool } from '~/modules/pool/lib/usePool';
import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { Box, Text } from '@chakra-ui/react';
import { PoolInvestFormTokenInput } from '~/modules/pool/invest/components/PoolInvestFormTokenInput';
import { PoolInvestSummary } from '~/modules/pool/invest/components/PoolInvestSummary';
import { PoolInvestSettings } from '~/modules/pool/invest/components/PoolInvestSettings';
import BeetsButton from '~/components/button/Button';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';

interface Props {
    onShowPreview(): void;
}

export function PoolInvestCustom({ onShowPreview }: Props) {
    const { pool } = usePool();
    const { selectedOptions, inputAmounts, setInputAmount } = useInvestState();
    const { selectedInvestTokens } = useInvest();
    const { getUserBalanceForToken, userPoolTokenBalances } = usePoolUserTokenBalancesInWallet();

    return (
        <Box mt="4">
            <Box mb="4">
                <Text>Drag the slider or enter an amount to configure your investment.</Text>
            </Box>
            {pool.investConfig.options.map((option, index) => (
                <PoolInvestFormTokenInput
                    tokenOption={selectedInvestTokens[index]}
                    userBalances={userPoolTokenBalances}
                    option={option}
                    setInputAmount={setInputAmount}
                    value={inputAmounts[option.poolTokenAddress]}
                    key={index}
                    mb="4"
                />
            ))}
            <PoolInvestSummary mt="6" />
            <PoolInvestSettings mt="8" />
            <BeetsButton isFullWidth mt="8" onClick={onShowPreview}>
                Preview
            </BeetsButton>
        </Box>
    );
}
