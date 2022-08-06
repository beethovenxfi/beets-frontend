import { InfoButton } from '~/components/info-button/InfoButton';
import { Box, BoxProps, Collapse, Flex, Switch, Text } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { ModalSectionHeadline } from '~/components/modal/ModalSectionHeadline';
import { SlippageTextLinkMenu } from '~/components/slippage/SlippageTextLinkMenu';
import { CardRow } from '~/components/card/CardRow';
import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';
import { BeetsBatchRelayerApprovalButton } from '~/components/button/BeetsBatchRelayerApprovalButton';
import { useHasBatchRelayerApproval } from '~/lib/util/useHasBatchRelayerApproval';
import { usePool } from '~/modules/pool/lib/usePool';
import { useEffect } from 'react';

export function PoolInvestSettings({ ...rest }: BoxProps) {
    const { zapEnabled, toggleZapEnabled } = useInvestState();
    const { data: hasBatchRelayerApproval } = useHasBatchRelayerApproval();
    const { pool, supportsZap, requiresBatchRelayerOnJoin } = usePool();

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
        <Box {...rest}>
            <ModalSectionHeadline headline={`Settings`} />
            <BeetsBox p="2">
                {requiresBatchRelayerOnJoin && (
                    <CardRow>
                        <Box flex="1">
                            {batchRelayerInfoButton}
                            <Text color="gray.200" fontSize="sm">
                                Investing into this pool requires the batch relayer.
                            </Text>
                        </Box>
                        <Box>
                            {!hasBatchRelayerApproval ? (
                                <BeetsBatchRelayerApprovalButton />
                            ) : (
                                <Text color="green">Approved</Text>
                            )}
                        </Box>
                    </CardRow>
                )}
                <CardRow flexDirection="column">
                    <Flex>
                        <Box flex="1">
                            <InfoButton
                                label="Zap into farm"
                                infoText="With ZAP enabled, your investment BPTs are automatically deposited to the farm, saving time & maximizing yield."
                            />
                            <Text color="gray.200" fontSize="sm">
                                Deposit my BPTs directly into the farm with ZAP.
                            </Text>
                        </Box>
                        <Switch
                            id="zap-into-farm"
                            colorScheme="green"
                            isChecked={zapEnabled}
                            onChange={toggleZapEnabled}
                        />
                    </Flex>
                    {supportsZap && !requiresBatchRelayerOnJoin && (
                        <Collapse in={zapEnabled} animateOpacity>
                            <Flex mt="2" alignItems="center">
                                <Box flex="1">{batchRelayerInfoButton}</Box>
                                <Box>
                                    {!hasBatchRelayerApproval ? (
                                        <BeetsBatchRelayerApprovalButton />
                                    ) : (
                                        <Text color="green">Approved</Text>
                                    )}
                                </Box>
                            </Flex>
                        </Collapse>
                    )}
                </CardRow>

                <CardRow mb="0">
                    <Box flex="1">
                        <InfoButton
                            label="Max slippage"
                            infoText="The maximum amount of slippage that you're willing to accept for this transaction."
                        />
                    </Box>
                    <SlippageTextLinkMenu />
                </CardRow>
            </BeetsBox>
        </Box>
    );
}
