import {
    Box,
    Button,
    HStack,
    useDisclosure,
    VStack,
    Text,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react';
import { PoolCreateTokenSelectModal } from './token-select/PoolCreateTokenSelectModal';
import { usePoolCreate } from '../../lib/usePoolCreate';
import { ArrowLeft, ArrowRight } from 'react-feather';
import { useGetTokens } from '~/lib/global/useToken';
import { SetStateAction } from 'react';
import { PoolCreateState } from '../PoolCreate';
import { Formik, Field, FieldArray } from 'formik';
import TokenAvatar from '~/components/token/TokenAvatar';

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

    return (
        <>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={(values) => {
                    console.log(values);
                }}
            >
                {({ handleSubmit, values, errors, touched }) => (
                    <form onSubmit={handleSubmit}>
                        <VStack minHeight="500px" height="full" width="full" justifyContent="space-between">
                            <VStack alignItems="flex-start" width="full">
                                {tokens.length === 0 ? (
                                    <Box>No tokens selected yet</Box>
                                ) : (
                                    <FieldArray name="tokens">
                                        {({ insert, remove, push }) =>
                                            values.tokens.map((token, index) => (
                                                <HStack key={index} width="full" justifyContent="space-between">
                                                    <HStack>
                                                        <TokenAvatar address={token?.address} size="xs" />
                                                        <Text ml="2">{token?.symbol}</Text>
                                                    </HStack>

                                                    <FormControl width="75%">
                                                        <InputGroup>
                                                            <Input
                                                                style={{ textAlign: 'right' }}
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
                                                </HStack>
                                            ))
                                        }
                                    </FieldArray>
                                )}
                            </VStack>

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
                                <Button variant="primary" width="25%" onClick={() => tokenSelectDisclosure.onOpen()}>
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
