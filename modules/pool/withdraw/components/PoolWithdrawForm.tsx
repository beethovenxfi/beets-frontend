import { Alert, AlertIcon, Button, Container, ContainerProps, Flex, Heading } from '@chakra-ui/react';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { Settings } from 'react-feather';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';
import { PoolInvestFormTokenInput } from '~/modules/pool/invest/components/PoolInvestFormTokenInput';
import { useJoinPool } from '~/modules/pool/invest/lib/useJoinPool';
import { useWithdrawState } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { useExitPool } from '~/modules/pool/withdraw/lib/useExitPool';
import { PoolWithdrawProportional } from '~/modules/pool/withdraw/components/PoolWithdrawProportional';

interface Props extends ContainerProps {
    pool: GqlPoolUnion;
    userBalances: TokenAmountHumanReadable[];
}

function PoolInvestForm({ pool, userBalances, ...rest }: Props) {
    const userBptBalance = userBalances.find((balance) => balance.address === pool.address)?.amount || '0';
    const {
        proportionalAmounts,
        contractCallData,
        tokenAmountsOut,
        selectedWithdrawType,
        setProportionalPercent,
        proportionalPercent,
    } = useWithdrawState(pool, userBptBalance);
    const { exitPool, isSubmitting, submitError } = useExitPool(pool);

    return (
        <Container bg="gray.900" shadow="lg" rounded="lg" padding="4" maxW="full" {...rest}>
            <Flex>
                <Heading fontSize="2xl" mb={4} flex={1}>
                    Withdraw from pool
                </Heading>
                <Settings />
            </Flex>

            <PoolWithdrawProportional
                pool={pool}
                setProportionalPercent={setProportionalPercent}
                proportionalPercent={proportionalPercent}
            />
            <Button
                width="full"
                bgColor="green.400"
                mt={4}
                disabled={contractCallData === null || isSubmitting}
                isLoading={isSubmitting}
                onClick={() => {
                    /*if (contractCallData) {
                        joinPool(contractCallData, tokenAmountsIn);
                    }*/
                }}
            >
                Withdraw
            </Button>
            {submitError ? (
                <Alert status="error" mt={4}>
                    <AlertIcon />
                    An error occurred: {submitError.message}
                </Alert>
            ) : null}
        </Container>
    );
}

export default PoolInvestForm;
