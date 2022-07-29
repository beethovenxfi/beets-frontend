import { usePool } from '~/modules/pool/lib/usePool';
import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { Box, Text, Collapse, Checkbox, useBoolean, Alert, AlertIcon } from '@chakra-ui/react';
import { PoolInvestSummary } from '~/modules/pool/invest/components/PoolInvestSummary';
import { PoolInvestSettings } from '~/modules/pool/invest/components/PoolInvestSettings';
import BeetsButton from '~/components/button/Button';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { BeetsTokenInputWithSlider } from '~/components/inputs/BeetsTokenInputWithSlider';
import { usePoolJoinGetBptOutAndPriceImpactForTokensIn } from '~/modules/pool/invest/lib/usePoolJoinGetBptOutAndPriceImpactForTokensIn';

interface Props {
    onShowPreview(): void;
}

export function PoolInvestCustom({ onShowPreview }: Props) {
    const { pool } = usePool();
    const { inputAmounts, setInputAmount, setSelectedOption } = useInvestState();
    const { selectedInvestTokens } = useInvest();
    const { userPoolTokenBalances } = usePoolUserTokenBalancesInWallet();
    const { hasHighPriceImpact } = usePoolJoinGetBptOutAndPriceImpactForTokensIn();
    const [acknowledgeHighPriceImpact, { toggle: toggleAcknowledgeHighPriceImpact }] = useBoolean(false);

    return (
        <Box mt="4">
            <Box mb="4">
                <Text>Drag the slider or enter an amount to configure your investment.</Text>
            </Box>
            {pool.investConfig.options.map((option, index) => (
                <BeetsTokenInputWithSlider
                    tokenOptions={option.tokenOptions}
                    selectedTokenOption={selectedInvestTokens[index]}
                    balance={
                        userPoolTokenBalances.find(
                            (userBalance) => userBalance.address === selectedInvestTokens[index].address,
                        )?.amount || '0'
                    }
                    setInputAmount={(amount) => setInputAmount(option.poolTokenAddress, amount)}
                    setSelectedTokenOption={(address) => setSelectedOption(option.poolTokenIndex, address)}
                    value={inputAmounts[option.poolTokenAddress]}
                    key={index}
                    mb="4"
                />
            ))}
            <PoolInvestSummary mt="6" />
            <PoolInvestSettings mt="8" />
            <Collapse in={hasHighPriceImpact} animateOpacity>
                <Alert status="error">
                    <Checkbox
                        id="high-price-impact-acknowledge"
                        isChecked={acknowledgeHighPriceImpact}
                        colorScheme="red"
                        onChange={toggleAcknowledgeHighPriceImpact}
                    >
                        I accept that depositing tokens in custom proportions may influence an imbalance within the
                        pool. My deposit will, therefore, incur the fees and potential losses associated with
                        rebalancing the assets.{' '}
                    </Checkbox>
                </Alert>
            </Collapse>
            <BeetsButton
                isFullWidth
                mt="8"
                onClick={onShowPreview}
                isDisabled={!(!hasHighPriceImpact || acknowledgeHighPriceImpact)}
            >
                Preview
            </BeetsButton>
        </Box>
    );
}
