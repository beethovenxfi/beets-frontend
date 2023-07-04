import { useForm } from 'react-hook-form';
import {
    FormErrorMessage,
    FormLabel,
    FormControl,
    Input,
    Button,
    Grid,
    GridItem,
    Textarea,
    HStack,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';

export interface DetailsFormData {
    name: string;
    websiteUrl: string;
    tokenAddress: string;
    tokenIconUrl: string;
    twitterUrl: string;
    mediumUrl: string;
    discordUrl: string;
    telegramUrl: string;
    description: string;
    bannerImageUrl: string;
}

const defaultValues = {
    name: '',
    websiteUrl: '',
    tokenAddress: '',
    tokenIconUrl: '',
    twitterUrl: '',
    mediumUrl: '',
    discordUrl: '',
    telegramUrl: '',
    description: '',
    bannerImageUrl: '',
};

interface Props {
    setActiveStep: Dispatch<SetStateAction<number>>;
    setDetailsFormData: Dispatch<SetStateAction<DetailsFormData | undefined>>;
    values: DetailsFormData | undefined;
}

export default function LgeCreateDetailsForm({ setActiveStep, setDetailsFormData, values }: Props) {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<DetailsFormData>({
        defaultValues,
        values,
        resetOptions: {
            keepDefaultValues: true,
        },
    });

    function onSubmit(values: DetailsFormData): void {
        setActiveStep(1);
        setDetailsFormData(values);
    }

    const invalidUrlPattern = {
        value: /(^$|(https?:\/\/)([\w-]+\.)+[\w-]+([\w- ;,.\/?%&=]*))/,
        message: 'Invalid URL',
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="4" width="full">
                <GridItem>
                    <FormControl isInvalid={!!errors.name} isRequired>
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <Input
                            id="name"
                            {...register('name', {
                                required: 'This is required',
                            })}
                        />
                        <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem rowSpan={3}>
                    <FormControl isInvalid={!!errors.description} h="full" isRequired>
                        <FormLabel htmlFor="description">Description</FormLabel>
                        <Textarea
                            resize="none"
                            minH="88%"
                            id="description"
                            {...register('description', {
                                required: 'This is required',
                            })}
                        />
                        <FormErrorMessage>{errors.description && errors.description.message}</FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem mt={{ base: '6', lg: '0' }}>
                    <FormControl isInvalid={!!errors.websiteUrl} isRequired>
                        <FormLabel htmlFor="websiteUrl">Website url</FormLabel>
                        <Input
                            id="websiteUrl"
                            placeholder="https://example.com"
                            {...register('websiteUrl', {
                                required: 'This is required',
                                //pattern: invalidUrlPattern,
                            })}
                        />
                        <FormErrorMessage>{errors.websiteUrl && errors.websiteUrl.message}</FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors.bannerImageUrl}>
                        <FormLabel htmlFor="bannerImageUrl">Banner image url</FormLabel>
                        <Input id="bannerImageUrl" {...register('bannerImageUrl', { pattern: invalidUrlPattern })} />
                        <FormErrorMessage>{errors.bannerImageUrl && errors.bannerImageUrl.message}</FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors.tokenAddress} isRequired>
                        <FormLabel htmlFor="tokenAddress">Token address</FormLabel>
                        <Input
                            id="tokenAddress"
                            placeholder="0x0123456789abcdef0123456789abcdef01234567"
                            {...register('tokenAddress', {
                                required: 'This is required',
                                //pattern: { value: /^0x[a-fA-F0-9]{40}$/, message: 'Invalid token address' },
                            })}
                        />
                        <FormErrorMessage>{errors.tokenAddress && errors.tokenAddress.message}</FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors.tokenIconUrl} isRequired>
                        <FormLabel htmlFor="tokenIconUrl">Token icon url</FormLabel>
                        <Input
                            id="tokenIconUrl"
                            {...register('tokenIconUrl', {
                                required: 'This is required',
                                //pattern: invalidUrlPattern,
                            })}
                        />
                        <FormErrorMessage>{errors.tokenIconUrl && errors.tokenIconUrl.message}</FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors.twitterUrl}>
                        <FormLabel htmlFor="twitterUrl">Twitter url</FormLabel>
                        <Input id="twitterUrl" {...register('twitterUrl', { pattern: invalidUrlPattern })} />
                        <FormErrorMessage>{errors.twitterUrl && errors.twitterUrl.message}</FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors.mediumUrl}>
                        <FormLabel htmlFor="mediumUrl">Medium url</FormLabel>
                        <Input id="mediumUrl" {...register('mediumUrl', { pattern: invalidUrlPattern })} />
                        <FormErrorMessage>{errors.mediumUrl && errors.mediumUrl.message}</FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors.discordUrl}>
                        <FormLabel htmlFor="discordUrl">Discord url</FormLabel>
                        <Input id="discordUrl" {...register('discordUrl', { pattern: invalidUrlPattern })} />
                        <FormErrorMessage>{errors.discordUrl && errors.discordUrl.message}</FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors.telegramUrl}>
                        <FormLabel htmlFor="telegramUrl">Telegram url</FormLabel>
                        <Input id="telegramUrl" {...register('telegramUrl', { pattern: invalidUrlPattern })} />
                        <FormErrorMessage>{errors.telegramUrl && errors.telegramUrl.message}</FormErrorMessage>
                    </FormControl>
                </GridItem>
            </Grid>

            <HStack justifyContent="space-between" mt="8">
                <Button mt={4} colorScheme="teal" isDisabled>
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
