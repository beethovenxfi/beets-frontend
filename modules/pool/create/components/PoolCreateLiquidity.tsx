import {
    Box,
    Button,
    HStack,
    VStack,
    Text,
    FormControl,
    Input,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Tfoot,
    InputGroup,
    InputLeftElement,
} from '@chakra-ui/react';
import { usePoolCreate } from '../../lib/usePoolCreate';
import { ArrowLeft, ArrowRight, Trash2 } from 'react-feather';
import { useGetTokens } from '~/lib/global/useToken';
import { SetStateAction } from 'react';
import { PoolCreateState } from '../PoolCreate';
import { Formik, Field, FieldArray } from 'formik';
import TokenAvatar from '~/components/token/TokenAvatar';
import { GqlToken } from '~/apollo/generated/graphql-codegen-generated';

interface Props {
    changeState: (state: SetStateAction<PoolCreateState>) => void;
}

interface GqlTokenWithWeight extends GqlToken {
    weight: number;
}

export function PoolCreateLiquidity({ changeState }: Props) {
    const { tokenDetails, setTokenDetails } = usePoolCreate();
    const { priceFor, formattedPrice, getToken } = useGetTokens();

    const tokenPrice = (address: string, amount = '1') =>
        formattedPrice({
            address: address || '',
            amount,
        });

    const tokens = tokenDetails.map((token) => ({
        ...getToken(token.address),
        weight: token.weight,
        amount: 0,
    }));

    const initialValues = () => {
        const total = 100;
        const updatedTokens = tokens.map((token) => ({
            ...token,
            amount: (total * (token.weight / 100)) / priceFor(token.address || ''),
        }));
        return {
            tokens: updatedTokens,
            total,
        };
    };

    return (
        <>
            <Formik
                enableReinitialize
                initialValues={initialValues()}
                onSubmit={(values) => {
                    console.log(values);
                    // const tokens = values.tokens as GqlTokenWithWeight[];
                    // const tokenDetails = tokens.map((token) => ({ address: token?.address, weight: token?.weight }));
                    // setTokenDetails(tokenDetails);
                    changeState('confirm');
                }}
            >
                {({ handleSubmit, handleChange, handleBlur, values, errors, touched }) => (
                    <form onSubmit={handleSubmit}>
                        <VStack
                            minHeight="550px"
                            alignItems="flex-start"
                            height="full"
                            width="full"
                            justifyContent="space-between"
                        >
                            <VStack width="full">
                                <TableContainer width="full">
                                    <Table size="sm">
                                        <Thead>
                                            <Tr>
                                                <Th width="25%">Token</Th>
                                                <Th width="10%">Price</Th>
                                                <Th width="10%">Weight</Th>
                                                <Th width="25%" isNumeric>
                                                    Amount
                                                </Th>
                                                <Th width="30%" textAlign="right">
                                                    Value
                                                </Th>
                                                <Th></Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            <FieldArray name="tokens">
                                                {({ insert, remove, push }) =>
                                                    values.tokens.map((token, index) => (
                                                        <Tr key={index}>
                                                            <Td>
                                                                <HStack>
                                                                    <TokenAvatar address={token?.address} size="xs" />
                                                                    <Text
                                                                        ml="2"
                                                                        overflow="hidden"
                                                                        textOverflow="ellipsis"
                                                                        whiteSpace="nowrap"
                                                                    >
                                                                        {token?.symbol}
                                                                    </Text>
                                                                </HStack>
                                                            </Td>
                                                            <Td>
                                                                <Text>{tokenPrice(token?.address || '')}</Text>
                                                            </Td>
                                                            <Td textAlign="right">{token.weight}%</Td>
                                                            <Td isNumeric>
                                                                <FormControl>
                                                                    <Input
                                                                        textAlign="right"
                                                                        as={Field}
                                                                        id={`tokens.${index}.amount`}
                                                                        name={`tokens.${index}.amount`}
                                                                        variant="flushed"
                                                                        type="number"
                                                                        onBlur={handleBlur}
                                                                    />
                                                                </FormControl>
                                                            </Td>
                                                            <Td>
                                                                <Text textAlign="right">
                                                                    {tokenPrice(
                                                                        token?.address || '',
                                                                        values.tokens[index].amount.toString(),
                                                                    )}
                                                                </Text>
                                                            </Td>
                                                            <Td>
                                                                <Trash2
                                                                    size={16}
                                                                    onClick={() => remove(index)}
                                                                    cursor="pointer"
                                                                />
                                                            </Td>
                                                        </Tr>
                                                    ))
                                                }
                                            </FieldArray>
                                        </Tbody>
                                        <Tfoot>
                                            <Tr></Tr>
                                            <Tr>
                                                <Td textAlign="right" colSpan={4}>
                                                    <Text>Total:</Text>
                                                </Td>
                                                <Td>
                                                    <FormControl>
                                                        <InputGroup>
                                                            <InputLeftElement ml={-7} pointerEvents="none">
                                                                <Text>$</Text>
                                                            </InputLeftElement>
                                                            <Input
                                                                pl={0}
                                                                textAlign="right"
                                                                as={Field}
                                                                id="total"
                                                                name="total"
                                                                variant="flushed"
                                                                type="number"
                                                                onBlur={handleBlur}
                                                            />
                                                        </InputGroup>
                                                    </FormControl>
                                                </Td>
                                            </Tr>
                                        </Tfoot>
                                    </Table>
                                </TableContainer>
                            </VStack>

                            <HStack alignSelf="end" justifyContent="space-between" width="full">
                                <Button variant="primary" width="25%" onClick={() => changeState('tokens')}>
                                    <HStack alignContent="space-evenly">
                                        <ArrowLeft size={16} />
                                        <Text>Previous</Text>
                                    </HStack>
                                </Button>
                                <Button variant="primary" type="submit" width="25%">
                                    <HStack alignContent="space-evenly">
                                        <Text>Next</Text>
                                        <ArrowRight size={16} />
                                    </HStack>
                                </Button>
                            </HStack>
                        </VStack>
                    </form>
                )}
            </Formik>
        </>
    );
}
