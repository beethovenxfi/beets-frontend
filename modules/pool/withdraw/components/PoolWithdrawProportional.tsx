import {
    Box,
    Flex,
    Heading,
    HStack,
    Skeleton,
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack,
    Text,
} from '@chakra-ui/react';
import numeral from 'numeral';
import TokenAvatar from '~/components/token/TokenAvatar';
import { BoxProps } from '@chakra-ui/layout';
import { useWithdrawState } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { usePool } from '~/modules/pool/lib/usePool';
import { useGetTokens } from '~/lib/global/useToken';
import { usePoolExitGetProportionalWithdrawEstimate } from '~/modules/pool/withdraw/lib/usePoolExitGetProportionalWithdrawEstimate';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { BeetsBox } from '~/components/box/BeetsBox';
import { TokenSelectInline } from '~/components/token-select-inline/TokenSelectInline';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { BeetsBoxLineItem } from '~/components/box/BeetsBoxLineItem';
import { PoolInvestSummary } from '~/modules/pool/invest/components/PoolInvestSummary';
import { PoolInvestSettings } from '~/modules/pool/invest/components/PoolInvestSettings';
import BeetsButton from '~/components/button/Button';
import { PoolWithdrawSettings } from '~/modules/pool/withdraw/components/PoolWithdrawSettings';
import { PoolWithdrawSummary } from '~/modules/pool/withdraw/components/PoolWithdrawSummary';
import { BeetsSkeleton } from '~/components/skeleton/BeetsSkeleton';

interface Props extends BoxProps {
    onShowPreview: () => void;
}

export function PoolWithdrawProportional({ onShowPreview, ...rest }: Props) {
    const { pool } = usePool();
    const { setProportionalPercent, proportionalPercent, setSelectedOption, selectedOptions } = useWithdrawState();
    const { formattedPrice, priceForAmount } = useGetTokens();

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
            <BeetsBox borderRadius="md" mt="4">
                {withdrawOptions.map((option, index) => {
                    const tokenOption = option.tokenOptions[0];
                    const poolToken = pool.tokens[option.poolTokenIndex];
                    const last = index === withdrawOptions.length - 1;
                    const proportionalAmount =
                        proportionalAmounts.find((tokenAmount) => tokenAmount.address === poolToken.address)?.amount ||
                        '0';

                    return (
                        <BeetsBoxLineItem
                            key={index}
                            last={last}
                            pl={option.tokenOptions.length > 1 ? '1.5' : '3'}
                            center={true}
                            leftContent={
                                option.tokenOptions.length > 1 ? (
                                    <Box flex="1">
                                        <TokenSelectInline
                                            tokenOptions={option.tokenOptions}
                                            selectedAddress={
                                                selectedOptions[`${option.poolTokenIndex}`] ||
                                                option.tokenOptions[0].address
                                            }
                                            onOptionSelect={(address) =>
                                                setSelectedOption(option.poolTokenIndex, address)
                                            }
                                        />
                                    </Box>
                                ) : (
                                    <HStack spacing="1.5" flex="1">
                                        <TokenAvatar size="xs" address={tokenOption.address} />
                                        <Text>{tokenOption.symbol}</Text>
                                    </HStack>
                                )
                            }
                            rightContent={
                                <Box display="flex" alignItems="flex-end" flexDirection="column">
                                    {isLoading ? (
                                        <>
                                            <BeetsSkeleton height="20px" marginBottom="4px" width="64px" />
                                            <BeetsSkeleton height="18px" marginBottom="3px" width="44px" />
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
                            }
                        />
                    );
                })}
            </BeetsBox>

            <PoolWithdrawSummary mt="6" />
            <PoolWithdrawSettings mt="8" />
            <BeetsButton isFullWidth mt="8" onClick={onShowPreview}>
                Preview
            </BeetsButton>
        </Box>
    );
}
