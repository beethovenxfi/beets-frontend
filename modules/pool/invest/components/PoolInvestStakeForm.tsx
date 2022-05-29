import { Box, Flex, Input, InputGroup, Link, Text } from '@chakra-ui/react';
import { usePoolUserPoolTokenBalances } from '~/modules/pool/lib/usePoolUserPoolTokenBalances';
import { useState } from 'react';
import { numberLimitInputToNumDecimals } from '~/lib/util/number-formats';
import { PoolInvestStakePreviewModal } from '~/modules/pool/invest/components/PoolInvestStakePreviewModal';

export function PoolInvestStakeForm() {
    const { userWalletBptBalance, hasBptInWallet } = usePoolUserPoolTokenBalances();
    const [amount, setAmount] = useState('');
    const hasValue = hasBptInWallet && amount !== '';
    const isValid = !hasValue || parseFloat(userWalletBptBalance) >= parseFloat(amount);

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
                        {userWalletBptBalance}
                        {hasBptInWallet ? (
                            <Link
                                ml={2}
                                color="green.300"
                                userSelect="none"
                                onClick={() => {
                                    setAmount(userWalletBptBalance);
                                }}
                            >
                                Max
                            </Link>
                        ) : null}
                    </Text>
                </Box>
            </Flex>
            {!isValid ? <Text color="red.500">Exceeds wallet balance</Text> : null}

            <PoolInvestStakePreviewModal mt={8} amount={amount} amountIsValid={isValid} />
        </Box>
    );
}
