import { InfoButton } from '~/components/info-button/InfoButton';
import { Box, BoxProps, HStack, Skeleton, VStack, Text } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { SlippageTextLinkMenu } from '~/components/slippage/SlippageTextLinkMenu';
import React from 'react';
import { usePoolJoinGetBptOutAndPriceImpactForTokensIn } from '~/modules/pool/invest/lib/usePoolJoinGetBptOutAndPriceImpactForTokensIn';
import { useTranslation } from 'next-i18next';

export function ReliquaryInvestSettings({ ...rest }: BoxProps) {
    const { formattedPriceImpact, hasHighPriceImpact, hasMediumPriceImpact, isLoading } =
        usePoolJoinGetBptOutAndPriceImpactForTokensIn();
    const { t } = useTranslation('reliquary');

    return (
        <Box {...rest} width="full">
            <BeetsBox p="2" width="full">
                <VStack width="full">
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
                            label={t('reliquary.invest.settings.priceImpact.label') || ''}
                            infoText={t('reliquary.invest.settings.priceImpact.info')}
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
                                label={t('reliquary.invest.settings.slippage.label') || ''}
                                infoText={t('reliquary.invest.settings.slippage.info')}
                            />
                        </Box>
                        <SlippageTextLinkMenu />
                    </HStack>
                </VStack>
            </BeetsBox>
        </Box>
    );
}
