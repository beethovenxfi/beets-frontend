import { Alert, AlertIcon, Box, Button, Flex, Heading, HStack, Text, useDisclosure } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import TokenAvatar from '~/components/token/TokenAvatar';
import { usePool } from '~/modules/pool/lib/usePool';
import { useGetTokens } from '~/lib/global/useToken';
import { usePoolUserDepositBalance } from '~/modules/pool/lib/usePoolUserDepositBalance';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { PoolUnstakeModal } from '~/modules/pool/stake/PoolUnstakeModal';
import { CardRow } from '~/components/card/CardRow';

interface Props {
    onShowProportional(): void;
    onShowSingleAsset(): void;
}

export function PoolWithdrawTypeChoice({ onShowProportional, onShowSingleAsset }: Props) {
    const unstakeDisclosure = useDisclosure();
    const { pool } = usePool();
    const { priceForAmount } = useGetTokens();
    const { isLoading, userPoolBalanceUSD, data } = usePoolUserDepositBalance();
    const { userTotalBptBalance, userWalletBptBalance, userStakedBptBalance, hasBptInWallet, hasBptStaked } =
        usePoolUserBptBalance();
    const valueStaked = (parseFloat(userStakedBptBalance) / parseFloat(userTotalBptBalance)) * userPoolBalanceUSD;
    const valueInWallet = (parseFloat(userWalletBptBalance) / parseFloat(userTotalBptBalance)) * userPoolBalanceUSD;

    return (
        <Box>
            <Flex mt="4" mb="4">
                <Box flex="1" mr="8">
                    <BeetsBox p="2" mb="6">
                        <Flex mb="4">
                            <Text fontSize="lg" fontWeight="semibold" flex="1">
                                My balance
                            </Text>
                            <Text fontSize="lg" fontWeight="semibold">
                                {numberFormatUSDValue(userPoolBalanceUSD)}
                            </Text>
                        </Flex>
                        {pool.staking ? (
                            <>
                                <CardRow>
                                    <Text flex="1">Wallet balance</Text>
                                    <Text>{numberFormatUSDValue(valueInWallet)}</Text>
                                </CardRow>
                                <CardRow mb="0">
                                    <Text flex="1">Staked balance</Text>
                                    <Text>{numberFormatUSDValue(valueStaked)}</Text>
                                </CardRow>
                            </>
                        ) : null}
                    </BeetsBox>

                    <BeetsBox p="2">
                        <Text fontSize="lg" fontWeight="semibold" mb="4">
                            Pool tokens breakdown
                        </Text>
                        {pool.tokens.map((token, index) => {
                            const balance = data?.find((item) => item.address === token.address)?.amount || '0';

                            return (
                                <CardRow
                                    key={token.address}
                                    mb={index === pool.tokens.length - 1 ? '0' : '1'}
                                    alignItems="flex-start"
                                >
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
                                </CardRow>
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
                    <Button variant="outline" onClick={unstakeDisclosure.onOpen}>
                        Unstake
                    </Button>
                </Alert>
            )}
            <Button variant="primary" isFullWidth mb="2" isDisabled={!hasBptInWallet} onClick={onShowProportional}>
                Withdraw proportionally
            </Button>
            <Button variant="secondary" isFullWidth isDisabled={!hasBptInWallet} onClick={onShowSingleAsset}>
                Single asset withdraw
            </Button>

            <PoolUnstakeModal {...unstakeDisclosure} />
        </Box>
    );
}
