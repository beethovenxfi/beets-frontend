import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { Alert, Box, Button, Checkbox, Collapse, useBoolean } from '@chakra-ui/react';
import { PoolInvestSummary } from '~/modules/pool/invest/components/PoolInvestSummary';
import { PoolInvestSettings } from '~/modules/pool/invest/components/PoolInvestSettings';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { BeetsTokenInputWithSlider } from '~/components/inputs/BeetsTokenInputWithSlider';
import { usePoolJoinGetBptOutAndPriceImpactForTokensIn } from '~/modules/pool/invest/lib/usePoolJoinGetBptOutAndPriceImpactForTokensIn';
import { usePool } from '~/modules/pool/lib/usePool';
import React from 'react';
import { PoolInvestPriceImpact } from '~/modules/pool/invest/components/PoolInvestPriceImpact';

interface Props {
    onShowPreview(): void;
}

export function PoolInvestCustom({ onShowPreview }: Props) {
    const { pool } = usePool();
    const { customInputAmounts: inputAmounts, setInputAmount, setSelectedOption } = useInvestState();
    const { selectedInvestTokens, hasValidUserInput } = useInvest();
    const { userPoolTokenBalances } = usePoolUserTokenBalancesInWallet();
    const { hasHighPriceImpact, formattedPriceImpact } = usePoolJoinGetBptOutAndPriceImpactForTokensIn();
    const [acknowledgeHighPriceImpact, { toggle: toggleAcknowledgeHighPriceImpact }] = useBoolean(false);

    return (
        <Box>
            <Box p="4">
                <Box mb="4">
                    <PoolInvestSummary />
                </Box>
                {pool.investConfig.options.map((option, index) => {
                    return (
                        <BeetsTokenInputWithSlider
                            tokenOptions={option.tokenOptions}
                            selectedTokenOption={selectedInvestTokens[index]}
                            balance={
                                userPoolTokenBalances.find(
                                    (userBalance) => userBalance.address === selectedInvestTokens[index].address,
                                )?.amount || '0'
                            }
                            setInputAmount={(amount) => setInputAmount(selectedInvestTokens[index].address, amount)}
                            setSelectedTokenOption={(address) => setSelectedOption(option.poolTokenIndex, address)}
                            value={inputAmounts ? inputAmounts[selectedInvestTokens[index].address] : '0'}
                            key={index}
                            mb="4"
                        />
                    );
                })}
                <PoolInvestSettings mt="4" />
                <Collapse in={hasHighPriceImpact} animateOpacity>
                    <Alert status="error" borderRadius="md" mt="4">
                        <Checkbox
                            id="high-price-impact-acknowledge"
                            isChecked={acknowledgeHighPriceImpact}
                            colorScheme="red"
                            onChange={toggleAcknowledgeHighPriceImpact}
                            mt="1"
                            mr="2"
                        />
                        <Box>
                            I confirm that my custom investment will result in a {formattedPriceImpact} price impact,
                            subjecting me to fees and possible impermanent loss.
                        </Box>
                    </Alert>
                </Collapse>
                <Button
                    variant="primary"
                    width="full"
                    mt="4"
                    onClick={onShowPreview}
                    isDisabled={!hasValidUserInput || (hasHighPriceImpact && !acknowledgeHighPriceImpact)}
                >
                    Preview
                </Button>
            </Box>
            <PoolInvestPriceImpact />
        </Box>
    );
}
