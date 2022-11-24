import { InfoButton } from '~/components/info-button/InfoButton';
import { Box, BoxProps, Collapse, Flex, HStack, Switch, Text, VStack } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { ModalSectionHeadline } from '~/components/modal/ModalSectionHeadline';
import { SlippageTextLinkMenu } from '~/components/slippage/SlippageTextLinkMenu';
import { CardRow } from '~/components/card/CardRow';
import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';
import { BeetsBatchRelayerApprovalButton } from '~/components/button/BeetsBatchRelayerApprovalButton';
import { useHasBatchRelayerApproval } from '~/lib/util/useHasBatchRelayerApproval';
import React, { useEffect } from 'react';
import { usePool } from '~/modules/pool/lib/usePool';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function PoolInvestSettings({ ...rest }: BoxProps) {
    const { zapEnabled, toggleZapEnabled } = useInvestState();
    const { data: hasBatchRelayerApproval, refetch: refetchBatchRelayerApproval } = useHasBatchRelayerApproval();
    const { pool, supportsZap, requiresBatchRelayerOnJoin } = usePool();
    const networkConfig = useNetworkConfig();

    useEffect(() => {
        if (!supportsZap && zapEnabled) {
            toggleZapEnabled();
        } else if (supportsZap && !zapEnabled) {
            toggleZapEnabled();
        }
    }, [supportsZap]);

    const batchRelayerInfoButton = (
        <InfoButton
            label="Batch Relayer"
            infoText="The Batch Relayer is a smart contract that allows multiple individual actions to be grouped together into a single transaction. Zapping requires you to approve the Batch Relayer once."
        />
    );

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
