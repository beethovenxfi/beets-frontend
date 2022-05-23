import {
    Box,
    Container,
    ContainerProps,
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    Link,
    Text,
} from '@chakra-ui/react';
import { GqlPoolInvestOption } from '~/apollo/generated/graphql-codegen-generated';
import { useGetTokens } from '~/lib/global/useToken';
import TokenAvatar from '~/components/token/TokenAvatar';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import { parseUnits } from 'ethers/lib/utils';

interface Props extends ContainerProps {
    userBalances: TokenAmountHumanReadable[];
    option: GqlPoolInvestOption;
    setInputAmount: (address: string, amount: AmountHumanReadable) => void;
    value?: string;
    proportionalAmount?: string;
}

export function PoolInvestFormTokenInput({
    userBalances,
    option,
    setInputAmount,
    value,
    proportionalAmount,
    ...rest
}: Props) {
    const { priceFor } = useGetTokens();

    //TODO: add support for multiple options
    const tokenOption = option.tokenOptions[0];
    const userBalance = tokenGetAmountForAddress(tokenOption.address, userBalances);
    const isValid =
        !value || parseUnits(value, tokenOption.decimals).lte(parseUnits(userBalance, tokenOption.decimals));

    return (
        <Container {...rest}>
            <InputGroup>
                <InputLeftElement pointerEvents="none" height="full" justifyContent="flex-start" ml={1}>
                    <TokenAvatar address={tokenOption.address} size="xs" mr={2} />
                    <Text>{tokenOption.symbol}</Text>
                </InputLeftElement>
                <Input
                    type="number"
                    placeholder={proportionalAmount || '0.0'}
                    textAlign="right"
                    size="lg"
                    value={value || ''}
                    onChange={(e) => {
                        setInputAmount(option.poolTokenAddress, e.target.value);
                    }}
                    isInvalid={!isValid}
                />
            </InputGroup>
            <Flex>
                <Box flex={1}>
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
                {!value && proportionalAmount ? (
                    <Box>
                        <Link
                            color="green.300"
                            userSelect="none"
                            onClick={() => {
                                setInputAmount(option.poolTokenAddress, proportionalAmount);
                            }}
                        >
                            Proportional suggestion
                        </Link>
                    </Box>
                ) : null}
            </Flex>
            {!isValid ? <Text color="red.500">Exceeds wallet balance</Text> : null}
        </Container>
    );
}
