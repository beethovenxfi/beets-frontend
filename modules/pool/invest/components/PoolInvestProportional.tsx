import {
    Box,
    Heading,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Slider,
    SliderMark,
    Text,
    Flex,
    HStack,
    Button,
    Tab,
    TabList,
    Tabs,
    Link,
    Switch,
} from '@chakra-ui/react';
import { useState } from 'react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { tokenFormatAmount, tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import TokenAvatar from '~/components/token/TokenAvatar';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { usePool } from '~/modules/pool/lib/usePool';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { useGetTokens } from '~/lib/global/useToken';
import BeetsButton from '~/components/button/Button';

export function PoolInvestProportional() {
    const [sliderValue, setSliderValue] = useState(50);
    const { pool } = usePool();
    const { investableAmount, userPoolTokenBalances, canInvestProportionally } = usePoolUserTokenBalancesInWallet();
    const { priceForAmount } = useGetTokens();

    return (
        <Box>
            <Flex mt="4" mb="4">
                <Box flex="1" mr="8">
                    <Text fontSize="lg" fontWeight="semibold">
                        1. Configure token amounts
                    </Text>
                    <Text color="gray.200">Drag the slider below to configure your investment amount.</Text>
                    <Slider
                        mt="12"
                        aria-label="slider-ex-1"
                        defaultValue={50}
                        value={sliderValue}
                        onChange={setSliderValue}
                    >
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb boxSize={4} />
                        <SliderMark
                            value={sliderValue}
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
                            {sliderValue}%
                        </SliderMark>
                    </Slider>
                    <BeetsBox mt="4" pt="0.5">
                        {pool.investConfig.options.map((option, index) => {
                            const tokenOption = option.tokenOptions[0];
                            const userBalance = tokenGetAmountForAddress(tokenOption.address, userPoolTokenBalances);

                            return (
                                <Flex
                                    key={tokenOption.address}
                                    px="3"
                                    py="2"
                                    alignItems="center"
                                    borderBottomWidth={index === pool.investConfig.options.length - 1 ? 0 : 1}
                                >
                                    <HStack spacing="none" flex="1">
                                        <TokenAvatar size="xs" address={tokenOption.address} />
                                        <Text paddingLeft="1.5" fontSize="lg">
                                            {tokenOption.symbol}
                                        </Text>
                                    </HStack>
                                    <Box>
                                        <Box textAlign="right" fontSize="lg">
                                            {tokenFormatAmount(userBalance)}
                                        </Box>
                                        <Box textAlign="right" fontSize="sm" color="gray.200">
                                            {numberFormatUSDValue(
                                                priceForAmount({
                                                    address: tokenOption.address,
                                                    amount: userBalance,
                                                }),
                                            )}
                                        </Box>
                                    </Box>
                                </Flex>
                            );
                        })}
                    </BeetsBox>
                </Box>
                <Box flex="1">
                    <Box>
                        <Text fontSize="lg" fontWeight="semibold">
                            2. Approve tokens for investing
                        </Text>
                        <Text color="gray.200">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
                    </Box>
                    <BeetsBox mt="2">
                        {pool.investConfig.options.map((option, index) => {
                            const tokenOption = option.tokenOptions[0];

                            return (
                                <Flex
                                    key={tokenOption.address}
                                    px="3"
                                    py="2"
                                    alignItems="center"
                                    borderBottomWidth={index === pool.investConfig.options.length - 1 ? 0 : 1}
                                >
                                    <HStack spacing="none" flex="1">
                                        <TokenAvatar size="xs" address={tokenOption.address} />
                                        <Text paddingLeft="1.5" fontSize="lg">
                                            {tokenOption.symbol}
                                        </Text>
                                    </HStack>
                                    <Box>
                                        <Button
                                            variant="outline"
                                            size="xs"
                                            color="beets.green"
                                            borderColor="beets.green"
                                        >
                                            Approve
                                        </Button>
                                    </Box>
                                </Flex>
                            );
                        })}
                    </BeetsBox>
                    <Box mt="6">
                        <Text fontSize="lg" fontWeight="semibold">
                            3. Customize settings
                        </Text>
                    </Box>
                    <BeetsBox mt="2">
                        <Flex px="3" py="2" borderBottomWidth={1}>
                            <Box flex="1">Zap into farm</Box>
                            <Switch id="zap-into-farm" colorScheme="green" />
                        </Flex>
                        <Flex px="3" py="2" alignItems="center" borderBottomWidth={1}>
                            <Box flex="1">Max slippage</Box>
                            <Link color="beets.cyan">0.1%</Link>
                        </Flex>
                        <Flex px="3" py="2" alignItems="center">
                            <Box flex="1">Transaction speed</Box>

                            <Link color="beets.cyan">Normal</Link>
                        </Flex>
                    </BeetsBox>
                </Box>
            </Flex>
            <BeetsButton isFullWidth mt="4" isDisabled={true}>
                Invest $1,221.22
            </BeetsButton>
        </Box>
    );
}
