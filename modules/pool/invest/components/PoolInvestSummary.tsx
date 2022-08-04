import { Box, BoxProps, Flex, Skeleton } from '@chakra-ui/react';
import { InfoButton } from '~/components/info-button/InfoButton';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { BeetsBox } from '~/components/box/BeetsBox';
import { usePool } from '~/modules/pool/lib/usePool';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { usePoolJoinGetBptOutAndPriceImpactForTokensIn } from '~/modules/pool/invest/lib/usePoolJoinGetBptOutAndPriceImpactForTokensIn';
import numeral from 'numeral';

import { CardRow } from '~/components/card/CardRow';

interface Props extends BoxProps {}

export function PoolInvestSummary({ ...rest }: Props) {
    const { pool } = usePool();
    const { totalInvestValue } = useInvest();
    const weeklyYield = (totalInvestValue * parseFloat(pool.dynamicData.apr.total)) / 52;
    const { formattedPriceImpact, hasHighPriceImpact, hasMediumPriceImpact, isLoading } =
        usePoolJoinGetBptOutAndPriceImpactForTokensIn();

    return (
        <BeetsBox p="2" {...rest}>
            <CardRow>
                <Box flex="1">Total</Box>
                <Box>{numberFormatUSDValue(totalInvestValue)}</Box>
            </CardRow>
            <CardRow style={hasHighPriceImpact ? { color: 'white', fontWeight: 'bold', backgroundColor: 'red' } : {}}>
                <Box flex="1">
                    {/*<InfoButton
                        label="Price impact"
                        moreInfoUrl="https://docs.beets.fi"
                        infoText="‘Price Impact’ is the difference between the current market price and the price you will pay due to your investment influencing the balance and internal price of tokens within the pool. You are subject to the swap fees and potential losses associated with rebalancing."
                    />*/}
                    Price impact
                </Box>
                {isLoading ? (
                    <Skeleton height="24px" width="64px" />
                ) : (
                    <Box color={hasMediumPriceImpact ? 'orange' : 'current'}>{formattedPriceImpact}</Box>
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
