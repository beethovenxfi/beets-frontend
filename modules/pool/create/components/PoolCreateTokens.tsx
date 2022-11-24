import {
    Box,
    Button,
    HStack,
    useDisclosure,
    VStack,
    Text,
    FormControl,
    Input,
    InputGroup,
    InputRightElement,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Tfoot,
    InputLeftElement,
    FormErrorMessage,
} from '@chakra-ui/react';
import { PoolCreateTokenSelectModal } from './token-select/PoolCreateTokenSelectModal';
import { usePoolCreate } from '../../lib/usePoolCreate';
import { ArrowLeft, ArrowRight, Trash2 } from 'react-feather';
import { useGetTokens } from '~/lib/global/useToken';
import { SetStateAction, useEffect } from 'react';
import { PoolCreateState } from '../PoolCreate';
import { Formik, Field, FieldArray, useField, useFormikContext, FieldInputProps, getIn } from 'formik';
import TokenAvatar from '~/components/token/TokenAvatar';
import { GqlToken } from '~/apollo/generated/graphql-codegen-generated';
import * as Yup from 'yup';

interface Props {
    changeState: (state: SetStateAction<PoolCreateState>) => void;
}

interface GqlTokenWithWeight extends GqlToken {
    weight: number;
    amount: number;
}

interface Values {
    tokens: GqlTokenWithWeight[];
    total: number;
}

interface CustomFieldInputProps {
    index: number;
}

export function PoolCreateTokens({ changeState }: Props) {
    const tokenSelectDisclosure = useDisclosure();
    const { tokensSelected, tokenDetails, setTokenDetails } = usePoolCreate();
    const { priceFor, formattedPrice, getToken } = useGetTokens();

    const tokenPrice = (address: string, amount = '1') =>
        formattedPrice({
            address: address || '',
            amount,
        });

    const tokenAmount = (token: any, total: number) => {
        const weight = token?.weight || 0;
        const price = priceFor(token?.address || '');
        return (total * (weight / 100)) / price;
    };

    const lastTokenWeight = (tokens: any[]) => {
        const tokensCopy = [...tokens];
        tokensCopy.pop();
        return 100 - tokensCopy.reduce((total, token) => total + token.weight, 0);
    };

    const tokens =
        tokenDetails.length !== 0
            ? tokenDetails.map((token) => ({ ...getToken(token.address), weight: token.weight, amount: token.amount }))
            : tokensSelected.map((address) => ({ ...getToken(address), weight: null, amount: 0 }));

    const initialValues = {
        tokens: tokens,
        total: 100,
    };

    const AmountField = (props: CustomFieldInputProps & FieldInputProps<number>) => {
        const { values, setFieldValue } = useFormikContext();
        const valuesTyped = values as Values;

        const [field, meta] = useField(props);

        const amount = tokenAmount(valuesTyped.tokens[props.index], valuesTyped.total);

        useEffect(() => {
            setFieldValue(props.name, amount);
        }, [amount, setFieldValue, props.name]);

        return (
            <>
                <input {...props} {...field} />
                {!!meta.touched && !!meta.error && <div>{meta.error}</div>}
            </>
        );
    };

    const validationSchema = Yup.object({
        tokens: Yup.array(
            Yup.object({
                weight: Yup.number().required().min(2, 'Minimum = 2%').max(98, 'Maximum = 98%'),
                amount: Yup.number().required(),
            }),
        ),
        total: Yup.number().required().min(0),
    });

    return (
        <>
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={initialValues}
                onSubmit={(values) => {
                    const tokens = values.tokens as GqlTokenWithWeight[];
                    const tokenDetails = tokens.map((token) => ({
                        address: token?.address,
                        weight: token?.weight,
                        amount: token?.amount,
                    }));
                    setTokenDetails(tokenDetails);
                    //changeState('liquidity');
                }}
            >
                {({ handleSubmit, handleBlur, setFieldValue, values, errors, touched }) => (
                    <form onSubmit={handleSubmit}>
                        <VStack
                            minHeight="550px"
                            alignItems="flex-start"
                            height="full"
                            width="full"
                            justifyContent="space-between"
                        >
                            <VStack width="full">
                                {tokens.length === 0 ? (
                                    <Box>No tokens selected yet</Box>
                                ) : (
                                    <TableContainer width="full">
                                        <Table>
                                            <Thead>
                                                <Tr>
                                                    <Th width="20%">Token</Th>
                                                    <Th width="20%">Price</Th>
                                                    <Th width="15%" isNumeric>
                                                        Weight
                                                    </Th>
                                                    <Th width="25%" isNumeric>
                                                        Amount
                                                    </Th>
                                                    <Th width="20%" textAlign="right">
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
                                                                        <TokenAvatar
                                                                            address={token?.address}
                                                                            size="xs"
                                                                        />
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
                                                                <Td>
                                                                    <FormControl
                                                                        isInvalid={Boolean(
                                                                            getIn(errors, `tokens.${index}.weight`),
                                                                        )}
                                                                    >
                                                                        <InputGroup>
                                                                            <Input
                                                                                textAlign="right"
                                                                                as={Field}
                                                                                id={`tokens.${index}.weight`}
                                                                                name={`tokens.${index}.weight`}
                                                                                variant="flushed"
                                                                                type="number"
                                                                                onBlur={(e) => {
                                                                                    console.log(errors.tokens);
                                                                                    handleBlur(e);
                                                                                    const amount = tokenAmount(
                                                                                        token,
                                                                                        values.total,
                                                                                    );
                                                                                    setFieldValue(
                                                                                        `tokens.${index}.amount`,
                                                                                        amount,
                                                                                    );
                                                                                    setFieldValue(
                                                                                        `tokens.${
                                                                                            values.tokens.length - 1
                                                                                        }.weight`,
                                                                                        lastTokenWeight(values.tokens),
                                                                                    );
                                                                                }}
                                                                                isDisabled={
                                                                                    index === values.tokens.length - 1
                                                                                }
                                                                            />
                                                                            <InputRightElement pointerEvents="none">
                                                                                <Text>%</Text>
                                                                            </InputRightElement>
                                                                        </InputGroup>
                                                                        <FormErrorMessage>
                                                                            {getIn(errors, `tokens.${index}.weight`)}
                                                                        </FormErrorMessage>
                                                                    </FormControl>
                                                                </Td>
                                                                <Td isNumeric>
                                                                    <FormControl>
                                                                        <Input
                                                                            textAlign="right"
                                                                            as={AmountField}
                                                                            id={`tokens.${index}.amount`}
                                                                            name={`tokens.${index}.amount`}
                                                                            variant="flushed"
                                                                            type="number"
                                                                            index={index}
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
                                                        <Text>Total liquidity to add :</Text>
                                                    </Td>
                                                    <Td>
                                                        <FormControl>
                                                            <InputGroup>
                                                                <InputLeftElement ml={-3} pointerEvents="none">
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
                                )}
                            </VStack>

                            <HStack alignSelf="end" justifyContent="space-between" width="full">
                                <Button variant="primary" width="25%" onClick={() => changeState('details')}>
                                    <HStack alignContent="space-evenly">
                                        <ArrowLeft size={16} />
                                        <Text>Previous</Text>
                                    </HStack>
                                </Button>
                                <Button variant="primary" width="30%" onClick={() => tokenSelectDisclosure.onOpen()}>
                                    Select tokens
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

            <PoolCreateTokenSelectModal
                isOpen={tokenSelectDisclosure.isOpen}
                onOpen={tokenSelectDisclosure.onOpen}
                onClose={tokenSelectDisclosure.onClose}
            />
        </>
    );
}
