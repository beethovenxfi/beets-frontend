import { Box, Button, Text, Collapse, Alert, Checkbox, useBoolean, Heading, Skeleton } from '@chakra-ui/react';
import { useWithdrawState } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { BoxProps, HStack, VStack } from '@chakra-ui/layout';
import { usePoolExitGetSingleAssetWithdrawForBptIn } from '~/modules/pool/withdraw/lib/usePoolExitGetSingleAssetWithdrawForBptIn';
import { usePoolExitGetBptInForSingleAssetWithdraw } from '~/modules/pool/withdraw/lib/usePoolExitGetBptInForSingleAssetWithdraw';
import { useEffect } from 'react';
import { PoolWithdrawSettings } from '~/modules/pool/withdraw/components/PoolWithdrawSettings';
import { BeetsTokenInputWithSlider } from '~/components/inputs/BeetsTokenInputWithSlider';
import { usePool } from '~/modules/pool/lib/usePool';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { usePoolExitGetProportionalWithdrawEstimate } from '../lib/usePoolExitGetProportionalWithdrawEstimate';
import { useGetTokens } from '~/lib/global/useToken';
import { sum } from 'lodash';

interface Props extends BoxProps {
    onShowPreview: () => void;
}

export function PoolWithdrawSingleAsset({ onShowPreview, ...rest }: Props) {
    const { allTokens, pool } = usePool();
    const { formattedPrice, priceForAmount } = useGetTokens();
    const { singleAssetWithdraw, setSingleAssetWithdrawAmount, setSingleAssetWithdraw, selectedWithdrawType } =
        useWithdrawState();
    const singleAssetWithdrawForBptIn = usePoolExitGetSingleAssetWithdrawForBptIn();
    const {
        hasHighPriceImpact,
        formattedPriceImpact,
        isLoading: isLoadingSingleAsset,
        hasMediumPriceImpact,
    } = usePoolExitGetBptInForSingleAssetWithdraw();
    const [acknowledgeHighPriceImpact, { toggle: toggleAcknowledgeHighPriceImpact }] = useBoolean(false);
    const { data: proportionalEstimate, isLoading: isLoadingProportionalEstimate } =
        usePoolExitGetProportionalWithdrawEstimate();

    useEffect(() => {
        const defaultSingleAsset = pool.withdrawConfig.options[0]?.tokenOptions[0]?.address;

        if (!singleAssetWithdraw && defaultSingleAsset) {
            setSingleAssetWithdraw(defaultSingleAsset);
        }
    }, [singleAssetWithdraw]);

    const withdrawToken = allTokens.find((token) => token.address === singleAssetWithdraw?.address);

    if (!singleAssetWithdraw || !withdrawToken) {
        return null;
    }

    const tokenOptions = pool.withdrawConfig.options.map((option) => option.tokenOptions).flat();
    const selectedTokenOption =
        tokenOptions.find((tokenOption) => tokenOption.address === singleAssetWithdraw.address) || tokenOptions[0];
    const maxAmount = singleAssetWithdrawForBptIn.data?.tokenAmount || '0';

    //TODO: precision
    const isValid =
        parseFloat(singleAssetWithdraw.amount) > 0 &&
        parseFloat(singleAssetWithdraw.amount) <= parseFloat(maxAmount) &&
        (!hasHighPriceImpact || acknowledgeHighPriceImpact);

    const proportionalWithdrawValue = sum((proportionalEstimate || []).map(priceForAmount));

    return (
        <VStack {...rest}>
            <VStack width="full" px="4" spacing="3">
                <VStack alignItems="flex-start" spacing="1">
                    <Heading size="sm">Choose an asset</Heading>
                    <Text>
                        Select your desired asset, then drag the slider or enter an amount to configure your withdraw.
                    </Text>
                </VStack>
                <BeetsTokenInputWithSlider
                    tokenOptions={tokenOptions}
                    selectedTokenOption={selectedTokenOption}
                    balance={maxAmount}
                    setInputAmount={(amount) =>
                        setSingleAssetWithdrawAmount({ address: selectedTokenOption.address, amount })
                    }
                    value={singleAssetWithdraw.amount}
                    setSelectedTokenOption={setSingleAssetWithdraw}
                    isWithdraw
                />
                <PoolWithdrawSettings mt="6" />
                <Collapse in={hasHighPriceImpact} animateOpacity>
                    <Alert status="error" borderRadius="md">
                        <Checkbox
                            id="high-price-impact-acknowledge"
                            isChecked={acknowledgeHighPriceImpact}
                            colorScheme="red"
                            onChange={toggleAcknowledgeHighPriceImpact}
                            mt="1"
                            mr="2"
                        />
                        <Box>
                            I confirm that my single asset withdraw will result in a {formattedPriceImpact} price
                            impact, subjecting me to fees.
                        </Box>
                    </Alert>
                </Collapse>
                <Button variant="primary" width="full" mt="8" onClick={onShowPreview} isDisabled={!isValid}>
                    Preview
                </Button>
            </VStack>
            <VStack width="full" py="4" backgroundColor="blackAlpha.500" px="5">
                <HStack width="full" justifyContent="space-between" fontSize=".85rem">
                    <Text color="gray.100">Withdraw total</Text>
                    <Text>
                        {selectedWithdrawType === 'SINGLE_ASSET' && singleAssetWithdraw
                            ? formattedPrice(singleAssetWithdraw)
                            : null}
                        {selectedWithdrawType === 'PROPORTIONAL' ? (
                            <>
                                {isLoadingProportionalEstimate ? (
                                    <Skeleton height="20px" width="64px" marginBottom="4px" />
                                ) : (
                                    numberFormatUSDValue(proportionalWithdrawValue)
                                )}
                            </>
                        ) : null}
                    </Text>
                </HStack>
                <HStack width="full" justifyContent="space-between" fontSize=".85rem">
                    <Text color="gray.100">Price impact</Text>
                    {selectedWithdrawType === 'PROPORTIONAL' ? (
                        <Box>0.00%</Box>
                    ) : isLoadingSingleAsset ? (
                        <Skeleton height="20px" width="64px" mb="4px" />
                    ) : (
                        <Box color={hasMediumPriceImpact ? 'orange' : 'current'}>{formattedPriceImpact}</Box>
                    )}
                </HStack>
            </VStack>
        </VStack>
    );
}
