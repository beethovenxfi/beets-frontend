import { Box, BoxProps, Skeleton } from '@chakra-ui/react';
import { InfoButton } from '~/components/info-button/InfoButton';
import { BeetsBox } from '~/components/box/BeetsBox';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import numeral from 'numeral';

import { usePoolExitGetProportionalWithdrawEstimate } from '~/modules/pool/withdraw/lib/usePoolExitGetProportionalWithdrawEstimate';
import { sum } from 'lodash';
import { useGetTokens } from '~/lib/global/useToken';
import { usePoolExitGetBptInForSingleAssetWithdraw } from '~/modules/pool/withdraw/lib/usePoolExitGetBptInForSingleAssetWithdraw';
import { useWithdrawState } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { CardRow } from '~/components/card/CardRow';

interface Props extends BoxProps {}

export function PoolWithdrawSummary({ ...rest }: Props) {
    const { selectedWithdrawType, singleAssetWithdraw } = useWithdrawState();
    const { data, isLoading } = usePoolExitGetProportionalWithdrawEstimate();
    const { priceForAmount, formattedPrice } = useGetTokens();
    const totalValue = sum((data || []).map(priceForAmount));
    const bptInForSingleAssetWithdraw = usePoolExitGetBptInForSingleAssetWithdraw();
    const priceImpact = bptInForSingleAssetWithdraw.data?.priceImpact;

    return (
        <BeetsBox p="2" {...rest}>
            <CardRow>
                <Box flex="1">Total</Box>
                <Box>
                    {selectedWithdrawType === 'SINGLE_ASSET' && singleAssetWithdraw
                        ? formattedPrice(singleAssetWithdraw)
                        : null}
                    {selectedWithdrawType === 'PROPORTIONAL' ? (
                        <>
                            {isLoading ? (
                                <Skeleton height="20px" width="64px" marginBottom="4px" />
                            ) : (
                                numberFormatUSDValue(totalValue)
                            )}
                        </>
                    ) : null}
                </Box>
            </CardRow>
            <CardRow mb="0">
                <Box flex="1">
                    <InfoButton
                        label="Price impact"
                        moreInfoUrl="https://docs.beets.fi"
                        infoText="Nunc rutrum aliquet ligula ut tincidunt. Nulla ligula justo, laoreet laoreet convallis et, lacinia non turpis. Duis consectetur sem risus, in lobortis est congue id."
                    />
                </Box>
                <Box>
                    {selectedWithdrawType === 'PROPORTIONAL' ? (
                        <Box>0.00%</Box>
                    ) : bptInForSingleAssetWithdraw.isLoading ? (
                        <Skeleton height="20px" width="64px" mb="4px" />
                    ) : (
                        <Box>{numeral(priceImpact).format('0.00%')}</Box>
                    )}
                </Box>
            </CardRow>
        </BeetsBox>
    );
}
