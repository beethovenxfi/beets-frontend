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
} from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';

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
    swapFeePercentage: number;
    poolName: string;
    poolSymbol: string;
}

interface Props {
    setActiveStep: Dispatch<SetStateAction<number>>;
    setConfigurationFormData: Dispatch<SetStateAction<ConfigurationFormData | null>>;
}

export default function LgeCreateConfigurationForm({ setActiveStep }: Props) {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ConfigurationFormData>();

    function onSubmit(values: ConfigurationFormData): Promise<void> {
        setActiveStep(1);
        return new Promise((resolve) => {
            setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                resolve();
            }, 3000);
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                <GridItem rowSpan={3}>
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
                    <FormControl isInvalid={!!errors.startTime} isRequired>
                        <FormLabel htmlFor="startTime">Start date</FormLabel>
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
                    <FormControl isInvalid={!!errors.startTime}>
                        <FormLabel htmlFor="startTime">Start time</FormLabel>
                        <Input id="startTime" {...register('startTime')} />
                        <FormErrorMessage>{errors.startTime && errors.startTime.message}</FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors.endDate} isRequired>
                        <FormLabel htmlFor="endDate">Token address</FormLabel>
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
                    <FormControl isInvalid={!!errors.swapFeePercentage}>
                        <FormLabel htmlFor="swapFeePercentage">Swap fee percentage</FormLabel>
                        <Input id="swapFeePercentage" {...register('swapFeePercentage')} />
                        <FormErrorMessage>
                            {errors.swapFeePercentage && errors.swapFeePercentage.message}
                        </FormErrorMessage>
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
