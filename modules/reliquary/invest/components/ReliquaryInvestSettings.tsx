import { InfoButton } from '~/components/info-button/InfoButton';
import { Box, BoxProps, HStack, VStack } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { SlippageTextLinkMenu } from '~/components/slippage/SlippageTextLinkMenu';
import React from 'react';

export function ReliquaryInvestSettings({ ...rest }: BoxProps) {
    return (
        <Box {...rest} width="full">
            <BeetsBox p="2" width="full">
                <VStack width="full">
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
