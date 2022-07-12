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
                    <BeetsBox p="2" pb="1" mt="4">
                        {pool.investConfig.options.map((option, index) => {
                            const tokenOption = option.tokenOptions[0];
                            const userBalance = tokenGetAmountForAddress(tokenOption.address, userPoolTokenBalances);

                            return (
                                <Flex key={tokenOption.address} mb="2" alignItems="flex-start">
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
                    <BeetsBox p="2" pb="1" mt="2">
                        {pool.investConfig.options.map((option, index) => {
                            const tokenOption = option.tokenOptions[0];

                            return (
                                <Flex key={tokenOption.address} mb="2" alignItems="center">
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
                    <BeetsBox p="2" pb="1" mt="2">
                        <Flex>
                            <Box flex="1">Zap into farm</Box>
                            <Switch id="zap-into-farm" colorScheme="green" />
                        </Flex>
                        <Flex alignItems="center" mt="2">
                            <Box flex="1">Max slippage</Box>
                            <Link color="beets.cyan">0.1%</Link>
                        </Flex>
                        <Flex alignItems="center" mt="2">
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
