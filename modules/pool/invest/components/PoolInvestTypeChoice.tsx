import { Box, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { tokenFormatAmount, tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import TokenAvatar from '~/components/token/TokenAvatar';
import BeetsButton from '~/components/button/Button';
import { usePool } from '~/modules/pool/lib/usePool';
import { useGetTokens } from '~/lib/global/useToken';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';

interface Props {
    onShowProportional(): void;
    onShowCustom(): void;
}

export function PoolInvestTypeChoice({ onShowProportional, onShowCustom }: Props) {
    const { pool } = usePool();
    const { priceForAmount } = useGetTokens();
    const { userPoolTokenBalances, investableAmount } = usePoolUserTokenBalancesInWallet();
    const { canInvestProportionally } = useInvest();

    return (
        <Box>
            <Flex mt="4" mb="4">
                <Box flex="1" mr="8">
                    <BeetsBox p="2" mb="4">
                        <Flex>
                            <Heading size="md" flex="1">
                                You can invest
                            </Heading>
                            <Heading size="md">{numberFormatUSDValue(investableAmount)}</Heading>
                        </Flex>
                        <Flex>
                            <Text size="lg" flex="1" color="gray.200">
                                Max proportional
                            </Text>
                            <Text size="lg" color="gray.200">
                                $2,232.56
                            </Text>
                        </Flex>
                    </BeetsBox>

                    <BeetsBox p="2">
                        <Heading size="sm" mb="4">
                            Pool tokens in my wallet
                        </Heading>
                        {pool.investConfig.options.map((option, index) => {
                            return (
                                <Box key={index}>
                                    {option.tokenOptions.map((tokenOption) => {
                                        const userBalance = tokenGetAmountForAddress(
                                            tokenOption.address,
                                            userPoolTokenBalances,
                                        );

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
                                </Box>
                            );
                        })}
                    </BeetsBox>
                </Box>
                <Box flex="1">
                    <BeetsBox p="4">
                        Information about investing proportionally vs custom. Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit. Sed sit amet lectus viverra, lacinia erat a, consectetur ex. Praesent vel nulla
                        ac risus auctor mollis id vitae libero.
                        <br />
                        <br />
                        Nunc sollicitudin lectus aliquam turpis maximus mollis. Duis auctor euismod urna, vel blandit
                        urna efficitur eu. Donec scelerisque consectetur enim, nec sodales diam tincidunt ut. Praesent
                        faucibus iaculis lacus, in sagittis erat euismod at.
                    </BeetsBox>
                </Box>
            </Flex>
            <BeetsButton isFullWidth mb="3" isDisabled={!canInvestProportionally} onClick={onShowProportional}>
                Invest proportionally
            </BeetsButton>
            <BeetsButton isFullWidth buttonType="secondary" isDisabled={investableAmount === 0} onClick={onShowCustom}>
                Customize my investment
            </BeetsButton>
        </Box>
    );
}
