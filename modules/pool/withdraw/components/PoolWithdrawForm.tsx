import { Alert, AlertIcon, Button, Container, ContainerProps, Flex, Heading, Select } from '@chakra-ui/react';
import { Settings } from 'react-feather';
import { useWithdrawState } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { useExitPool } from '~/modules/pool/withdraw/lib/useExitPool';
import { PoolWithdrawProportional } from '~/modules/pool/withdraw/components/PoolWithdrawProportional';
import { usePool } from '~/modules/pool/lib/usePool';
import { PoolWithdrawSingleAsset } from '~/modules/pool/withdraw/components/PoolWithdrawSingleAsset';
import { usePoolExitGetContractCallData } from '~/modules/pool/withdraw/lib/usePoolExitGetContractCallData';

interface Props extends ContainerProps {}

function PoolWithdrawForm({ ...rest }: Props) {
    const { pool } = usePool();
    const { singleAssetWithdraw, setProportionalWithdraw, setSingleAssetWithdraw } = useWithdrawState();
    const { exitPool, isSubmitting, submitError } = useExitPool(pool);
    const { data: contractCallData } = usePoolExitGetContractCallData();

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
                disabled={!contractCallData || isSubmitting}
                isLoading={isSubmitting}
                onClick={() => {
                    if (contractCallData) {
                        exitPool(contractCallData);
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

export default PoolWithdrawForm;
