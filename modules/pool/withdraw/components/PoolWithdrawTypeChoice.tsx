import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    HStack,
    Skeleton,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import TokenAvatar from '~/components/token/TokenAvatar';
import { useGetTokens } from '~/lib/global/useToken';
import { usePoolUserDepositBalance } from '~/modules/pool/lib/usePoolUserDepositBalance';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { PoolUnstakeModal } from '~/modules/pool/stake/PoolUnstakeModal';
import { CardRow } from '~/components/card/CardRow';
import { useWithdraw } from '~/modules/pool/withdraw/lib/useWithdraw';
import { TokenSelectInline } from '~/components/token-select-inline/TokenSelectInline';
import { useWithdrawState } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { PoolWithdrawWeightedPoolDescription } from '~/modules/pool/withdraw/components/PoolWithdrawWeightedPoolDescription';
import { PoolWithdrawStablePoolDescription } from '~/modules/pool/withdraw/components/PoolWithdrawStablePoolDescription';
import { usePool } from '~/modules/pool/lib/usePool';

interface Props {
    onShowProportional(): void;
    onShowSingleAsset(): void;
}

export function PoolWithdrawTypeChoice({ onShowProportional, onShowSingleAsset }: Props) {
    const unstakeDisclosure = useDisclosure();
    const { pool, isFbeetsPool } = usePool();
    const { priceForAmount } = useGetTokens();
    const { userPoolBalanceUSD, data, isLoading: isPoolUserDepositBalanceLoading } = usePoolUserDepositBalance();
    const { userTotalBptBalance, userWalletBptBalance, userStakedBptBalance, hasBptInWallet, hasBptStaked } =
        usePoolUserBptBalance();
    const valueStaked = (parseFloat(userStakedBptBalance) / parseFloat(userTotalBptBalance)) * userPoolBalanceUSD;
    const valueInWallet = (parseFloat(userWalletBptBalance) / parseFloat(userTotalBptBalance)) * userPoolBalanceUSD;
    const { selectedWithdrawTokenAddresses } = useWithdraw();
    const { selectedOptions, setSelectedOption } = useWithdrawState();
    const isStablePool = pool.__typename === 'GqlPoolStable' || pool.__typename === 'GqlPoolPhantomStable';

    return (
        <Box>
            <Grid mt="4" mb="6" gap="8" templateColumns={{ base: '1fr', md: '1fr', lg: '1fr 1fr' }}>
                <GridItem>
                    <BeetsBox p="2" mb="6">
                        <Flex mb="4">
                            <Text fontSize="lg" fontWeight="semibold" flex="1">
                                My balance
                            </Text>
                            <Skeleton isLoaded={!isPoolUserDepositBalanceLoading}>
                                <Text fontSize="lg" fontWeight="semibold">
                                    {numberFormatUSDValue(userPoolBalanceUSD)}
                                </Text>
                            </Skeleton>
                        </Flex>
                        {pool.staking && (
                            <>
                                <CardRow>
                                    <Text flex="1">Wallet balance</Text>
                                    <Skeleton isLoaded={!isPoolUserDepositBalanceLoading}>
                                        <Text>{numberFormatUSDValue(valueInWallet)}</Text>
                                    </Skeleton>
                                </CardRow>
                                <CardRow mb="0">
                                    <Text flex="1">Staked balance</Text>
                                    <Skeleton isLoaded={!isPoolUserDepositBalanceLoading}>
                                        <Text>{numberFormatUSDValue(valueStaked)}</Text>
                                    </Skeleton>
                                </CardRow>
                            </>
                        )}
                    </BeetsBox>

                    <BeetsBox p="2">
                        <Text fontSize="lg" fontWeight="semibold" mb="4">
                            Pool tokens breakdown
                        </Text>
                        {pool.withdrawConfig.options.map((option, index) => {
                            const hasOptions = option.tokenOptions.length > 1;
                            const token =
                                option.tokenOptions.find((tokenOption) =>
                                    selectedWithdrawTokenAddresses.includes(tokenOption.address),
                                ) || option.tokenOptions[0];
                            const balance = data?.find((item) => item.address === token.address)?.amount || '0';

                            return (
                                <CardRow
                                    key={token.address}
                                    mb={index === pool.tokens.length - 1 ? '0' : '1'}
                                    alignItems="center"
                                    pl={hasOptions ? '1' : '2'}
                                >
                                    <Box flex="1">
                                        {hasOptions ? (
                                            <TokenSelectInline
                                                tokenOptions={option.tokenOptions}
                                                selectedAddress={
                                                    selectedOptions[`${option.poolTokenIndex}`] ||
                                                    option.tokenOptions[0].address
                                                }
                                                onOptionSelect={(address) =>
                                                    setSelectedOption(option.poolTokenIndex, address)
                                                }
                                            />
                                        ) : (
                                            <HStack spacing="1.5">
                                                <TokenAvatar size="xs" address={token.address} />
                                                <Text fontSize="lg">{token.symbol}</Text>
                                            </HStack>
                                        )}
                                    </Box>

                                    <Box>
                                        <Box textAlign="right" fontSize="lg">
                                            <Skeleton isLoaded={!isPoolUserDepositBalanceLoading}>
                                                {tokenFormatAmount(balance)}
                                            </Skeleton>
                                        </Box>

                                        <Box textAlign="right" fontSize="sm" color="gray.200">
                                            <Skeleton isLoaded={!isPoolUserDepositBalanceLoading}>
                                                {numberFormatUSDValue(
                                                    priceForAmount({
                                                        address: token.address,
                                                        amount: balance,
                                                    }),
                                                )}
                                            </Skeleton>
                                        </Box>
                                    </Box>
                                </CardRow>
                            );
                        })}
                    </BeetsBox>
                </GridItem>
                <GridItem>
                    <BeetsBox p="4">
                        {isStablePool ? <PoolWithdrawStablePoolDescription /> : <PoolWithdrawWeightedPoolDescription />}
                    </BeetsBox>
                </GridItem>
            </Grid>
            {hasBptStaked && !isFbeetsPool && (
                <Alert status="warning" borderRadius="md" mb="4">
                    <AlertIcon />
                    <Box flex="1" mr="4">
                        You have ~{numberFormatUSDValue(valueStaked)} worth of BPT staked. In order to withdraw this
                        amount, you must first unstake your BPT.
                    </Box>
                    <Button variant="outline" onClick={unstakeDisclosure.onOpen}>
                        Unstake
                    </Button>
                </Alert>
            )}
            <Button variant="primary" width="full" isDisabled={!hasBptInWallet} onClick={onShowProportional}>
                Withdraw proportionally
            </Button>
            <Button variant="secondary" width="full" mt="2" isDisabled={!hasBptInWallet} onClick={onShowSingleAsset}>
                Single asset withdraw
            </Button>

            <PoolUnstakeModal {...unstakeDisclosure} />
        </Box>
    );
}
