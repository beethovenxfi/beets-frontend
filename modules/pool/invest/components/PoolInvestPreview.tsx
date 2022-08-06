import { Box, HStack, Text } from '@chakra-ui/react';
import TokenAvatar from '~/components/token/TokenAvatar';
import { tokenFormatAmount, tokenFormatAmountPrecise } from '~/lib/services/token/token-util';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { BeetsBox } from '~/components/box/BeetsBox';
import { useGetTokens } from '~/lib/global/useToken';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { PoolInvestSummary } from '~/modules/pool/invest/components/PoolInvestSummary';
import { PoolInvestActions } from '~/modules/pool/invest/components/PoolInvestActions';
import { CardRow } from '~/components/card/CardRow';

interface Props {
    onInvestComplete(): void;
    onClose(): void;
}

export function PoolInvestPreview({ onInvestComplete, onClose }: Props) {
    const { priceForAmount } = useGetTokens();
    const { selectedInvestTokensWithAmounts } = useInvest();

    return (
        <Box>
            <BeetsBox mt="4" p="2">
                {selectedInvestTokensWithAmounts.map((token, index) => {
                    return (
                        <CardRow
                            key={token.address}
                            mb={index === selectedInvestTokensWithAmounts.length - 1 ? '0' : '1'}
                            alignItems="center"
                        >
                            <HStack spacing="1.5" flex="1">
                                <TokenAvatar size="xs" address={token.address} />
                                <Text>{token.symbol}</Text>
                            </HStack>
                            <Box>
                                <Box textAlign="right">{tokenFormatAmountPrecise(token.amount, token.decimals)}</Box>
                                <Box textAlign="right" fontSize="sm" color="gray.200">
                                    {numberFormatUSDValue(priceForAmount(token))}
                                </Box>
                            </Box>
                        </CardRow>
                    );
                })}
            </BeetsBox>
            <PoolInvestSummary mt="6" />
            <PoolInvestActions onInvestComplete={onInvestComplete} onClose={onClose} />
        </Box>
    );
}
