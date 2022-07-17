import {
    Box,
    BoxProps,
    Flex,
    HStack,
    Input,
    Link,
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack,
    Text,
    useBoolean,
} from '@chakra-ui/react';
import { GqlPoolInvestOption, GqlPoolToken } from '~/apollo/generated/graphql-codegen-generated';
import { useGetTokens } from '~/lib/global/useToken';
import TokenAvatar from '~/components/token/TokenAvatar';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { tokenFormatAmountPrecise, tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import { parseUnits } from 'ethers/lib/utils';
import { tokenInputBlockInvalidCharacters, tokenInputTruncateDecimalPlaces } from '~/lib/util/input-util';
import { oldBnumScale, oldBnumToHumanReadable } from '~/lib/services/pool/lib/old-big-number';
import { BeetsBox } from '~/components/box/BeetsBox';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { TokenSelectInline } from '~/components/token-select-inline/TokenSelectInline';
import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';

interface Props extends BoxProps {
    tokenOption: GqlPoolToken;
    userBalances: TokenAmountHumanReadable[];
    option: GqlPoolInvestOption;
    setInputAmount: (address: string, amount: AmountHumanReadable) => void;
    value?: string;
    proportionalAmount?: string;
}

export function PoolInvestCustomTokenInput({
    userBalances,
    option,
    setInputAmount,
    value,
    proportionalAmount,
    tokenOption,
    ...rest
}: Props) {
    const { setSelectedOption, selectedOptions } = useInvestState();
    const { priceForAmount } = useGetTokens();
    const userBalance = tokenGetAmountForAddress(tokenOption.address, userBalances);
    const userHasBalance = parseFloat(userBalance) > 0;
    const isValid =
        !value || parseUnits(value, tokenOption.decimals).lte(parseUnits(userBalance, tokenOption.decimals));

    const [changing, setIsChanging] = useBoolean(false);
    const sliderValue = Math.round(userHasBalance ? (parseFloat(value || '0') / parseFloat(userBalance)) * 100 : 0);

    return (
        <BeetsBox borderRadius="md" width="full" px="2" pt="2" pb="1" {...rest}>
            <Flex>
                {option.tokenOptions.length > 1 ? (
                    <Box flex="1">
                        <TokenSelectInline
                            tokenOptions={option.tokenOptions}
                            selectedAddress={
                                selectedOptions[`${option.poolTokenIndex}`] || option.tokenOptions[0].address
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

                <Box flex="1">
                    <Input
                        type="number"
                        min={0}
                        placeholder={proportionalAmount ? proportionalAmount.slice(0, 18) : '0'}
                        textAlign="right"
                        value={value || ''}
                        onChange={(e) => {
                            const newValue = tokenInputTruncateDecimalPlaces(
                                e.currentTarget.value,
                                tokenOption.decimals,
                            );

                            setInputAmount(option.poolTokenAddress, newValue);
                        }}
                        isInvalid={!isValid}
                        _hover={{ borderColor: 'gray.200' }}
                        _focus={{ outline: 'none' }}
                        _placeholder={{ color: 'gray.400' }}
                        color="gray.100"
                        borderColor="transparent"
                        border="2px"
                        bgColor="transparent"
                        fontWeight="semibold"
                        onKeyDown={tokenInputBlockInvalidCharacters}
                        width="full"
                        pr="1"
                    />
                </Box>
            </Flex>
            <Box mx="1" mt="2">
                <Slider
                    focusThumbOnChange={false}
                    onChangeStart={() => setIsChanging.on()}
                    onChangeEnd={() => setIsChanging.off()}
                    aria-label={`slider-${tokenOption.symbol}`}
                    defaultValue={0}
                    value={sliderValue > 100 ? 0 : sliderValue}
                    isDisabled={!userHasBalance}
                    onChange={(value) => {
                        if (value === 100) {
                            setInputAmount(option.poolTokenAddress, userBalance);
                        } else {
                            setInputAmount(
                                option.poolTokenAddress,
                                oldBnumToHumanReadable(
                                    oldBnumScale(userBalance, tokenOption.decimals).times(value / 100),
                                    tokenOption.decimals,
                                ),
                            );
                        }
                    }}
                >
                    <SliderTrack bg="gray.400">
                        <SliderFilledTrack bg="beets.base.200" />
                    </SliderTrack>
                    <SliderThumb boxSize={3} boxShadow="xl" />
                    {changing ? (
                        <SliderMark
                            value={sliderValue}
                            textAlign="center"
                            bg="beets.base.500"
                            color="white"
                            mt="3"
                            ml="-20px"
                            w="12"
                            fontSize="xs"
                            width="40px"
                            borderRadius="md"
                        >
                            {sliderValue}%
                        </SliderMark>
                    ) : null}
                </Slider>
            </Box>
            <Flex ml="1" alignItems="center">
                <Box flex="1" height="18px">
                    {!changing && (
                        <Link
                            color="gray.100"
                            fontSize="xs"
                            display="flex"
                            onClick={() => {
                                if (userHasBalance) {
                                    setInputAmount(option.poolTokenAddress, userBalance);
                                }
                            }}
                            _hover={{ textDecoration: 'none' }}
                            cursor={userHasBalance ? 'pointer' : 'default'}
                        >
                            Balance: {tokenFormatAmountPrecise(userBalance, 4)}
                            {userHasBalance ? (
                                <Text color="beets.cyan" ml="1">
                                    Max
                                </Text>
                            ) : null}
                        </Link>
                    )}
                </Box>
                <Box height="18px">
                    {!changing && (
                        <Text color="gray.100" fontSize="xs">
                            {numberFormatUSDValue(
                                priceForAmount({ address: tokenOption.address, amount: value || '0' }),
                            )}
                        </Text>
                    )}
                </Box>
            </Flex>
        </BeetsBox>
    );
}
