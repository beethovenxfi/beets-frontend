import { Box, Button, HStack, useDisclosure, VStack, Text, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { PoolCreateTokenSelectModal } from './token-select/PoolCreateTokenSelectModal';
import { usePoolCreate } from '../../lib/usePoolCreate';
import { ArrowLeft, ArrowRight } from 'react-feather';
import { useGetTokens } from '~/lib/global/useToken';
import { SetStateAction } from 'react';
import { PoolCreateState } from '../PoolCreate';
import { Formik, Field, FieldArray } from 'formik';

interface Props {
    changeState: (state: SetStateAction<PoolCreateState>) => void;
}

export function PoolCreateTokens({ changeState }: Props) {
    const tokenSelectDisclosure = useDisclosure();
    const { tokensSelected } = usePoolCreate();
    const { getToken } = useGetTokens();

    const tokens = tokensSelected.map((address) => getToken(address));

    const initialValues = {
        tokens: tokens,
    };

    console.log(tokens);

    return (
        <>
            <VStack minHeight="500px" height="full" width="full" alignItems="flex-start" justifyContent="space-between">
                {tokens.length === 0 ? (
                    <Box>No tokens selected yet</Box>
                ) : (
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values) => {
                            console.log(values);
                        }}
                    >
                        {({ handleSubmit, values, errors, touched }) => (
                            <>
                                <Box>
                                    {values.tokens.map((token) => (
                                        <Text>{token.name}</Text>
                                    ))}
                                </Box>
                                <form onSubmit={handleSubmit}>
                                    {/* <FieldArray name="tokens">
            {({ insert, remove, push }) => (
                                {values.tokens.map((token, index) => (
                                    <FormControl key={index}>
                                        <FormLabel>{`tokens.${index}.name`}</FormLabel>
                                        <Field
                                            as={Input}
                                            id={`tokens.${index}.weight`}
                                            name={`tokens.${index}.weight`}
                                            variant="flushed"
                                            type="number"
                                        />
                                    </FormControl>
                                ))})}
                                </FieldArray> */}

                                    <HStack alignSelf="end" justifyContent="space-between" width="full">
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            width="25%"
                                            onClick={() => changeState('details')}
                                        >
                                            <HStack alignContent="space-evenly">
                                                <ArrowLeft size={16} />
                                                <Text>Previous</Text>
                                            </HStack>
                                        </Button>
                                        <Button
                                            variant="primary"
                                            width="25%"
                                            onClick={() => tokenSelectDisclosure.onOpen()}
                                        >
                                            Select tokens
                                        </Button>
                                        <Button variant="primary" type="submit" width="25%">
                                            <HStack alignContent="space-evenly">
                                                <Text>Next</Text>
                                                <ArrowRight size={16} />
                                            </HStack>
                                        </Button>
                                    </HStack>
                                </form>
                            </>
                        )}
                    </Formik>
                )}
            </VStack>

            <PoolCreateTokenSelectModal
                isOpen={tokenSelectDisclosure.isOpen}
                onOpen={tokenSelectDisclosure.onOpen}
                onClose={tokenSelectDisclosure.onClose}
            />
        </>
    );
}
