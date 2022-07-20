import { Box, Text } from '@chakra-ui/react';
import { useWithdrawState } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { usePool } from '~/modules/pool/lib/usePool';
import { BoxProps } from '@chakra-ui/layout';
import { usePoolExitGetSingleAssetWithdrawForBptIn } from '~/modules/pool/withdraw/lib/usePoolExitGetSingleAssetWithdrawForBptIn';
import { useEffect } from 'react';
import { PoolWithdrawSummary } from '~/modules/pool/withdraw/components/PoolWithdrawSummary';
import { PoolWithdrawSettings } from '~/modules/pool/withdraw/components/PoolWithdrawSettings';
import BeetsButton from '~/components/button/Button';
import { BeetsTokenInputWithSlider } from '~/components/inputs/BeetsTokenInputWithSlider';

interface Props extends BoxProps {
    onShowPreview: () => void;
}

export function PoolWithdrawSingleAsset({ onShowPreview, ...rest }: Props) {
    const { allTokens, pool } = usePool();
    const { singleAssetWithdraw, setSingleAssetWithdrawAmount, setSingleAssetWithdraw } = useWithdrawState();
    const singleAssetWithdrawForBptIn = usePoolExitGetSingleAssetWithdrawForBptIn();

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
        singleAssetWithdraw.amount === '' || parseFloat(singleAssetWithdraw.amount) <= parseFloat(maxAmount);

    return (
        <Box py={4} {...rest}>
            <Box mb="4">
                <Text>
                    Select your desired asset, then drag the slider or enter an amount to configure your withdraw.
                </Text>
            </Box>
            <BeetsTokenInputWithSlider
                tokenOptions={tokenOptions}
                selectedTokenOption={selectedTokenOption}
                balance={maxAmount}
                setInputAmount={(amount) =>
                    setSingleAssetWithdrawAmount({ address: selectedTokenOption.address, amount })
                }
                value={singleAssetWithdraw.amount}
                setSelectedTokenOption={setSingleAssetWithdraw}
            />
            <PoolWithdrawSummary mt="6" />
            <PoolWithdrawSettings mt="8" />
            <BeetsButton isFullWidth mt="8" onClick={onShowPreview} isDisabled={!isValid}>
                Preview
            </BeetsButton>
        </Box>
    );
}
