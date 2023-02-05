import { InfoButton } from '~/components/info-button/InfoButton';
import { Box, BoxProps, Text } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { ModalSectionHeadline } from '~/components/modal/ModalSectionHeadline';
import { SlippageTextLinkMenu } from '~/components/slippage/SlippageTextLinkMenu';
import { CardRow } from '~/components/card/CardRow';
import { useHasBatchRelayerApproval } from '~/lib/util/useHasBatchRelayerApproval';
import { usePool } from '~/modules/pool/lib/usePool';
import { BeetsBatchRelayerApprovalButton } from '~/components/button/BeetsBatchRelayerApprovalButton';

export function ReliquaryWithdrawSettings({ ...rest }: BoxProps) {
    return (
        <Box {...rest}>
            <ModalSectionHeadline headline={`Settings`} />
            <BeetsBox p="2">
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
