import { Controller, useForm } from 'react-hook-form';
import {
    FormErrorMessage,
    FormLabel,
    FormControl,
    Input,
    Button,
    Grid,
    GridItem,
    HStack,
    Text,
    FormHelperText,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useState } from 'react';
import PercentageInput, { format, parse as parseInput } from '~/components/inputs/PercentageInput';
import { SliderInput } from '~/components/inputs/SliderInput';
import { ChakraStylesConfig, Select } from 'chakra-react-select';

export interface ConfigurationFormData {
    startDate: string;
    endDate: string;
    collateralAddress: string;
    tokenAmount: string;
    collateralAmount: string;
    tokenStartWeight: string;
    collateralStartWeight: string;
    tokenEndWeight: string;
    collateralEndWeight: string;
    swapFee: string;
    poolName: string;
    poolSymbol: string;
}

export const defaultValues: ConfigurationFormData = {
    startDate: '',
    endDate: '',
    collateralAddress: '',
    tokenAmount: '',
    collateralAmount: '',
    tokenStartWeight: '95',
    collateralStartWeight: '5',
    tokenEndWeight: '50',
    collateralEndWeight: '50',
    swapFee: '2',
    poolName: '',
    poolSymbol: '',
};

interface Props {
    setActiveStep: Dispatch<SetStateAction<number>>;
    setConfigurationFormData: Dispatch<SetStateAction<ConfigurationFormData>>;
    values: ConfigurationFormData;
    tokenSymbol: string;
}

