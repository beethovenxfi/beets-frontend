import { Alert, AlertIcon, Button, Container, ContainerProps, Flex, Heading } from '@chakra-ui/react';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { Settings } from 'react-feather';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';
import { PoolInvestFormTokenInput } from '~/modules/pool/invest/components/PoolInvestFormTokenInput';
import { useJoinPool } from '~/modules/pool/invest/lib/useJoinPool';
import { useInvestProportionalSuggestions } from '~/modules/pool/invest/lib/useInvestProportionalSuggestions';
import { useInvestEstimate } from '~/modules/pool/invest/lib/useInvestEstimate';

interface Props extends ContainerProps {
    pool: GqlPoolUnion;
    userBalances: TokenAmountHumanReadable[];
}

function PoolInvestForm({ pool, userBalances, ...rest }: Props) {
    const { inputAmounts, setInputAmount } = useInvestState();
    const { joinPool, isSubmitting, submitError } = useJoinPool(pool);
    const { proportionalAmounts } = useInvestProportionalSuggestions();
    const { priceImpact, contractCallData, tokenAmountsIn } = useInvestEstimate();

    return (
        <Container bg="gray.900" shadow="lg" rounded="lg" padding="4" maxW="full" {...rest}>
            <Flex>
                <Heading fontSize="2xl" mb={4} flex={1}>
                    Invest in pool
                </Heading>
                <Settings />
            </Flex>
            {pool.investConfig.options.map((option, index) => (
                <PoolInvestFormTokenInput
                    key={index}
                    userBalances={userBalances}
                    option={option}
                    setInputAmount={(address, amount) => {
                        setInputAmount(address, amount);
                    }}
                    value={inputAmounts[option.poolTokenAddress]}
                    proportionalAmount={proportionalAmounts[option.poolTokenAddress]}
                    mb={4}
                />
            ))}
            <Button
                width="full"
                bgColor="green.400"
                mt={4}
                disabled={contractCallData === null || isSubmitting}
                isLoading={isSubmitting}
                onClick={() => {
                    if (contractCallData) {
                        joinPool(contractCallData, tokenAmountsIn);
                    }
                }}
            >
                Invest
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
