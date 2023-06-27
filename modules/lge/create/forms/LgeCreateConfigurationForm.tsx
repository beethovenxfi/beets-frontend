import { useForm } from 'react-hook-form';
import {
    FormErrorMessage,
    FormLabel,
    FormControl,
    Input,
    Button,
    Grid,
    GridItem,
    HStack,
    Spacer,
    InputGroup,
    InputRightElement,
    Text,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import PercentageInput, { format, parse } from './components/PercentageInput';

export interface ConfigurationFormData {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    collateralTokenAddress: string;
    tokenAmount: string;
    collateralAmount: string;
    tokenStartWeight: number;
    collateralStartWeight: number;
    tokenEndWeight: number;
    collateralEndWeight: number;
    swapFeePercentage: string;
    poolName: string;
    poolSymbol: string;
}

const defaultValues = {
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    collateralTokenAddress: '',
    tokenAmount: '',
    collateralAmount: '',
    tokenStartWeight: 95,
    collateralStartWeight: 5,
    tokenEndWeight: 50,
    collateralEndWeight: 50,
    swapFeePercentage: '2',
    poolName: '',
    poolSymbol: '',
};

interface Props {
    setActiveStep: Dispatch<SetStateAction<number>>;
    setConfigurationFormData: Dispatch<SetStateAction<ConfigurationFormData | undefined>>;
    values: ConfigurationFormData | undefined;
}

export default function LgeCreateConfigurationForm({ setActiveStep, setConfigurationFormData, values }: Props) {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm<ConfigurationFormData>({
        defaultValues,
        values,
        resetOptions: {
            keepDefaultValues: true,
        },
    });

    const [swapFeePercentage, setSwapFeePercentage] = useState(defaultValues.swapFeePercentage);

    function onSubmit(values: ConfigurationFormData): void {
        console.log({ values });
        setActiveStep(1);
        setConfigurationFormData(values);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="4" width="full">
                <GridItem>
                    <FormControl isInvalid={!!errors.poolName} isRequired>
                        <FormLabel htmlFor="poolName">Pool name</FormLabel>
                        <Input
                            id="poolName"
                            {...register('poolName', {
                                required: 'This is required',
                            })}
                        />
                        <FormErrorMessage>{errors.poolName && errors.poolName.message}</FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors.poolSymbol} h="full" isRequired>
                        <FormLabel htmlFor="poolSymbol">Pool symbol</FormLabel>
                        <Input
                            id="poolSymbol"
                            {...register('poolSymbol', {
                                required: 'This is required',
                            })}
                        />
                        <FormErrorMessage>{errors.poolSymbol && errors.poolSymbol.message}</FormErrorMessage>
                    </FormControl>
                </GridItem>

                <GridItem>
                    <FormControl isInvalid={!!errors.startDate} isRequired>
                        <FormLabel htmlFor="startDate">Start date</FormLabel>
                        <Input
                            id="startDate"
                            {...register('startDate', {
                                required: 'This is required',
                            })}
                        />
                        <FormErrorMessage>{errors.startDate && errors.startDate.message}</FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors.startTime} isRequired>
                        <FormLabel htmlFor="startTime">Start time</FormLabel>
                        <Input
                            id="startTime"
                            {...register('startTime', {
                                required: 'This is required',
                            })}
                        />
                        <FormErrorMessage>{errors.startTime && errors.startTime.message}</FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors.endDate} isRequired>
                        <FormLabel htmlFor="endDate">End date</FormLabel>
                        <Input
                            id="endDate"
                            {...register('endDate', {
                                required: 'This is required',
                            })}
                        />
                        <FormErrorMessage>{errors.endDate && errors.endDate.message}</FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors.endTime} isRequired>
                        <FormLabel htmlFor="endTime">End time</FormLabel>
                        <Input
                            id="endTime"
                            {...register('endTime', {
                                required: 'This is required',
                            })}
                        />
                        <FormErrorMessage>{errors.endTime && errors.endTime.message}</FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors.swapFeePercentage} isRequired>
                        <FormLabel htmlFor="swapFeePercentage">Swap fee percentage</FormLabel>
                        <PercentageInput
                            id="swapFeePercentage"
                            {...(register('swapFeePercentage'),
                            {
                                min: 0,
                                max: 10,
                                onChange: (valueString: string) => {
                                    const value = parse(valueString);
                                    setSwapFeePercentage(value);
                                    setValue('swapFeePercentage', value);
                                },
                                value: format(swapFeePercentage),
                            })}
                        />
                        <FormErrorMessage>
                            {errors.swapFeePercentage && errors.swapFeePercentage.message}
                        </FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl>
                        <FormLabel htmlFor="platformFeePercentage">Platform fee percentage</FormLabel>
                        <InputGroup>
                            <Input id="platformFeePercentage" value={2} isReadOnly />
                            <InputRightElement pointerEvents="none">
                                <Text>%</Text>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                </GridItem>
            </Grid>

            <HStack>
                <Button mt={4} colorScheme="teal" onClick={() => reset()}>
                    Clear form
                </Button>
                <Spacer />
                <Button mt={4} colorScheme="teal" onClick={() => setActiveStep(0)}>
                    Prev
                </Button>
                <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
                    Next
                </Button>
            </HStack>
        </form>
    );
}
