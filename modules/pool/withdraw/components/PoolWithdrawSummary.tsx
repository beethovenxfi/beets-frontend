import { Box, BoxProps, Skeleton } from '@chakra-ui/react';
import { InfoButton } from '~/components/info-button/InfoButton';
import { BeetsBox } from '~/components/box/BeetsBox';
import { numberFormatUSDValue } from '~/lib/util/number-formats';

import { usePoolExitGetProportionalWithdrawEstimate } from '~/modules/pool/withdraw/lib/usePoolExitGetProportionalWithdrawEstimate';
import { sum } from 'lodash';
import { useGetTokens } from '~/lib/global/useToken';
import { usePoolExitGetBptInForSingleAssetWithdraw } from '~/modules/pool/withdraw/lib/usePoolExitGetBptInForSingleAssetWithdraw';
import { useWithdrawState } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { CardRow } from '~/components/card/CardRow';
import { SlippageTextLinkMenu } from '~/components/slippage/SlippageTextLinkMenu';

interface Props extends BoxProps {}

export function PoolWithdrawSummary({ ...rest }: Props) {
    const { selectedWithdrawType, singleAssetWithdraw } = useWithdrawState();
    const { data, isLoading } = usePoolExitGetProportionalWithdrawEstimate();
    const { priceForAmount, formattedPrice } = useGetTokens();
    const {
        hasHighPriceImpact,
        hasMediumPriceImpact,
        formattedPriceImpact,
        isLoading: isLoadingSingleAsset,
    } = usePoolExitGetBptInForSingleAssetWithdraw();

    const totalValue = sum((data || []).map(priceForAmount));

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
            <CardRow
                style={hasHighPriceImpact ? { color: 'white', fontWeight: 'bold', backgroundColor: 'red' } : {}}
                mb="0"
            >
                <Box flex="1">
                    <InfoButton
                        label="Price impact"
                        infoText="This is the difference between the current market price and the price you will pay due to your withdraw influencing the balance and internal price of tokens within the pool."
                    />
                </Box>
                <Box>
                    {selectedWithdrawType === 'PROPORTIONAL' ? (
                        <Box>0.00%</Box>
                    ) : isLoadingSingleAsset ? (
                        <Skeleton height="20px" width="64px" mb="4px" />
                    ) : (
                        <Box color={hasMediumPriceImpact ? 'orange' : 'current'}>{formattedPriceImpact}</Box>
                    )}
                </Box>
            </CardRow>
            {/*<CardRow mb="0">
                <Box flex="1">
                    <InfoButton label="Max slippage" infoText="Slippage defines the..." />
                </Box>
                <SlippageTextLinkMenu />
            </CardRow>*/}
        </BeetsBox>
    );
}
