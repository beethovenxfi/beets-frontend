import { Alert, AlertIcon, Box, Button, Container, ContainerProps, Flex, Heading } from '@chakra-ui/react';
import { Settings } from 'react-feather';
import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';
import { PoolInvestFormTokenInput } from '~/modules/pool/invest/components/PoolInvestFormTokenInput';
import { useJoinPool } from '~/modules/pool/invest/lib/useJoinPool';
import { usePoolJoinGetProportionalSuggestionForFixedAmount } from '~/modules/pool/invest/lib/usePoolJoinGetProportionalSuggestionForFixedAmount';
import { usePoolJoinGetBptOutAndPriceImpactForTokensIn } from '~/modules/pool/invest/lib/usePoolJoinGetBptOutAndPriceImpactForTokensIn';
import { usePoolJoinGetContractCallData } from '~/modules/pool/invest/lib/usePoolJoinGetContractCallData';
import { tokenAmountsGetArrayFromMap } from '~/lib/services/token/token-util';
import { usePool } from '~/modules/pool/lib/usePool';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import BeetsButton from '~/components/button/Button';

interface Props extends ContainerProps {}

function PoolInvestForm({ ...rest }: Props) {
    const { pool } = usePool();
    const { userPoolTokenBalances } = usePoolUserTokenBalancesInWallet();
    const { inputAmounts, setInputAmount } = useInvestState();
    const { joinPool, isSubmitting, submitError } = useJoinPool(pool);
    const tokenAmountsIn = tokenAmountsGetArrayFromMap(inputAmounts);
    const { data: proportionalAmounts } = usePoolJoinGetProportionalSuggestionForFixedAmount();
    const { data: bptOutAndPriceImpact } = usePoolJoinGetBptOutAndPriceImpactForTokensIn();
    const { data: contractCallData } = usePoolJoinGetContractCallData(bptOutAndPriceImpact?.minBptReceived || null);

    return (
        <Box {...rest}>
            {/*<Flex justifyContent="flex-end" mb={4}>
                <Settings />
            </Flex>*/}
            {/*pool.investConfig.options.map((option, index) => (
                <PoolInvestFormTokenInput
                    key={index}
                    userBalances={userPoolTokenBalances}
                    option={option}
                    setInputAmount={(address, amount) => {
                        setInputAmount(address, amount);
                    }}
                    value={inputAmounts[option.poolTokenAddress]}
                    proportionalAmount={proportionalAmounts ? proportionalAmounts[option.poolTokenAddress] : ''}
                    mb={4}
                    p={0}
                />
            ))*/}
            <BeetsButton
                width="full"
                bgColor="green.400"
                mt={4}
                disabled={!contractCallData || isSubmitting}
                isLoading={isSubmitting}
                onClick={() => {
                    if (contractCallData) {
                        joinPool(contractCallData, tokenAmountsIn);
                    }
                }}
            >
                Invest
            </BeetsButton>
            {submitError ? (
                <Alert status="error" mt={4}>
                    <AlertIcon />
                    An error occurred: {submitError.message}
                </Alert>
            ) : null}
        </Box>
    );
}

export default PoolInvestForm;
