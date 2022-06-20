import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { useEffect, useState } from 'react';
import { Box, Flex, Input, InputGroup, Link, Text } from '@chakra-ui/react';
import { numberLimitInputToNumDecimals } from '~/lib/util/number-formats';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { useMasterChefWithdrawFromFarm } from '~/lib/global/useMasterChefWithdrawFromFarm';
import { usePool } from '~/modules/pool/lib/usePool';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';

export function PoolWithdrawUnstakeForm() {
    const { pool } = usePool();
    const { userStakedBptBalance, hasBptStaked, isLoading, refetch, isRefetching } = usePoolUserBptBalance();
    const [amount, setAmount] = useState('');
    const hasValue = hasBptStaked && amount !== '';
    const isValid = !hasValue || parseFloat(userStakedBptBalance) >= parseFloat(amount);

    const { withdraw, isPending, isSubmitting, isConfirmed } = useMasterChefWithdrawFromFarm();

    useEffect(() => {
        if (isConfirmed) {
            refetch();
        }
    }, [isConfirmed]);

    return (
        <Box>
            <InputGroup>
                <Input
                    type="number"
                    placeholder={'0.0'}
                    textAlign="right"
                    size="lg"
                    value={amount}
                    onChange={(e) => {
                        setAmount(numberLimitInputToNumDecimals(e.target.value));
                    }}
                    isInvalid={!isValid}
                />
            </InputGroup>
            <Flex>
                <Box flex={1}>
                    <Text color="gray.500">
                        {userStakedBptBalance}
                        {hasBptStaked ? (
                            <Link
                                ml={2}
                                color="green.300"
                                userSelect="none"
                                onClick={() => {
                                    setAmount(userStakedBptBalance);
                                }}
                            >
                                Max
                            </Link>
                        ) : null}
                    </Text>
                </Box>
            </Flex>
            {!isValid ? <Text color="red.500">Exceeds staked balance</Text> : null}
            <BeetsSubmitTransactionButton
                isLoading={isLoading}
                loadingText="Loading balances..."
                isSubmitting={isSubmitting}
                isPending={isPending || isRefetching}
                onClick={() => withdraw(pool.staking?.id || '', amount)}
                mt={8}
                width="full"
            >
                Unstake
            </BeetsSubmitTransactionButton>
        </Box>
    );
}
