import {
    Box,
    Button,
    HStack,
    Link,
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
import {
    isEth,
    isWeth,
    replaceEthWithWeth,
    replaceWethWithEth,
    tokenFormatAmount,
    tokenFormatAmountPrecise,
    tokenGetAmountForAddress,
} from '~/lib/services/token/token-util';
import { PoolInvestSettings } from '~/modules/pool/invest/components/PoolInvestSettings';
import { BeetsBox } from '~/components/box/BeetsBox';
import { TokenSelectInline } from '~/components/token-select-inline/TokenSelectInline';
import TokenAvatar from '~/components/token/TokenAvatar';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { PoolInvestSummary } from '~/modules/pool/invest/components/PoolInvestSummary';
import { useGetTokens } from '~/lib/global/useToken';
import React, { useEffect, useMemo, useState } from 'react';
import { usePoolJoinGetProportionalInvestmentAmount } from '~/modules/pool/invest/lib/usePoolJoinGetProportionalInvestmentAmount';
import { mapValues, pick } from 'lodash';
import { oldBnum } from '~/lib/services/pool/lib/old-big-number';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { CardRow } from '~/components/card/CardRow';
import { useHasBatchRelayerApproval } from '~/lib/util/useHasBatchRelayerApproval';
import { usePool } from '~/modules/pool/lib/usePool';
import { ExternalLink } from 'react-feather';
import TokenRow from '~/components/token/TokenRow';
import { usePoolJoinGetBptOutAndPriceImpactForTokensIn } from '../lib/usePoolJoinGetBptOutAndPriceImpactForTokensIn';
import { useUserTokenBalances } from '~/lib/user/useUserTokenBalances';
import { usePoolUserTokenBalancesInWallet } from '../../lib/usePoolUserTokenBalancesInWallet';
import { bnum } from '@balancer-labs/sor';

interface Props {
    onShowPreview(): void;
}

export function PoolInvestProportional({ onShowPreview }: Props) {
    const { pool, poolService, requiresBatchRelayerOnJoin } = usePool();
    const { priceForAmount, getToken } = useGetTokens();
    const investOptions = pool.investConfig.options;
    const { setSelectedOption, selectedOptions, setInputAmounts, zapEnabled, inputAmounts } = useInvestState();
    const [proportionalPercent, setProportionalPercent] = useState(25);
    const { data } = usePoolJoinGetProportionalInvestmentAmount();
    const { selectedInvestTokens, userInvestTokenBalances } = useInvest();
    const { data: hasBatchRelayerApproval } = useHasBatchRelayerApproval();
    const { formattedPriceImpact, hasHighPriceImpact, hasMediumPriceImpact, isLoading } =
        usePoolJoinGetBptOutAndPriceImpactForTokensIn();
    const { userPoolTokenBalances } = usePoolUserTokenBalancesInWallet();

    const [scaledProportionalSuggestions, setScaledProportionalSuggestions] = useState(inputAmounts);

    useEffect(() => {
        setInputAmounts(scaledProportionalSuggestions);
    }, [JSON.stringify(scaledProportionalSuggestions)]);

    useEffect(() => {
        setScaledProportionalSuggestions(
            mapValues(data || {}, (val, address) =>
                oldBnum(val)
                    .times(proportionalPercent)
                    .div(100)
                    .toFixed(getToken(address)?.decimals || 18)
                    .toString(),
            ),
        );
    }, [proportionalPercent]);

    useEffect(() => {
        setScaledProportionalSuggestions(
            mapValues(data || {}, (val, address) =>
                oldBnum(val)
                    .times(proportionalPercent)
                    .div(100)
                    .toFixed(getToken(address)?.decimals || 18)
                    .toString(),
            ),
        );
    }, []);

    const onTokenAmountChange = (tokenAddress: string) => async (amount: string) => {
        if (!amount) {
            setScaledProportionalSuggestions({
                ...scaledProportionalSuggestions,
                [tokenAddress]: '',
            });
            return;
        }
        if (poolService.joinGetProportionalSuggestionForFixedAmount) {
            const scaledAmounts = await poolService.joinGetProportionalSuggestionForFixedAmount(
                {
                    address: replaceEthWithWeth(tokenAddress),
                    amount,
                },
                [replaceEthWithWeth(tokenAddress)],
            );
            const newInputs: Record<string, string> = {};
            for (const scaledAmount of scaledAmounts) {
                let address = scaledAmount.address;
                if (isEth(tokenAddress) && isWeth(scaledAmount.address)) {
                    address = tokenAddress;
                }
                newInputs[address] = scaledAmount.amount;
            }
            setScaledProportionalSuggestions(newInputs);
            setInputAmounts(newInputs);
        }
    };

    const exceedsTokenBalances = userInvestTokenBalances.some((tokenBalance) => {
        if (!scaledProportionalSuggestions[tokenBalance.address] || !tokenBalance.amount) return false;
        return bnum(scaledProportionalSuggestions[tokenBalance.address]).gt(tokenBalance.amount);
    });

    return (
        <Box>
            <VStack p="4" spacing="4">
                <PoolInvestSummary />
                <BeetsBox py="2" px="4">
                    <Slider
                        mt="8"
                        aria-label="slider-ex-1"
                        value={proportionalPercent}
                        onChange={setProportionalPercent}
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
                                    onAmountChange={onTokenAmountChange(tokenOption.address)}
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
                    isDisabled={
                        exceedsTokenBalances ||
                        proportionalPercent === 0 ||
                        (!hasBatchRelayerApproval && (zapEnabled || requiresBatchRelayerOnJoin))
                    }
                >
                    Preview
                </Button>
            </VStack>
            <VStack width="full" py="4" backgroundColor="blackAlpha.500" px="5">
                <HStack width="full" justifyContent="space-between">
                    <Text color="gray.100" fontSize=".85rem">
                        Price impact
                    </Text>
                    <Text
                        fontSize=".85rem"
                        color={hasHighPriceImpact ? 'beets.red' : hasMediumPriceImpact ? 'orange' : 'white'}
                    >
                        {formattedPriceImpact}
                    </Text>
                </HStack>
            </VStack>
        </Box>
    );
}
