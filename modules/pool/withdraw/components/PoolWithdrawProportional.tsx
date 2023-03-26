import {
    Box,
    Button,
    Heading,
    HStack,
    Skeleton,
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack,
    StackDivider,
    Text,
    VStack,
} from '@chakra-ui/react';
import TokenAvatar from '~/components/token/TokenAvatar';
import { BoxProps } from '@chakra-ui/layout';
import { useWithdrawState } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { useGetTokens } from '~/lib/global/useToken';
import { usePoolExitGetProportionalWithdrawEstimate } from '~/modules/pool/withdraw/lib/usePoolExitGetProportionalWithdrawEstimate';
import { replaceEthWithWeth, tokenFormatAmount, tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import { BeetsBox } from '~/components/box/BeetsBox';
import { TokenSelectInline } from '~/components/token-select-inline/TokenSelectInline';
import { PoolWithdrawSummary } from '~/modules/pool/withdraw/components/PoolWithdrawSummary';
import { useEffectOnce } from '~/lib/util/custom-hooks';
import { CardRow } from '~/components/card/CardRow';
import { PoolWithdrawSettings } from '~/modules/pool/withdraw/components/PoolWithdrawSettings';
import { useWithdraw } from '~/modules/pool/withdraw/lib/useWithdraw';
import { usePool } from '~/modules/pool/lib/usePool';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import TokenRow from '~/components/token/TokenRow';
import { usePoolUserTokenBalancesInWallet } from '../../lib/usePoolUserTokenBalancesInWallet';
import { GqlPoolToken } from '~/apollo/generated/graphql-codegen-generated';
import { tokenInputTruncateDecimalPlaces } from '~/lib/util/input-util';
import { sumBy } from 'lodash';

interface Props extends BoxProps {
    onShowPreview: () => void;
}

export function PoolWithdrawProportional({ onShowPreview, ...rest }: Props) {
    const { pool, poolService } = usePool();
    const { priceForAmount } = useGetTokens();
    const {
        setProportionalPercent,
        proportionalPercent,
        setSelectedOption,
        selectedOptions,
        setProportionalWithdraw,
        setProportionalAmounts,
    } = useWithdrawState();
    const { selectedWithdrawTokenAddresses } = useWithdraw();
    const {} = useWithdrawState();
    const { userPoolTokenBalances } = usePoolUserTokenBalancesInWallet();

    const { formattedPrice } = useGetTokens();
    const { data, isLoading } = usePoolExitGetProportionalWithdrawEstimate();
    const proportionalAmounts = data || [];
    const totalWithdrawValue = sumBy(data, priceForAmount);

    useEffectOnce(() => {
        setProportionalWithdraw();
    });

    async function onTokenAmountChange(token: GqlPoolToken, amount: string) {
        if (!amount) {
            setProportionalAmounts([]);
            return;
        }

        // if (poolService.joinGetProportionalSuggestionForFixedAmount) {
        //     const scaledAmounts = await poolService.joinGetProportionalSuggestionForFixedAmount(
        //         {
        //             address: replaceEthWithWeth(token.address),
        //             amount: tokenInputTruncateDecimalPlaces(amount, token.decimals),
        //         },
        //         [replaceEthWithWeth(token.address)],
        //     );

        //     setProportionalAmounts(
        //         mapValues(
        //             keyBy(scaledAmounts, (amount) =>
        //                 isInvestingWithEth ? replaceWethWithEth(amount.address) : amount.address,
        //             ),
        //             (amount) => amount.amount,
        //         ),
        //     );
        // }
    }

    const withdrawOptions = pool.withdrawConfig.options;

    return (
        <Box {...rest}>
            <Box p="4">
                <VStack spacing="4" width="full" p="4" rounded="md">
                    <HStack spacing="8">
                        <Box>
                            <Heading size="sm" textAlign="center">
                                Your withdrawal amount is
                            </Heading>
                            <Heading color="beets.green" textAlign="center">
                                {numberFormatUSDValue(totalWithdrawValue)}
                            </Heading>
                        </Box>
                    </HStack>
                </VStack>
                <BeetsBox py="2" px="4">
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
                    <Text>
                        Drag the slider to configure your withdrawal amount or you can customize the amount for a single
                        token below.
                    </Text>
                </BeetsBox>
                <BeetsBox mt="4" p="2" width="full">
                    <VStack width="full" divider={<StackDivider borderColor="whiteAlpha.200" />}>
                        {withdrawOptions.map((option, index) => {
                            const tokenOption =
                                option.tokenOptions.find((tokenOption) =>
                                    selectedWithdrawTokenAddresses.includes(tokenOption.address),
                                ) || option.tokenOptions[0];
                            const proportionalAmount =
                                proportionalAmounts.find((tokenAmount) => tokenAmount.address === tokenOption.address)
                                    ?.amount || '0';
                            return (
                                <TokenRow
                                    withInput
                                    onAmountChange={(amount) => false}
                                    // onAmountChange={(amount) => onTokenAmountChange(tokenOption, amount)}
                                    key={tokenOption.address}
                                    alternateTokens={option.tokenOptions}
                                    address={tokenOption.address}
                                    selectedAlternateToken={
                                        selectedOptions[`${option.poolTokenIndex}`] || option.tokenOptions[0].address
                                    }
                                    onSelectedAlternateToken={(address) =>
                                        setSelectedOption(option.poolTokenIndex, address)
                                    }
                                    amount={proportionalAmount}
                                    balance={tokenGetAmountForAddress(tokenOption.address, userPoolTokenBalances)}
                                />
                            );
                        })}
                    </VStack>
                </BeetsBox>
            </Box>

            <VStack spacing="4" px="4" mb="4">
                <PoolWithdrawSettings />
                <Button
                    variant="primary"
                    width="full"
                    onClick={() => {
                        setProportionalAmounts(proportionalAmounts);
                        onShowPreview();
                    }}
                >
                    Preview
                </Button>
            </VStack>
            <VStack width="full" py="4" backgroundColor="blackAlpha.500" px="5">
                <HStack width="full" justifyContent="space-between" fontSize=".85rem">
                    <Text color="gray.100">Price impact</Text>
                    <Box>0.00%</Box>
                </HStack>
            </VStack>
        </Box>
    );
}
