import { InfoButton } from '~/components/info-button/InfoButton';
import { Box, BoxProps, Flex, useBoolean } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { ModalSectionHeadline } from '~/components/modal/ModalSectionHeadline';
import { SlippageTextLinkMenu } from '~/components/slippage/SlippageTextLinkMenu';

export function PoolWithdrawSettings({ ...rest }: BoxProps) {
    return (
        <Box {...rest}>
            <ModalSectionHeadline headline={`Settings`} />
            <BeetsBox>
                <Flex px="3" py="2" justifyContent="center" borderBottomWidth={0}>
                    <Box flex="1">
                        <InfoButton
                            label="Max slippage"
                            moreInfoUrl="https://docs.beets.fi"
                            infoText="The maximum amount of slippage that you're willing to accept for the transaction."
                        />
                    </Box>

                    <SlippageTextLinkMenu />
                </Flex>
            </BeetsBox>
        </Box>
    );
}
