import { Box, HStack, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Text } from '@chakra-ui/react';
import BeetsButton from '~/components/button/Button';
import { usePool } from '~/modules/pool/lib/usePool';
import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { PoolInvestSettings } from '~/modules/pool/invest/components/PoolInvestSettings';
import { BeetsBox } from '~/components/box/BeetsBox';
import { BeetsBoxLineItem } from '~/components/box/BeetsBoxLineItem';
import { TokenSelectInline } from '~/components/token-select-inline/TokenSelectInline';
import TokenAvatar from '~/components/token/TokenAvatar';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { PoolInvestSummary } from '~/modules/pool/invest/components/PoolInvestSummary';
import { useGetTokens } from '~/lib/global/useToken';
import { useEffect, useState } from 'react';
import { usePoolJoinGetProportionalInvestmentAmount } from '~/modules/pool/invest/lib/usePoolJoinGetProportionalInvestmentAmount';
import { mapValues } from 'lodash';
import { oldBnum } from '~/lib/services/pool/lib/old-big-number';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';

interface Props {
    onShowPreview(): void;
}

export default function PoolInvestProportional({ onShowPreview }: Props) {
    const { pool } = usePool();
    const { priceForAmount, getToken } = useGetTokens();
    const investOptions = pool.investConfig.options;
    const { setSelectedOption, selectedOptions, setInputAmounts } = useInvestState();
    const [proportionalPercent, setProportionalPercent] = useState(25);
    const { data } = usePoolJoinGetProportionalInvestmentAmount();
    const { selectedInvestTokens } = useInvest();

    const scaledProportionalSuggestions = mapValues(data || {}, (val, address) =>
        oldBnum(val)
            .times(proportionalPercent)
            .div(100)
            .toFixed(getToken(address)?.decimals || 18)
            .toString(),
    );

    useEffect(() => {
        setInputAmounts(scaledProportionalSuggestions);
    }, [JSON.stringify(scaledProportionalSuggestions)]);

    return (
        <Box mt="4">
            <Text>Drag the slider to configure your investment amount.</Text>
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
            <BeetsBox mt="4" pt="0.5">
                {investOptions.map((option, index) => {
                    const tokenOption = selectedInvestTokens[index];
                    const amount = scaledProportionalSuggestions[tokenOption.address];

                    return (
                        <BeetsBoxLineItem
                            key={tokenOption.address}
                            last={index === investOptions.length - 1}
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
                                <Box>
                                    <Box textAlign="right">{tokenFormatAmount(amount)}</Box>
                                    <Box textAlign="right" fontSize="sm" color="gray.200">
                                        {numberFormatUSDValue(
                                            priceForAmount({
                                                address: tokenOption.address,
                                                amount,
                                            }),
                                        )}
                                    </Box>
                                </Box>
                            }
                        />
                    );
                })}
            </BeetsBox>

            <PoolInvestSummary mt="6" />
            <PoolInvestSettings mt="8" />
            <BeetsButton isFullWidth mt="8" onClick={onShowPreview}>
                Preview
            </BeetsButton>
        </Box>
    );
}
