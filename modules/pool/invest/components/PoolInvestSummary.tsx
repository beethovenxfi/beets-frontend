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

interface Props extends BoxProps {}

export function PoolInvestSummary({ ...rest }: Props) {
    const { pool } = usePool();
    const { totalInvestValue } = useInvest();
    const weeklyYield = (totalInvestValue * parseFloat(pool.dynamicData.apr.total)) / 52;
    const { bptOutAndPriceImpact, hasHighPriceImpact, isLoading } = usePoolJoinGetBptOutAndPriceImpactForTokensIn();

    return (
        <BeetsBox {...rest}>
            <BeetsBoxLineItem
                p="14px"
                leftContent={<Box>Total</Box>}
                rightContent={<Box>{numberFormatUSDValue(totalInvestValue)}</Box>}
            />
            <Box border="2px" borderColor={hasHighPriceImpact ? 'red.300' : 'transparent'} borderRadius="md">
                <BeetsBoxLineItem
                    leftContent={
                        <InfoButton
                            label="Price impact"
                            moreInfoUrl="https://docs.beets.fi"
                            infoText="‘Price Impact’ is the difference between the current market price and the price you will pay due to your investment influencing the balance and internal price of tokens within the pool. You are subject to the swap fees and potential losses associated with rebalancing."
                        />
                    }
                    rightContent={
                        isLoading ? (
                            <BeetsSkeleton height="24px" width="64px" />
                        ) : (
                            <Box>{numeral(bptOutAndPriceImpact?.priceImpact || 0).format('0.00%')}</Box>
                        )
                    }
                />
            </Box>
            <BeetsBoxLineItem
                p="14px"
                leftContent={
                    <InfoButton
                        label="Potential weekly yield"
                        moreInfoUrl="https://docs.beets.fi"
                        infoText="Nunc rutrum aliquet ligula ut tincidunt. Nulla ligula justo, laoreet laoreet convallis et, lacinia non turpis. Duis consectetur sem risus, in lobortis est congue id."
                    />
                }
                rightContent={
                    <Flex alignItems="center">
                        <Box mr="1">{numberFormatUSDValue(weeklyYield)}</Box>
                        <AprTooltip data={pool.dynamicData.apr} onlySparkles={true} sparklesSize="sm" />
                    </Flex>
                }
                last={true}
            />
        </BeetsBox>
    );
}
