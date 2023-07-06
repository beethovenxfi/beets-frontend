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
    VStack,
} from '@chakra-ui/react';
import { GqlPoolToken } from '~/apollo/generated/graphql-codegen-generated';
import { useGetTokens } from '~/lib/global/useToken';
import TokenAvatar from '~/components/token/TokenAvatar';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { parseUnits } from 'ethers/lib/utils';
import { tokenInputBlockInvalidCharacters, tokenInputTruncateDecimalPlaces } from '~/lib/util/input-util';
import { oldBnumScale, oldBnumToHumanReadable } from '~/lib/services/pool/lib/old-big-number';
import { BeetsBox } from '~/components/box/BeetsBox';
import { TokenSelectInline } from '~/components/token-select-inline/TokenSelectInline';
import { networkConfig } from '~/lib/config/network-config';
import { formatFixed } from '@ethersproject/bignumber';

interface Props extends BoxProps {
    tokenOptions: GqlPoolToken[];
    selectedTokenOption: GqlPoolToken;
    balance: AmountHumanReadable;
    setInputAmount: (amount: AmountHumanReadable) => void;
    value?: string;
    proportionalAmount?: string;
    isWithdraw?: boolean;
    setSelectedTokenOption: (address: string) => void;
}

export function BeetsTokenInputWithSlider({
    balance,
    tokenOptions,
    selectedTokenOption,
    setInputAmount,
    value,
    proportionalAmount,
    setSelectedTokenOption,
    isWithdraw,
    ...rest
}: Props) {
    const { formattedPrice } = useGetTokens();
    const hasBalance = parseFloat(balance) > 0;
    const isValid =
        !value ||
        parseUnits(value, selectedTokenOption.decimals).lte(parseUnits(balance, selectedTokenOption.decimals));
    const [changing, setIsChanging] = useBoolean(false);
    const sliderValue = Math.round(hasBalance ? (parseFloat(value || '0') / parseFloat(balance)) * 100 : 0);
    const isEth = selectedTokenOption.address === networkConfig.eth.address.toLowerCase();
    const [warning, setWarning] = useBoolean(false);
    const maxTokenAmount = isEth
        ? formatFixed(
              parseUnits(balance, selectedTokenOption.decimals)
                  .sub(parseUnits(networkConfig.eth.minGasAmount, selectedTokenOption.decimals))
                  .toString(),
              selectedTokenOption.decimals,
          )
        : balance;

    return (
        <BeetsBox borderRadius="md" width="full" px="2" pt="2" pb="1" {...rest}>
            <Flex>
                {tokenOptions.length > 1 ? (
                    <Box flex="1">
                        <TokenSelectInline
                            tokenOptions={tokenOptions}
                            selectedAddress={selectedTokenOption.address}
                            onOptionSelect={(address) => setSelectedTokenOption(address)}
                            isWithdraw={isWithdraw}
                        />
                    </Box>
                ) : (
                    <HStack spacing="2" flex="1">
                        <TokenAvatar width="40px" height="40px" address={selectedTokenOption.address} />
                        <VStack spacing="0" alignItems="flex-start">
                            <Text fontWeight="normal">{selectedTokenOption?.name}</Text>
                            <HStack spacing="1">
                                <Text fontWeight="bold">{selectedTokenOption?.symbol}</Text>
                            </HStack>
                        </VStack>
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
                            let inputAmount = '';
                            if (isEth && parseFloat(e.currentTarget.value) > parseFloat(maxTokenAmount)) {
                                inputAmount = maxTokenAmount;
                                setWarning.on();
                            } else {
                                inputAmount = e.currentTarget.value;
                                setWarning.off();
                            }
                            const newValue = tokenInputTruncateDecimalPlaces(inputAmount, selectedTokenOption.decimals);
                            setInputAmount(newValue);
                        }}
                        isInvalid={!isValid}
                        _hover={{ borderColor: 'gray.200' }}
                        _focus={{ outline: 'none' }}
                        _placeholder={{ color: 'gray.400' }}
                        color="gray.100"
                        borderColor="transparent"
                        border="2px"
                        bgColor="blackAlpha.400"
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
                    aria-label={`slider-${selectedTokenOption.symbol}`}
                    defaultValue={0}
                    value={sliderValue > 100 ? 0 : sliderValue}
                    isDisabled={!hasBalance}
                    onChange={(value) => {
                        const amount = oldBnumToHumanReadable(
                            oldBnumScale(balance, selectedTokenOption.decimals).times(value / 100),
                            selectedTokenOption.decimals,
                        );
                        if (isEth && parseFloat(amount) > parseFloat(maxTokenAmount)) {
                            setInputAmount(maxTokenAmount);
                            setWarning.on();
                        } else {
                            setInputAmount(amount);
                            setWarning.off();
                        }
                    }}
                >
                    <SliderTrack bg="gray.400">
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb boxSize={3} boxShadow="xl" />
                    {changing ? (
                        <SliderMark
                            value={sliderValue}
                            textAlign="center"
                            //bg="beets.base.500"
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
            <Flex ml="1" alignItems="center" mb="1">
                <Box flex="1" height="18px">
                    {!changing && (
                        <Link
                            color="gray.200"
                            fontSize="sm"
                            display="flex"
                            onClick={() => {
                                if (hasBalance) {
                                    setInputAmount(maxTokenAmount);
                                    setWarning.on();
                                }
                            }}
                            _hover={{ textDecoration: 'none' }}
                            cursor={hasBalance ? 'pointer' : 'default'}
                        >
                            You have {tokenFormatAmount(balance)}
                            {hasBalance ? (
                                <Text color="beets.highlight" ml="1">
                                    Max
                                </Text>
                            ) : null}
                        </Link>
                    )}
                </Box>
                <Box height="18px">
                    {!changing && (
                        <Text color="gray.200" fontSize="sm">
                            {formattedPrice({ address: selectedTokenOption.address, amount: value || '0' })}
                        </Text>
                    )}
                </Box>
            </Flex>
            {isEth && warning && (
                <Text fontSize="sm" color="orange">
                    {`To ensure a smooth transaction, at least ${networkConfig.eth.minGasAmount} ${selectedTokenOption.symbol}
                    must be left in your wallet to pay for native fees.`}
                </Text>
            )}
        </BeetsBox>
    );
}
