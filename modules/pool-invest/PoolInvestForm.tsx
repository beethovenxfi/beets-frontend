import {
    Box,
    Button,
    Container,
    ContainerProps,
    Flex,
    Heading,
    Input,
    InputGroup,
    InputLeftElement,
    Link,
    Text,
} from '@chakra-ui/react';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { useGetTokens } from '~/modules/global/useToken';
import TokenAvatar from '~/components/token-avatar/TokenAvatar';
import { Settings } from 'react-feather';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import { useInvestState } from '~/modules/pool-invest/useInvestState';
import { keyBy } from 'lodash';

interface Props extends ContainerProps {
    pool: GqlPoolUnion;
    userBalances: TokenAmountHumanReadable[];
}

function PoolInvestForm({ pool, userBalances, ...rest }: Props) {
    const { priceFor } = useGetTokens();
    const { investState, setInputAmount, getInputAmount, service } = useInvestState(pool);

    return (
        <Container bg="gray.900" shadow="lg" rounded="lg" padding="4" maxW="full" {...rest}>
            <Flex>
                <Heading fontSize="2xl" mb={4} flex={1}>
                    Invest in pool
                </Heading>
                <Settings />
            </Flex>
            {pool.investConfig.options.map((option, index) => {
                const tokenOption = option.tokenOptions[0];

                const userBalance = tokenGetAmountForAddress(tokenOption.address, userBalances);

                return (
                    <Box key={index} mb={4}>
                        <InputGroup>
                            <InputLeftElement pointerEvents="none" height="full" justifyContent="flex-start" ml={1}>
                                <TokenAvatar address={tokenOption.address} size="xs" mr={2} />
                                <Text>{tokenOption.symbol}</Text>
                            </InputLeftElement>
                            <Input
                                type="number"
                                placeholder={investState.proportionalAmounts[option.poolTokenAddress] || '0.0'}
                                textAlign="right"
                                size="lg"
                                value={investState.inputAmounts[option.poolTokenAddress] || ''}
                                onChange={(e) => {
                                    setInputAmount(option.poolTokenAddress, e.target.value);
                                }}
                            />
                        </InputGroup>
                        <Text color="gray.500">
                            Balance: {userBalance}
                            {parseFloat(userBalance) > 0 ? (
                                <Link
                                    ml={2}
                                    color="green.300"
                                    userSelect="none"
                                    onClick={() => {
                                        setInputAmount(option.poolTokenAddress, userBalance);
                                    }}
                                >
                                    Max
                                </Link>
                            ) : null}
                        </Text>
                    </Box>
                );
            })}
            <Button width="full" bgColor="green.400" mt={4}>
                Invest
            </Button>
        </Container>
    );
}

export default PoolInvestForm;
