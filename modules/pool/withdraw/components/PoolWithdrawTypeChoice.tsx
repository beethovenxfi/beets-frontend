import { Alert, AlertIcon, Box, Button, Flex, Heading, HStack, Link, Text, useDisclosure } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { tokenFormatAmount, tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import TokenAvatar from '~/components/token/TokenAvatar';
import BeetsButton from '~/components/button/Button';
import { usePool } from '~/modules/pool/lib/usePool';
import { useGetTokens } from '~/lib/global/useToken';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { usePoolUserDepositBalance } from '~/modules/pool/lib/usePoolUserDepositBalance';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { PoolUnstakeModal } from '~/modules/pool/stake/PoolUnstakeModal';

interface Props {
    onShowProportional(): void;
    onShowCustom(): void;
}

export function PoolWithdrawTypeChoice({ onShowProportional, onShowCustom }: Props) {
    const unstakeDisclosure = useDisclosure();
    const { pool } = usePool();
    const { priceForAmount } = useGetTokens();
    const { investableAmount } = usePoolUserTokenBalancesInWallet();
    const { canInvestProportionally } = useInvest();
    const { isLoading, userPoolBalanceUSD, data } = usePoolUserDepositBalance();
    const { userTotalBptBalance, userWalletBptBalance, userStakedBptBalance, hasBptInWallet, hasBptStaked } =
        usePoolUserBptBalance();
    const valueStaked = (parseFloat(userStakedBptBalance) / parseFloat(userTotalBptBalance)) * userPoolBalanceUSD;
    const valueInWallet = (parseFloat(userWalletBptBalance) / parseFloat(userTotalBptBalance)) * userPoolBalanceUSD;

    return (
        <Box>
            <Flex mt="4" mb="4">
                <Box flex="1" mr="8">
                    <BeetsBox px="2" py="4" mb="4">
                        <Flex>
                            <Heading size="md" flex="1">
                                My balance
                            </Heading>
                            <Heading size="md">{numberFormatUSDValue(userPoolBalanceUSD)}</Heading>
                        </Flex>
                        {pool.staking ? (
                            <>
                                <Flex>
                                    <Text flex="1" color="gray.200">
                                        Wallet balance
                                    </Text>
                                    <Text color="gray.200">{numberFormatUSDValue(valueInWallet)}</Text>
                                </Flex>
                                <Flex>
                                    <Text flex="1" color="gray.200">
                                        Staked balance
                                    </Text>
                                    <Text color="gray.200">{numberFormatUSDValue(valueStaked)}</Text>
                                </Flex>
                            </>
                        ) : null}
                    </BeetsBox>

                    <BeetsBox p="2" pt="2">
                        <Heading size="sm" mb="4">
                            Pool tokens breakdown
                        </Heading>
                        {pool.tokens.map((token, index) => {
                            const balance = data?.find((item) => item.address === token.address)?.amount || '0';

                            return (
                                <Flex key={token.address} mb="2" alignItems="flex-start">
                                    <HStack spacing="none" flex="1">
                                        <TokenAvatar size="xs" address={token.address} />
                                        <Text paddingLeft="1.5" fontSize="lg">
                                            {token.symbol}
                                        </Text>
                                    </HStack>
                                    <Box>
                                        <Box textAlign="right" fontSize="lg">
                                            {tokenFormatAmount(balance)}
                                        </Box>
                                        <Box textAlign="right" fontSize="sm" color="gray.200">
                                            {numberFormatUSDValue(
                                                priceForAmount({
                                                    address: token.address,
                                                    amount: balance,
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
                    <BeetsBox p="4">
                        Information about withdrawing proportionally vs custom. Lorem ipsum dolor sit amet, consectetur
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
            {hasBptStaked && (
                <Alert status="warning" borderRadius="md" mb="4">
                    <AlertIcon />
                    <Box flex="1" mr="4">
                        You have {numberFormatUSDValue(valueStaked)} worth of BPT staked. In order to withdraw this
                        amount, you must first unstake your BPT.
                    </Box>
                    <Button
                        variant="outline"
                        onClick={() => {
                            unstakeDisclosure.onOpen();
                        }}
                    >
                        Unstake
                    </Button>
                </Alert>
            )}
            <BeetsButton isFullWidth mb="3" isDisabled={!hasBptInWallet} onClick={onShowProportional}>
                Withdraw proportionally
            </BeetsButton>
            <BeetsButton isFullWidth buttonType="secondary" isDisabled={!hasBptInWallet} onClick={onShowCustom}>
                Customize my withdraw
            </BeetsButton>

            <PoolUnstakeModal {...unstakeDisclosure} />
        </Box>
    );
}
