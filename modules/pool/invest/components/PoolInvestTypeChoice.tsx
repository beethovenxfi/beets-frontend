import { Box, Button, Flex, Grid, GridItem, HStack, Skeleton, Text } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { tokenFormatAmount, tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import TokenAvatar from '~/components/token/TokenAvatar';
import { usePool } from '~/modules/pool/lib/usePool';
import { useGetTokens } from '~/lib/global/useToken';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { usePoolGetMaxProportionalInvestmentAmount } from '~/modules/pool/invest/lib/usePoolGetMaxProportionalInvestmentAmount';
import { CardRow } from '~/components/card/CardRow';

interface Props {
    onShowProportional(): void;
    onShowCustom(): void;
}

export function PoolInvestTypeChoice({ onShowProportional, onShowCustom }: Props) {
    const { pool } = usePool();
    const { priceForAmount } = useGetTokens();
    const { userPoolTokenBalances, investableAmount } = usePoolUserTokenBalancesInWallet();
    const { canInvestProportionally } = useInvest();
    const { data, isLoading } = usePoolGetMaxProportionalInvestmentAmount();
    const isStablePool = pool.__typename === 'GqlPoolStable' || pool.__typename === 'GqlPoolPhantomStable';
    const proportionalEnabled = pool.investConfig.proportionalEnabled;
    //const totalTokenBalance = sumBy(pool.tokens, (token) => parseFloat(token.balance) * parseFloat(token.priceRate));

    return (
        <Box>
            <Grid mt="4" mb="6" gap="8" templateColumns={{ base: '1fr', md: '1fr', lg: '1fr 1fr' }}>
                <GridItem>
                    <BeetsBox p="2" mb="6">
                        <Flex fontSize="lg" fontWeight="semibold" mb="4">
                            <Text flex="1">You can invest</Text>
                            <Text>{numberFormatUSDValue(investableAmount)}</Text>
                        </Flex>
                        <CardRow alignItems="center" mb="0">
                            <Text flex="1">Max proportional</Text>
                            {typeof data?.maxAmount === 'number' && !isLoading ? (
                                <Text>{numberFormatUSDValue(data.maxAmount)}</Text>
                            ) : (
                                <Skeleton height="20px" width="80px" />
                            )}
                        </CardRow>
                    </BeetsBox>
                    <BeetsBox p="2">
                        <Text fontSize="lg" fontWeight="semibold" mb="4">
                            Pool tokens in my wallet
                        </Text>
                        {pool.investConfig.options.map((option, index) => {
                            const lastOption = pool.investConfig.options.length - 1 === index;

                            return (
                                <Box key={index}>
                                    {option.tokenOptions.map((tokenOption, tokenIndex) => {
                                        const lastTokenOption = option.tokenOptions.length - 1 === tokenIndex;
                                        const userBalance = tokenGetAmountForAddress(
                                            tokenOption.address,
                                            userPoolTokenBalances,
                                        );

                                        return (
                                            <CardRow
                                                key={tokenOption.address}
                                                mb={lastOption && lastTokenOption ? '0' : '1'}
                                                alignItems="center"
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
                                            </CardRow>
                                        );
                                    })}
                                </Box>
                            );
                        })}
                    </BeetsBox>
                </GridItem>
                <GridItem>
                    {isStablePool ? (
                        <BeetsBox px="4" py="2">
                            Details about investing into stable pools. Lorem ipsum dolor sit amet, consectetur
                            adipiscing elit. Curabitur pharetra enim lorem, et mattis justo finibus aliquam.
                            <br />
                            <br />
                            Aenean blandit vitae ex eget iaculis. Nullam consectetur malesuada enim tempor venenatis.
                            Morbi venenatis mi ut leo mollis, at ullamcorper enim sodales. Donec in tellus cursus,
                            vulputate lorem nec, hendrerit urna.
                            <br />
                            <br />
                            Sed at libero scelerisque, facilisis dui et, placerat neque. Fusce id arcu id justo sagittis
                            volutpat.
                        </BeetsBox>
                    ) : (
                        <BeetsBox px="4" py="2">
                            We recommend investing proportionally into this pool. This ensures you will{' '}
                            <Text as="span" fontWeight="bold">
                                NOT
                            </Text>{' '}
                            be subject to potential fees caused by price impact.
                            <br />
                            <br />
                            Alternatively, you can customize and invest in this pool in any proportion. Investing in
                            this manner, however, may shift the pool out of balance and is therefore subject to price
                            impact.
                            <br />
                            <br />
                            When investing in a liquidity pool, you will receive pool tokens (BPT) which represent your
                            share of the pool.
                        </BeetsBox>
                    )}
                </GridItem>
            </Grid>
            {isStablePool ? (
                <>
                    <Button
                        isFullWidth
                        variant="primary"
                        isDisabled={investableAmount === 0}
                        onClick={onShowCustom}
                        mb={proportionalEnabled ? '3' : '0'}
                    >
                        {proportionalEnabled ? 'Customize my investment' : 'Invest'}
                    </Button>
                    {pool.investConfig.proportionalEnabled && (
                        <Button
                            variant="secondary"
                            isFullWidth
                            isDisabled={!canInvestProportionally}
                            onClick={onShowProportional}
                        >
                            Invest proportionally
                        </Button>
                    )}
                </>
            ) : (
                <>
                    {proportionalEnabled && (
                        <Button
                            variant="primary"
                            isFullWidth
                            mb="3"
                            isDisabled={!canInvestProportionally}
                            onClick={onShowProportional}
                        >
                            Invest proportionally
                        </Button>
                    )}
                    <Button isFullWidth variant="secondary" isDisabled={investableAmount === 0} onClick={onShowCustom}>
                        {proportionalEnabled ? 'Customize my investment' : 'Invest'}
                    </Button>
                </>
            )}
        </Box>
    );
}
