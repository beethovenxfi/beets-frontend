import { Alert, AlertIcon, Button, Container, ContainerProps, Flex, Heading, Select } from '@chakra-ui/react';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { Settings } from 'react-feather';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';
import { PoolInvestFormTokenInput } from '~/modules/pool/invest/components/PoolInvestFormTokenInput';
import { useJoinPool } from '~/modules/pool/invest/lib/useJoinPool';
import { useWithdrawState } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { useExitPool } from '~/modules/pool/withdraw/lib/useExitPool';
import { PoolWithdrawProportional } from '~/modules/pool/withdraw/components/PoolWithdrawProportional';
import { usePool } from '~/modules/pool/lib/usePool';
import { usePoolUserBalances } from '~/modules/pool/lib/usePoolUserBalances';
import { PoolWithdrawSingleAsset } from '~/modules/pool/withdraw/components/PoolWithdrawSingleAsset';
import { useWithdrawSingleAsset } from '~/modules/pool/withdraw/lib/useWithdrawSingleAsset';
import { useWithdrawProportionalAmounts } from '~/modules/pool/withdraw/lib/useWithdrawProportionalAmounts';

interface Props extends ContainerProps {}

function PoolInvestForm({ ...rest }: Props) {
    const { pool } = usePool();
    const { userBalances } = usePoolUserBalances();
    const {
        selectedWithdrawType,
        singleAssetWithdraw,
        setProportionalPercent,
        proportionalPercent,
        setProportionalWithdraw,
        setSingleAssetWithdraw,
    } = useWithdrawState();
    const { exitPool, isSubmitting, submitError } = useExitPool(pool);
    const { contractCallData: singleAssetContractCallData } = useWithdrawSingleAsset();
    const { contractCallData: proportionalContractCallData } = useWithdrawProportionalAmounts();

    return (
        <Container bg="gray.900" shadow="lg" rounded="lg" padding="4" maxW="full" {...rest}>
            <Flex>
                <Heading fontSize="2xl" mb={4} flex={1}>
                    Withdraw from pool
                </Heading>
                <Settings />
            </Flex>

            <Select
                value={singleAssetWithdraw ? singleAssetWithdraw.address : 'PROPORTIONAL'}
                onChange={(e) => {
                    if (e.target.value === 'PROPORTIONAL') {
                        setProportionalWithdraw();
                    } else {
                        setSingleAssetWithdraw(e.target.value);
                    }
                }}
                mb={4}
                mt={4}
            >
                <option value="PROPORTIONAL">All tokens</option>
                {pool.withdrawConfig.options.map((option, index) => {
                    const tokenOption = option.tokenOptions[0];

                    return (
                        <option value={tokenOption.address} key={index}>
                            {tokenOption.symbol}
                        </option>
                    );
                })}
            </Select>

            {singleAssetWithdraw ? <PoolWithdrawSingleAsset /> : <PoolWithdrawProportional />}

            <Button
                width="full"
                bgColor="green.400"
                mt={4}
                disabled={
                    (singleAssetWithdraw && !singleAssetContractCallData) ||
                    (!singleAssetWithdraw && !proportionalContractCallData) ||
                    isSubmitting
                }
                isLoading={isSubmitting}
                onClick={() => {
                    if (singleAssetWithdraw && singleAssetContractCallData) {
                        exitPool(singleAssetContractCallData);
                    }

                    if (!singleAssetWithdraw && proportionalContractCallData) {
                        exitPool(proportionalContractCallData);
                    }
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
