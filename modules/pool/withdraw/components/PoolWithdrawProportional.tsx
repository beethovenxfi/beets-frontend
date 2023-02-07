import {
    Box,
    Button,
    HStack,
    Skeleton,
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack,
    Text,
} from '@chakra-ui/react';
import TokenAvatar from '~/components/token/TokenAvatar';
import { BoxProps } from '@chakra-ui/layout';
import { useWithdrawState } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { useGetTokens } from '~/lib/global/useToken';
import { usePoolExitGetProportionalWithdrawEstimate } from '~/modules/pool/withdraw/lib/usePoolExitGetProportionalWithdrawEstimate';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { BeetsBox } from '~/components/box/BeetsBox';
import { TokenSelectInline } from '~/components/token-select-inline/TokenSelectInline';
import { PoolWithdrawSummary } from '~/modules/pool/withdraw/components/PoolWithdrawSummary';
import { useEffectOnce } from '~/lib/util/custom-hooks';
import { CardRow } from '~/components/card/CardRow';
import { PoolWithdrawSettings } from '~/modules/pool/withdraw/components/PoolWithdrawSettings';
import { useWithdraw } from '~/modules/pool/withdraw/lib/useWithdraw';
import { usePool } from '~/modules/pool/lib/usePool';

interface Props extends BoxProps {
    onShowPreview: () => void;
}

export function PoolWithdrawProportional({ onShowPreview, ...rest }: Props) {
    const { pool } = usePool();
    const {
        setProportionalPercent,
        proportionalPercent,
        setSelectedOption,
        selectedOptions,
        setProportionalWithdraw,
        setProportionalAmounts,
    } = useWithdrawState();
    const { selectedWithdrawTokenAddresses } = useWithdraw();
    const { formattedPrice } = useGetTokens();

    useEffectOnce(() => {
        setProportionalWithdraw();
    });

    const { data, isLoading } = usePoolExitGetProportionalWithdrawEstimate();
    const proportionalAmounts = data || [];

    const withdrawOptions = pool.withdrawConfig.options;

    return (
        <Box {...rest}>
            <Box mt="4">
                <Text>Drag the slider to configure your withdraw amount.</Text>
                <Slider mt="12" aria-label="slider-ex-1" value={proportionalPercent} onChange={setProportionalPercent}>
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb boxSize={4} />
                    <SliderMark
                        value={proportionalPercent}
                        textAlign="center"
                        bg="beets.base.500"
                        color="white"
                        mt="-10"
                        ml="-30px"
                        w="12"
                        fontSize="md"
                        width="60px"
                        borderRadius="md"
                    >
                        {proportionalPercent}%
                    </SliderMark>
                </Slider>
            </Box>
            <BeetsBox mt="4" p="2">
                {withdrawOptions.map((option, index) => {
                    const tokenOption =
                        option.tokenOptions.find((tokenOption) =>
                            selectedWithdrawTokenAddresses.includes(tokenOption.address),
                        ) || option.tokenOptions[0];
                    const last = index === withdrawOptions.length - 1;
                    const proportionalAmount =
                        proportionalAmounts.find((tokenAmount) => tokenAmount.address === tokenOption.address)
                            ?.amount || '0';

                    return (
                        <CardRow key={index} mb={last ? '0' : '1'}>
                            {option.tokenOptions.length > 1 ? (
                                <Box flex="1">
                                    <TokenSelectInline
                                        tokenOptions={option.tokenOptions}
                                        selectedAddress={
                                            selectedOptions[`${option.poolTokenIndex}`] ||
                                            option.tokenOptions[0].address
                                        }
                                        onOptionSelect={(address) => setSelectedOption(option.poolTokenIndex, address)}
                                    />
                                </Box>
                            ) : (
                                <HStack spacing="1.5" flex="1">
                                    <TokenAvatar size="xs" address={tokenOption.address} />
                                    <Text>{tokenOption.symbol}</Text>
                                </HStack>
                            )}
                            <Box display="flex" alignItems="flex-end" flexDirection="column">
                                {isLoading ? (
                                    <>
                                        <Skeleton height="20px" marginBottom="4px" width="64px" />
                                        <Skeleton height="18px" marginBottom="3px" width="44px" />
                                    </>
                                ) : (
                                    <>
                                        <Box textAlign="right">{tokenFormatAmount(proportionalAmount)}</Box>
                                        <Box textAlign="right" fontSize="sm" color="gray.200">
                                            {formattedPrice({
                                                address: tokenOption.address,
                                                amount: proportionalAmount,
                                            })}
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </CardRow>
                    );
                })}
            </BeetsBox>

            <PoolWithdrawSummary mt="6" />
            <PoolWithdrawSettings mt="6" />
            <Button
                variant="primary"
                width="full"
                mt="8"
                onClick={() => {
                    setProportionalAmounts(proportionalAmounts);
                    onShowPreview();
                }}
            >
                Preview
            </Button>
        </Box>
    );
}
