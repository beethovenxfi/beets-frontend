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
    Spacer,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';

interface FormData {
    name: string;
    description: string;
    tokenAddress: string;
    iconUrl: string;
    websiteUrl: string;
    twitterUrl: string;
    mediumUrl: string;
    discordUrl: string;
    telegramUrl: string;
    bannerImageUrl: string;
}

export default function LgeCreateFormDetails({ setActiveStep }: { setActiveStep: Dispatch<SetStateAction<number>> }) {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormData>();

    function onSubmit(values: FormData): Promise<void> {
        setActiveStep(1);
        return new Promise((resolve) => {
            setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                resolve();
            }, 3000);
        });
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

                <GridItem>
                    <FormControl isInvalid={!!errors.websiteUrl} isRequired>
                        <FormLabel htmlFor="websiteUrl">Website url</FormLabel>
                        <Input
                            id="websiteUrl"
                            placeholder="https://example.com"
                            {...register('websiteUrl', {
                                required: 'This is required',
                                pattern: invalidUrlPattern,
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
                                pattern: { value: /^0x[a-fA-F0-9]{40}$/, message: 'Invalid token address' },
                            })}
                        />
                        <FormErrorMessage>{errors.tokenAddress && errors.tokenAddress.message}</FormErrorMessage>
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl isInvalid={!!errors.iconUrl} isRequired>
                        <FormLabel htmlFor="iconUrl">Token icon url</FormLabel>
                        <Input
                            id="iconUrl"
                            {...register('iconUrl', {
                                required: 'This is required',
                                pattern: invalidUrlPattern,
                            })}
                        />
                        <FormErrorMessage>{errors.iconUrl && errors.iconUrl.message}</FormErrorMessage>
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

            <HStack>
                <Button mt={4} colorScheme="teal" onClick={() => reset()}>
                    Clear form
                </Button>
                <Spacer />
                <Button mt={4} colorScheme="teal" isDisabled>
                    Prev
                </Button>
                <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
                    Next
                </Button>
            </HStack>
        </form>
    );
}
