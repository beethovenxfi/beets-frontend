import { Box, Flex, Input, InputGroup, Link, Text } from '@chakra-ui/react';
import { usePoolUserPoolTokenBalances } from '~/modules/pool/lib/usePoolUserPoolTokenBalances';
import { useEffect, useState } from 'react';
import { numberLimitInputToNumDecimals } from '~/lib/util/number-formats';
import BeetsButton from '~/components/button/Button';
import { useMasterChefDepositIntoFarm } from '~/lib/global/useMasterChefDepositIntoFarm';
import { usePool } from '~/modules/pool/lib/usePool';
import { TransactionActionsStepper } from '~/components/steps/TransactionActionsStepper';
import { useSteps } from '~/components/steps';
import { useAllowances } from '~/lib/util/useAllowances';
import { useAccount } from 'wagmi';
import { networkConfig } from '~/lib/config/network-config';
import { useApproveToken } from '~/lib/util/useApproveToken';

export function PoolInvestStakeForm() {
    const { pool } = usePool();
    const { userWalletBptBalance, hasBptInWallet } = usePoolUserPoolTokenBalances();
    const { data: accountData } = useAccount();
    const { data: allowances, hasApprovalForAmount } = useAllowances(
        accountData?.address || null,
        [pool],
        networkConfig.masterChefContractAddress,
    );

    const [amount, setAmount] = useState('');
    const hasValue = hasBptInWallet && amount !== '';
    const isValid = !hasValue || parseFloat(userWalletBptBalance) >= parseFloat(amount);
    const requiresApproval = hasApprovalForAmount(pool.address, amount);

    const { nextStep, activeStep } = useSteps({ initialStep: requiresApproval ? 0 : 1 });

    const {
        approve,
        isSubmitting: isApprovalSubmitting,
        isConfirmed: isApprovalConfirmed,
    } = useApproveToken(pool.address);
    const { stake, isSubmitting } = useMasterChefDepositIntoFarm();

    useEffect(() => {
        if (isApprovalConfirmed && activeStep === 0) {
            nextStep();
        }
    }, [isApprovalConfirmed]);

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

            <TransactionActionsStepper
                mt={8}
                activeStep={activeStep}
                steps={[
                    {
                        infoText: 'Some info text...',
                        buttonText: 'Approve BPT',
                        onClick: () => approve(networkConfig.masterChefContractAddress),
                        loading: isApprovalSubmitting,
                    },
                    {
                        infoText: 'Some info text...',
                        buttonText: 'Deposit BPT',
                        onClick: () => stake(pool.staking?.id || '', amount),
                        loading: isSubmitting,
                        disabled: isValid,
                    },
                ]}
            />
        </Box>
    );
}
