import { Box, HStack, Text } from '@chakra-ui/react';
import { BeetsBoxLineItem } from '~/components/box/BeetsBoxLineItem';
import TokenAvatar from '~/components/token/TokenAvatar';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { BeetsBox } from '~/components/box/BeetsBox';
import { useGetTokens } from '~/lib/global/useToken';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { PoolInvestSummary } from '~/modules/pool/invest/components/PoolInvestSummary';
import { PoolInvestActions } from '~/modules/pool/invest/components/PoolInvestActions';

interface Props {
    onInvestComplete(): void;
}

export function PoolInvestPreview({ onInvestComplete }: Props) {
    const { priceForAmount } = useGetTokens();
    const { selectedInvestTokensWithAmounts } = useInvest();

    return (
        <Box>
            <BeetsBox mt="4" pt="0.5">
                {selectedInvestTokensWithAmounts.map((token, index) => {
                    return (
                        <BeetsBoxLineItem
                            key={token.address}
                            last={index === selectedInvestTokensWithAmounts.length - 1}
                            pl="3"
                            center={true}
                            leftContent={
                                <HStack spacing="1.5" flex="1">
                                    <TokenAvatar size="xs" address={token.address} />
                                    <Text>{token.symbol}</Text>
                                </HStack>
                            }
                            rightContent={
                                <Box>
                                    <Box textAlign="right">{tokenFormatAmount(token.amount)}</Box>
                                    <Box textAlign="right" fontSize="sm" color="gray.200">
                                        {numberFormatUSDValue(priceForAmount(token))}
                                    </Box>
                                </Box>
                            }
                        />
                    );
                })}
            </BeetsBox>
            <PoolInvestSummary mt="6" mb="8" />
            <PoolInvestActions onInvestComplete={onInvestComplete} />
        </Box>
    );
}
