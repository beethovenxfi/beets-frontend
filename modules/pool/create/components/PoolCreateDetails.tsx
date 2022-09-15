import {
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Text,
    VStack,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { SetStateAction } from 'react';
import { ArrowRight } from 'react-feather';
import { usePoolCreate } from '../../lib/usePoolCreate';
import { PoolCreateState } from '../PoolCreate';

interface Props {
    changeState: (state: SetStateAction<PoolCreateState>) => void;
}

export function PoolCreateDetails({ changeState }: Props) {
    const { poolDetails, setPoolDetails } = usePoolCreate();

    return (
        <Formik
            initialValues={poolDetails}
            onSubmit={(values) => {
                setPoolDetails(values);
                changeState('tokens');
            }}
        >
            {({ handleSubmit, errors, touched }) => (
                <form onSubmit={handleSubmit}>
                    <VStack minHeight="500px" justifyContent="space-between">
                        <VStack spacing={4} width="full">
                            <FormControl>
                                <FormLabel>Pool name</FormLabel>
                                <Field as={Input} id="name" name="name" variant="flushed" type="text" />
                                <FormHelperText>The maximum number of characters is ??.</FormHelperText>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Pool Owner</FormLabel>
                                <Field as={Input} id="owner" name="owner" variant="flushed" isReadOnly type="text" />
                                <FormHelperText>This can&apos;t be changed.</FormHelperText>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Pool Symbol</FormLabel>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <Text>BPT-</Text>
                                    </InputLeftElement>
                                    <Input as={Field} id="symbol" name="symbol" variant="flushed" type="text" />
                                </InputGroup>
                                <FormHelperText>The maximum number of characters is ??.</FormHelperText>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Swap fee percentage</FormLabel>
                                <InputGroup>
                                    <Field as={Input} id="fee" name="fee" variant="flushed" type="number" />
                                    <InputRightElement pointerEvents="none">
                                        <Text>%</Text>
                                    </InputRightElement>
                                </InputGroup>
                                <FormHelperText>The percentage should between 0 and 10%?.</FormHelperText>
                            </FormControl>
                        </VStack>

                        <Button variant="primary" type="submit" width="25%" alignSelf="flex-end">
                            <HStack alignContent="space-evenly">
                                <Text>Next</Text>
                                <ArrowRight size={16} />
                            </HStack>
                        </Button>
                    </VStack>
                </form>
            )}
        </Formik>
    );
}
