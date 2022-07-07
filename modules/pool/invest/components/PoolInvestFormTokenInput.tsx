import {
    Box,
    BoxProps,
    Button,
    Container,
    ContainerProps,
    Flex,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    Link,
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack,
    Text,
    useBoolean,
} from '@chakra-ui/react';
import { GqlPoolInvestOption } from '~/apollo/generated/graphql-codegen-generated';
import { useGetTokens } from '~/lib/global/useToken';
import TokenAvatar from '~/components/token/TokenAvatar';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { tokenFormatAmountPrecise, tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import { parseUnits } from 'ethers/lib/utils';
import { ChevronDown } from 'react-feather';
import { tokenInputBlockInvalidCharacters, tokenInputTruncateDecimalPlaces } from '~/lib/util/input-util';
import { IconWallet } from '~/components/icons/IconWallet';
import { oldBnum, oldBnumScale, oldBnumToHumanReadable } from '~/lib/services/pool/lib/old-big-number';
import { parseFixed } from '@ethersproject/bignumber';
import { useState } from 'react';

interface Props extends BoxProps {
    userBalances: TokenAmountHumanReadable[];
    option: GqlPoolInvestOption;
    setInputAmount: (address: string, amount: AmountHumanReadable) => void;
    value?: string;
    proportionalAmount?: string;
}

export function PoolInvestFormTokenInput({
    userBalances,
    option,
    setInputAmount,
    value,
    proportionalAmount,
    ...rest
}: Props) {
    const { priceFor } = useGetTokens();

    //TODO: add support for multiple options
    const tokenOption = option.tokenOptions[0];
    const userBalance = tokenGetAmountForAddress(tokenOption.address, userBalances);
    const isValid =
        !value || parseUnits(value, tokenOption.decimals).lte(parseUnits(userBalance, tokenOption.decimals));

    const [sliderValue, setSliderValue] = useState(50);
    const [changing, setIsChanging] = useBoolean(false);
    const labelStyles = {
        mt: '2',
        ml: '-2.5',
        fontSize: 'xs',
    };

    return (
        <Box bg="blackAlpha.500" borderRadius="md" width="full" px="2" pt="2" pb="1" {...rest}>
            {/*<Button
                height="fit-content"
                paddingY="1"
                onClick={() => {}}
                backgroundColor="transparent"
                _hover={{ backgroundColor: 'beets.green', color: 'gray.500' }}
                paddingX="1"
            >
                <HStack spacing="none">
                    <TokenAvatar size="xs" address={tokenOption.address} />
                    <Text paddingLeft="1.5">{tokenOption.symbol}</Text>
                    <Box marginLeft="1">
                        <ChevronDown size={16} />
                    </Box>
                </HStack>
            </Button>*/}
            <Flex>
                <HStack spacing="none" ml="0" flex="1">
                    <TokenAvatar size="xs" address={tokenOption.address} />
                    <Text paddingLeft="1.5" fontSize="lg">
                        {tokenOption.symbol}
                    </Text>
                </HStack>
                <Box flex="1">
                    <Input
                        type="number"
                        min={0}
                        placeholder={proportionalAmount ? proportionalAmount.slice(0, 18) : '0'}
                        textAlign="right"
                        //size="lg"
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
                    onChangeStart={() => setIsChanging.on()}
                    onChangeEnd={() => setIsChanging.off()}
                    aria-label={`slider-${tokenOption.symbol}`}
                    defaultValue={0}
                    value={sliderValue}
                    onChange={(value) => {
                        setSliderValue(value);

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
                    {/*<SliderMark value={0} {...labelStyles}>
                        25%
                    </SliderMark>
                    <SliderMark value={50} {...labelStyles}>
                        50%
                    </SliderMark>
                    <SliderMark value={75} {...labelStyles}>
                        75%
                    </SliderMark>*/}
                </Slider>
            </Box>
            <Flex ml="1" alignItems="center">
                <Box flex="1" height="18px">
                    {!changing && (
                        <Text color="gray.200" fontSize="xs">
                            Balance: {tokenFormatAmountPrecise(userBalance, 4)}
                        </Text>
                    )}
                </Box>
            </Flex>
            {/*!value && proportionalAmount ? (
                    <Box>
                        <Link
                            fontSize="xs"
                            color="green.300"
                            userSelect="none"
                            onClick={() => {
                                setInputAmount(option.poolTokenAddress, proportionalAmount);
                            }}
                        >
                            Proportional suggestion
                        </Link>
                    </Box>
                ) : null*/}
        </Box>
    );

    /*return (
        <Container {...rest}>
            <InputGroup bg="blackAlpha.500" borderRadius="md">
                <InputLeftElement height="full" ml={1} width="auto" display="flex" alignItems="flex-start" mt="2">
                    <Button
                        height="fit-content"
                        paddingY="1"
                        onClick={() => {}}
                        backgroundColor="transparent"
                        _hover={{ backgroundColor: 'beets.green', color: 'gray.500' }}
                        paddingX="1"
                    >
                        <HStack spacing="none">
                            <TokenAvatar size="xs" address={tokenOption.address} />
                            <Text paddingLeft="1.5">{tokenOption.symbol}</Text>
                            <Box marginLeft="1">
                                <ChevronDown size={16} />
                            </Box>
                        </HStack>
                    </Button>
                </InputLeftElement>
                <Input
                    type="number"
                    min={0}
                    placeholder={proportionalAmount ? proportionalAmount.slice(0, 21) : '0'}
                    textAlign="right"
                    size="lg"
                    value={value || ''}
                    onChange={(e) => {
                        const newValue = tokenInputTruncateDecimalPlaces(e.currentTarget.value, tokenOption.decimals);

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
                    height="16"
                    pb="4"
                />
                <Flex position="absolute" bottom="2px" ml="2" alignItems="center">
                    <IconWallet stroke="gray.300" boxSize="12px" mr="1" />
                    <Text color="gray.200" fontSize="sm">
                        Balance: {tokenFormatAmountPrecise(userBalance, 4)}
                        {parseFloat(userBalance) > 0 ? (
                            <Link
                                ml={2}
                                color="green.300"
                                userSelect="none"
                                onClick={() => {
                                    setInputAmount(option.poolTokenAddress, userBalance);
                                }}
                            >
                                Max
                            </Link>
                        ) : null}
                    </Text>
                </Flex>
            </InputGroup>
            {/!*<Flex>
                <Box flex={1}>
                    <Text color="gray.500">
                        You have: {userBalance}
                        {parseFloat(userBalance) > 0 ? (
                            <Link
                                ml={2}
                                color="green.300"
                                userSelect="none"
                                onClick={() => {
                                    setInputAmount(option.poolTokenAddress, userBalance);
                                }}
                            >
                                Max
                            </Link>
                        ) : null}
                    </Text>
                </Box>
                {!value && proportionalAmount ? (
                    <Box>
                        <Link
                            color="green.300"
                            userSelect="none"
                            onClick={() => {
                                setInputAmount(option.poolTokenAddress, proportionalAmount);
                            }}
                        >
                            Proportional suggestion
                        </Link>
                    </Box>
                ) : null}
            </Flex>
            {!isValid ? <Text color="red.500">Exceeds wallet balance</Text> : null}*!/}
        </Container>
    );*/
}
