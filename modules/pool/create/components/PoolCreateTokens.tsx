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
} from '@chakra-ui/react';
import { PoolCreateTokenSelectModal } from './token-select/PoolCreateTokenSelectModal';
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

export function PoolCreateTokens({ changeState }: Props) {
    const tokenSelectDisclosure = useDisclosure();
    const { tokensSelected, tokenDetails, setTokenDetails } = usePoolCreate();
    const { getToken } = useGetTokens();
    console.log(tokenDetails);

    const tokens =
        tokenDetails.length !== 0
            ? tokenDetails.map((token) => ({ ...getToken(token.address), weight: token.weight }))
            : tokensSelected.map((address) => ({ ...getToken(address), weight: null }));

    const initialValues = {
        tokens: tokens,
    };

    return (
        <>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={(values) => {
                    const tokens = values.tokens as GqlTokenWithWeight[];
                    const tokenDetails = tokens.map((token) => ({ address: token?.address, weight: token?.weight }));
                    setTokenDetails(tokenDetails);
                    changeState('liquidity');
                }}
            >
                {({ handleSubmit, values, errors, touched }) => (
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
                                        <Table size="sm">
                                            <Thead>
                                                <Tr>
                                                    <Th width="60%">Token</Th>
                                                    <Th width="35%" textAlign="right">
                                                        Weight
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
                                                                    <FormControl>
                                                                        <InputGroup>
                                                                            <Input
                                                                                textAlign="right"
                                                                                as={Field}
                                                                                id={`tokens.${index}.weight`}
                                                                                name={`tokens.${index}.weight`}
                                                                                variant="flushed"
                                                                                type="number"
                                                                            />
                                                                            <InputRightElement pointerEvents="none">
                                                                                <Text>%</Text>
                                                                            </InputRightElement>
                                                                        </InputGroup>
                                                                    </FormControl>
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
