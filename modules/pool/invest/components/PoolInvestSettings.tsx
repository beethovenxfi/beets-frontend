import { InfoButton } from '~/components/info-button/InfoButton';
import { Box, BoxProps, Flex, HStack, Skeleton, Text, Switch, VStack } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { SlippageTextLinkMenu } from '~/components/slippage/SlippageTextLinkMenu';
import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';
import React, { useEffect } from 'react';
import { usePool } from '~/modules/pool/lib/usePool';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { usePoolJoinGetBptOutAndPriceImpactForTokensIn } from '../lib/usePoolJoinGetBptOutAndPriceImpactForTokensIn';

export function PoolInvestSettings({ ...rest }: BoxProps) {
    const { zapEnabled, toggleZapEnabled, inputAmounts, selectedOptions } = useInvestState();
    const { supportsZap } = usePool();
    const networkConfig = useNetworkConfig();
    const {} = useInvestState();
    const { formattedPriceImpact, hasHighPriceImpact, hasMediumPriceImpact, isLoading } =
        usePoolJoinGetBptOutAndPriceImpactForTokensIn({ inputAmounts, selectedOptions });

    useEffect(() => {
        if (!supportsZap && zapEnabled) {
            toggleZapEnabled();
        } else if (supportsZap && !zapEnabled) {
            toggleZapEnabled();
        }
    }, [supportsZap]);

    return (
        <Box {...rest} width="full">
            <BeetsBox p="2" width="full">
                <VStack width="full">
                    {supportsZap && (
                        <>
                            <Flex width="full">
                                <Box flex="1">
                                    <InfoButton
                                        label={`Zap into ${networkConfig.farmTypeName}`}
                                        infoText={`With ZAP enabled, your investment BPTs are automatically deposited to the ${networkConfig.farmTypeName}, saving time & maximizing yield.`}
                                    />
                                </Box>
                                <Switch
                                    id="zap-into-farm"
                                    colorScheme="green"
                                    isChecked={zapEnabled}
                                    onChange={toggleZapEnabled}
                                />
                            </Flex>
                        </>
                    )}
                    <HStack
                        width="full"
                        justifyContent="space-between"
                        style={
                            hasHighPriceImpact
                                ? {
                                      color: 'white',
                                      fontWeight: 'bold',
                                      backgroundColor: 'red',
                                      borderRadius: '4px',
                                      padding: '0px 4px 2px 4px',
                                  }
                                : {}
                        }
                    >
                        <InfoButton
                            label="Price impact"
                            infoText="This is the difference between the current market price and the price you will pay due to your investment influencing the balance and internal price of tokens within the pool."
                        />
                        {isLoading ? (
                            <Skeleton h="3" w="12" />
                        ) : (
                            <Text fontSize=".85rem" color={hasMediumPriceImpact ? 'orange' : 'white'}>
                                {formattedPriceImpact}
                            </Text>
                        )}
                    </HStack>
                    <HStack justifyContent="space-between" width="full">
                        <Box flex="1">
                            <InfoButton
                                label="Max slippage"
                                infoText="The maximum amount of slippage that you're willing to accept for this transaction."
                            />
                        </Box>
                        <SlippageTextLinkMenu />
                    </HStack>
                </VStack>
            </BeetsBox>
        </Box>
    );
}
