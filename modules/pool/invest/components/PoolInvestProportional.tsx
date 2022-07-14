import {
    Box,
    Flex,
    HStack,
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack,
    Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { tokenAmountsGetArrayFromMap, tokenFormatAmount } from '~/lib/services/token/token-util';
import TokenAvatar from '~/components/token/TokenAvatar';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { usePool } from '~/modules/pool/lib/usePool';
import { useGetTokens } from '~/lib/global/useToken';
import BeetsButton from '~/components/button/Button';
import { PoolInvestSettings } from '~/modules/pool/invest/components/PoolInvestSettings';
import { PoolInvestTokenApproval } from '~/modules/pool/invest/components/PoolInvestTokenApproval';
import { ModalSectionHeadline } from '~/components/modal/ModalSectionHeadline';
import { PoolInvestPriceImpactAndYield } from '~/modules/pool/invest/components/PoolInvestPriceImpactAndYield';
import { TokenSelectInline } from '~/components/token-select-inline/TokenSelectInline';
import { BeetsBoxLineItem } from '~/components/box/BeetsBoxLineItem';
import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';
import { usePoolJoinGetProportionalInvestmentAmount } from '~/modules/pool/invest/lib/usePoolJoinGetProportionalInvestmentAmount';
import { oldBnum } from '~/lib/services/pool/lib/old-big-number';
import { mapValues, sumBy } from 'lodash';

export function PoolInvestProportional() {
    const { pool } = usePool();
    const { priceForAmount } = useGetTokens();
    const investOptions = pool.investConfig.options;
    const { setSelectedOption, selectedOptions } = useInvestState();
    const [proportionalPercent, setProportionalPercent] = useState(50);
    const { data } = usePoolJoinGetProportionalInvestmentAmount();

    const scaledProportionalSuggestions = mapValues(data || {}, (val) =>
        oldBnum(val).times(proportionalPercent).div(100).toString(),
    );
    const totalValue = sumBy(tokenAmountsGetArrayFromMap(scaledProportionalSuggestions), priceForAmount);

    return (
        <Box>
            <Flex mt="4" mb="4">
                <Box flex="1" mr="8">
                    <ModalSectionHeadline
                        headline="1. Configure token amounts"
                        description="Drag the slider below to configure your investment amount."
                        mb="0"
                    />
                    <Slider
                        mt="12"
                        aria-label="slider-ex-1"
                        value={proportionalPercent}
                        onChange={setProportionalPercent}
                    >
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
                            const tokenOption = option.tokenOptions[0];
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
                                                <TokenAvatar width="20px" height="20px" address={tokenOption.address} />
                                                <Text>{tokenOption.symbol}</Text>
                                            </HStack>
                                        )
                                    }
                                    rightContent={
                                        <Box>
                                            <Box textAlign="right">{tokenFormatAmount(amount)}</Box>
                                            <Box textAlign="right" fontSize="sm" color="gray.200">
                                                {numberFormatUSDValue(
                                                    priceForAmount({ address: tokenOption.address, amount }),
                                                )}
                                            </Box>
                                        </Box>
                                    }
                                />
                            );
                        })}
                    </BeetsBox>

                    <PoolInvestPriceImpactAndYield
                        mt="4"
                        weeklyYield={(totalValue * parseFloat(pool.dynamicData.apr.total)) / 52}
                    />
                </Box>
                <Box flex="1">
                    <PoolInvestTokenApproval stepNumber={2} />
                    <PoolInvestSettings mt="6" stepNumber={3} />
                </Box>
            </Flex>
            <BeetsButton isFullWidth mt="4" isDisabled={true}>
                Invest {numberFormatUSDValue(totalValue)}
            </BeetsButton>
        </Box>
    );
}
