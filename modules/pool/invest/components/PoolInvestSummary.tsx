import { Box, BoxProps, Flex } from '@chakra-ui/react';
import { InfoButton } from '~/components/info-button/InfoButton';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { BeetsBox } from '~/components/box/BeetsBox';
import { usePool } from '~/modules/pool/lib/usePool';
import { BeetsBoxLineItem } from '~/components/box/BeetsBoxLineItem';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { usePoolJoinGetBptOutAndPriceImpactForTokensIn } from '~/modules/pool/invest/lib/usePoolJoinGetBptOutAndPriceImpactForTokensIn';
import numeral from 'numeral';
import { BeetsSkeleton } from '~/components/skeleton/BeetsSkeleton';
import { CardRow } from '~/components/card/CardRow';
import Card from '~/components/card/Card';

interface Props extends BoxProps {}

export function PoolInvestSummary({ ...rest }: Props) {
    const { pool } = usePool();
    const { totalInvestValue } = useInvest();
    const weeklyYield = (totalInvestValue * parseFloat(pool.dynamicData.apr.total)) / 52;
    const { data: bptOutAndPriceImpact, isLoading } = usePoolJoinGetBptOutAndPriceImpactForTokensIn();

    return (
        <BeetsBox p="2" {...rest}>
            <CardRow>
                <Box flex="1">Total</Box>
                <Box>{numberFormatUSDValue(totalInvestValue)}</Box>
            </CardRow>
            <CardRow>
                <Box flex="1">
                    <InfoButton
                        label="Price impact"
                        moreInfoUrl="https://docs.beets.fi"
                        infoText="Nunc rutrum aliquet ligula ut tincidunt. Nulla ligula justo, laoreet laoreet convallis et, lacinia non turpis. Duis consectetur sem risus, in lobortis est congue id."
                    />
                </Box>
                {isLoading ? (
                    <BeetsSkeleton height="24px" width="64px" />
                ) : (
                    <Box>{numeral(bptOutAndPriceImpact?.priceImpact || 0).format('0.00%')}</Box>
                )}
            </CardRow>
            <CardRow mb="0">
                <Box flex="1">
                    <InfoButton
                        label="Potential weekly yield"
                        moreInfoUrl="https://docs.beets.fi"
                        infoText="Nunc rutrum aliquet ligula ut tincidunt. Nulla ligula justo, laoreet laoreet convallis et, lacinia non turpis. Duis consectetur sem risus, in lobortis est congue id."
                    />
                </Box>
                <Flex alignItems="center">
                    <Box mr="1">{numberFormatUSDValue(weeklyYield)}</Box>
                    <AprTooltip data={pool.dynamicData.apr} onlySparkles={true} sparklesSize="sm" />
                </Flex>
            </CardRow>
        </BeetsBox>
    );
}
