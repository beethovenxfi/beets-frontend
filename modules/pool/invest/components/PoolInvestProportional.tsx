import {
    Box,
    Button,
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack,
    StackDivider,
    Text,
    VStack,
} from '@chakra-ui/react';

import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';
import { replaceEthWithWeth, replaceWethWithEth, tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import { PoolInvestSettings } from '~/modules/pool/invest/components/PoolInvestSettings';
import { BeetsBox } from '~/components/box/BeetsBox';
import { PoolInvestSummary } from '~/modules/pool/invest/components/PoolInvestSummary';
import React from 'react';
import { usePoolJoinGetProportionalInvestmentAmount } from '~/modules/pool/invest/lib/usePoolJoinGetProportionalInvestmentAmount';
import { keyBy, mapValues } from 'lodash';
import { oldBnumScale, oldBnumToHumanReadable } from '~/lib/services/pool/lib/old-big-number';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { usePool } from '~/modules/pool/lib/usePool';
import TokenRow from '~/components/token/TokenRow';
import { usePoolUserTokenBalancesInWallet } from '../../lib/usePoolUserTokenBalancesInWallet';
import { bnum } from '@balancer-labs/sor';
import { GqlPoolToken } from '~/apollo/generated/graphql-codegen-generated';
import { tokenInputTruncateDecimalPlaces } from '~/lib/util/input-util';
import { PoolInvestPriceImpact } from '~/modules/pool/invest/components/PoolInvestPriceImpact';

interface Props {
    onShowPreview(): void;
}

export function PoolInvestProportional({ onShowPreview }: Props) {
    const { pool, poolService } = usePool();
    const investOptions = pool.investConfig.options;
    const { setSelectedOption, selectedOptions, setInputAmounts, inputAmounts } = useInvestState();
    const { data } = usePoolJoinGetProportionalInvestmentAmount();
    const { selectedInvestTokens, userInvestTokenBalances, isInvestingWithEth } = useInvest();

    const { userPoolTokenBalances } = usePoolUserTokenBalancesInWallet();

    async function onTokenAmountChange(token: GqlPoolToken, amount: string) {
        if (!amount) {
            setInputAmounts({});
            return;
        }

        if (poolService.joinGetProportionalSuggestionForFixedAmount) {
            const scaledAmounts = await poolService.joinGetProportionalSuggestionForFixedAmount(
                {
                    address: replaceEthWithWeth(token.address),
                    amount: tokenInputTruncateDecimalPlaces(amount, token.decimals),
                },
                [replaceEthWithWeth(token.address)],
            );

            setInputAmounts(
                mapValues(
                    keyBy(scaledAmounts, (amount) =>
                        isInvestingWithEth ? replaceWethWithEth(amount.address) : amount.address,
                    ),
                    (amount) => amount.amount,
                ),
            );
        }
    }

    const exceedsTokenBalances = userInvestTokenBalances.some((tokenBalance) => {
        if (!inputAmounts[tokenBalance.address] || !tokenBalance.amount) return false;
        return bnum(inputAmounts[tokenBalance.address]).gt(tokenBalance.amount);
    });

    const firstToken = selectedInvestTokens[0];
    const proportionalPercent =
        !exceedsTokenBalances && data && data[firstToken.address] && inputAmounts[firstToken.address]
            ? Math.round((parseFloat(inputAmounts[firstToken.address]) / parseFloat(data[firstToken.address])) * 100)
            : 0;

    return (
        <Box>
            <VStack p="4" spacing="4">
                <PoolInvestSummary />
                <BeetsBox py="2" px="4">
                    <Slider
                        mt="8"
                        focusThumbOnChange={false}
                        value={proportionalPercent}
                        onChange={(value) => {
                            if (value === 100) {
                                setInputAmounts(data || {});
                            } else if (value === 0) {
                                setInputAmounts({});
                            } else {
                                const inputAmounts = mapValues(data || {}, (maxAmount, address) => {
                                    const tokenDecimals =
                                        selectedInvestTokens.find((token) => token.address === address)?.decimals || 18;

                                    return oldBnumToHumanReadable(
                                        oldBnumScale(maxAmount, tokenDecimals).times(value / 100),
                                        tokenDecimals,
                                    );
                                });

                                setInputAmounts(inputAmounts);
                            }
                        }}
                    >
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb boxSize={6} />
                        <SliderMark
                            value={proportionalPercent}
                            textAlign="center"
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
                    <Text>
                        Drag the slider to configure your investment amount or you can customize the amount for a single
                        token below.
                    </Text>
                </BeetsBox>
                <BeetsBox mt="4" p="2" width="full">
                    <VStack width="full" divider={<StackDivider borderColor="whiteAlpha.200" />}>
                        {investOptions.map((option, index) => {
                            const tokenOption = selectedInvestTokens[index];
                            const amount = inputAmounts[tokenOption.address];
                            return (
                                <TokenRow
                                    withInput
                                    onAmountChange={(amount) => onTokenAmountChange(tokenOption, amount)}
                                    key={tokenOption.address}
                                    alternateTokens={option.tokenOptions}
                                    address={tokenOption.address}
                                    selectedAlternateToken={
                                        selectedOptions[`${option.poolTokenIndex}`] || option.tokenOptions[0].address
                                    }
                                    onSelectedAlternateToken={(address) =>
                                        setSelectedOption(option.poolTokenIndex, address)
                                    }
                                    amount={amount}
                                    balance={tokenGetAmountForAddress(tokenOption.address, userPoolTokenBalances)}
                                />
                            );
                        })}
                    </VStack>
                </BeetsBox>

                <PoolInvestSettings mt="8" />
                <Button
                    variant="primary"
                    width="full"
                    mt="8"
                    onClick={onShowPreview}
                    isDisabled={exceedsTokenBalances || proportionalPercent === 0}
                >
                    Preview
                </Button>
            </VStack>
            <PoolInvestPriceImpact />
        </Box>
    );
}