export default function LgeCreateConfigurationForm({
    setActiveStep,
    setConfigurationFormData,
    values,
    tokenSymbol,
}: Props) {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        control,
    } = useForm<ConfigurationFormData>({
        defaultValues,
        values,
        resetOptions: {
            keepDefaultValues: true,
        },
    });

    const [swapFee, setSwapFee] = useState(defaultValues.swapFee);
    const [tokenStartWeight, setTokenStartWeight] = useState(defaultValues.tokenStartWeight);
    const [tokenEndWeight, setTokenEndWeight] = useState(defaultValues.tokenEndWeight);

    interface TokenOption {
        value: string;
        label: string;
    }

    const collateralTokenOptions = [
        { value: '0x04068da6c83afcfa0e13ba15a6696662335d5b75', label: 'USDC' },
        { value: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', label: 'wFTM' },
    ];

    const chakraStyles: ChakraStylesConfig = {
        dropdownIndicator: (provided) => ({
            ...provided,
            background: 'rgba(255,255,255,0.08)',
            p: 0,
            w: '40px',
        }),
        option: (provided, state) => ({
            ...provided,
            background: state.isFocused ? 'beets.base.600' : 'transparent',
        }),
        menuList: (provided) => ({
            ...provided,
            background: 'beets.base.800',
        }),
    };

    function onSubmit(values: ConfigurationFormData): void {
        setActiveStep(2);
        setConfigurationFormData(values);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid templateColumns={{ base: '1fr 1fr', lg: 'repeat(4, 1fr)' }} gap="4" width="full">
                <GridItem colSpan={2}>
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
                <GridItem colSpan={2}>
                    <FormControl isInvalid={!!errors.poolSymbol} isRequired>
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
                <GridItem colSpan={2}>
                    <FormControl isInvalid={!!errors.startDate} isRequired>
                        <FormLabel htmlFor="startDate">Start date</FormLabel>
                        <Input
                            id="startDate"
                            type="datetime-local"
                            {...register('startDate', {
                                required: 'This is required',
                            })}
                        />
                        <FormErrorMessage>{errors.startDate && errors.startDate.message}</FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem colSpan={2}>
                    <FormControl isInvalid={!!errors.endDate} isRequired>
                        <FormLabel htmlFor="endDate">End date</FormLabel>
                        <Input
                            id="endDate"
                            type="datetime-local"
                            {...register('endDate', {
                                required: 'This is required',
                            })}
                        />
                        <FormErrorMessage>{errors.endDate && errors.endDate.message}</FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem colSpan={2}>
                    <FormControl isInvalid={!!errors.swapFee} isRequired>
                        <FormLabel htmlFor="swapFee">Swap fee</FormLabel>
                        <PercentageInput
                            id="swapFee"
                            {...(register('swapFee'),
                            {
                                min: 0,
                                max: 10,
                                onChange: (valueString: string) => {
                                    const value = parseInput(valueString);
                                    setSwapFee(value);
                                    setValue('swapFee', value);
                                },
                                value: format(swapFee),
                            })}
                        />
                        <FormErrorMessage>{errors.swapFee && errors.swapFee.message}</FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem colSpan={2}>
                    <FormControl>
                        <FormLabel htmlFor="platformFee">Platform fee</FormLabel>
                        <Input id="platformFee" value="2%" isReadOnly />
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isReadOnly>
                        <FormLabel htmlFor="launchTokenSymbol">Launch token</FormLabel>
                        <Input id="launchTokenSymbol" value={tokenSymbol} />
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors.tokenAmount} isRequired>
                        <FormLabel htmlFor="tokenAmount">Amount</FormLabel>
                        <Input
                            id="tokenAmount"
                            {...register('tokenAmount', {
                                required: 'This is required',
                            })}
                        />
                        <FormErrorMessage>{errors.tokenAmount && errors.tokenAmount.message}</FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors.collateralAddress} isRequired>
                        <FormLabel htmlFor="collateralAddress">Collateral token</FormLabel>
                        <Controller
                            name="collateralAddress"
                            control={control}
                            rules={{ required: 'This is required' }}
                            render={({
                                field: { onChange, onBlur, value, name, ref },
                                fieldState: { invalid, error },
                            }) => (
                                <>
                                    <Select
                                        name={name}
                                        ref={ref}
                                        onBlur={onBlur}
                                        value={
                                            collateralTokenOptions && value
                                                ? collateralTokenOptions.find((option) => option.value === value)
                                                : null
                                        }
                                        onChange={(option) => onChange((option as TokenOption).value || '')}
                                        placeholder="Select..."
                                        options={collateralTokenOptions}
                                        isSearchable={false}
                                        isInvalid={invalid}
                                        errorBorderColor="red.300"
                                        useBasicStyles
                                        selectedOptionStyle="check"
                                        chakraStyles={chakraStyles}
                                    />
                                    <FormErrorMessage>{error && error.message}</FormErrorMessage>
                                </>
                            )}
                        />
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors.collateralAmount} isRequired>
                        <FormLabel htmlFor="collateralAmount">Amount</FormLabel>
                        <Input
                            id="collateralAmount"
                            {...register('collateralAmount', {
                                required: 'This is required',
                            })}
                        />
                        <FormErrorMessage>
                            {errors.collateralAmount && errors.collateralAmount.message}
                        </FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem colSpan={2}>
                    <FormControl isInvalid={!!errors.tokenStartWeight} isRequired>
                        <FormLabel htmlFor="tokenStartWeight">Start weights</FormLabel>
                        <SliderInput
                            id="tokenStartWeight"
                            {...(register('tokenStartWeight'),
                            {
                                min: 1,
                                max: 99,
                                onChange: (value: string) => {
                                    setTokenStartWeight(value);
                                    setValue('tokenStartWeight', value);
                                    setValue('collateralStartWeight', (100 - parseInt(value)).toString());
                                },
                                value: tokenStartWeight,
                            })}
                        />
                        {!errors.tokenStartWeight ? (
                            <FormHelperText>
                                <HStack justifyContent="space-between">
                                    <Text>Launch token</Text>
                                    <Text>Collateral token</Text>
                                </HStack>
                            </FormHelperText>
                        ) : (
                            <FormErrorMessage>
                                {errors.tokenStartWeight && errors.tokenStartWeight.message}
                            </FormErrorMessage>
                        )}
                    </FormControl>
                </GridItem>
                <GridItem colSpan={2}>
                    <FormControl isInvalid={!!errors.tokenEndWeight} isRequired>
                        <FormLabel htmlFor="tokenEndWeight">End weights</FormLabel>
                        <SliderInput
                            id="tokenEndWeight"
                            {...(register('tokenEndWeight'),
                            {
                                min: 1,
                                max: 99,
                                onChange: (value: string) => {
                                    setTokenEndWeight(value);
                                    setValue('tokenEndWeight', value);
                                    setValue('collateralEndWeight', (100 - parseInt(value)).toString());
                                },
                                value: tokenEndWeight,
                            })}
                        />
                        {!errors.tokenEndWeight ? (
                            <FormHelperText>
                                <HStack justifyContent="space-between">
                                    <Text>Launch token</Text>
                                    <Text>Collateral token</Text>
                                </HStack>
                            </FormHelperText>
                        ) : (
                            <FormErrorMessage>
                                {errors.tokenEndWeight && errors.tokenEndWeight.message}
                            </FormErrorMessage>
                        )}
                    </FormControl>
                </GridItem>
            </Grid>

            <HStack justifyContent="space-between" mt="8">
                <Button mt={4} colorScheme="teal" onClick={() => setActiveStep(0)}>
                    Prev
                </Button>
                <Button mt={4} colorScheme="teal" onClick={() => reset()}>
                    Clear form
                </Button>
                <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
                    Next
                </Button>
            </HStack>
        </form>
    );
}
