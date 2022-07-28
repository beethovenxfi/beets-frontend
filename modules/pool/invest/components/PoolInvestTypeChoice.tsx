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
import numeral from 'numeral';

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
                        We recommend investing proportionally into this pool. This ensures you will{' '}
                        <Text as="span" fontWeight="bold">
                            NOT
                        </Text>{' '}
                        be subject to potential fees caused by price impact.
                        <br />
                        <br />
                        Alternatively, you can customize and invest in this pool in any proportion. Investing in this
                        manner, however, may shift the pool out of balance and is therefore subject to price impact.
                        <br />
                        <br />
                        When investing in a liquidity pool, you will receive pool tokens (BPT) which represent your
                        share of the pool.
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
