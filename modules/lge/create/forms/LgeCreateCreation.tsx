import { Button, Center, Grid, GridItem, HStack, Heading } from '@chakra-ui/react';
import { ConfigurationFormData } from './LgeCreateConfigurationForm';
import { DetailsFormData } from './LgeCreateDetailsForm';
import { Dispatch, SetStateAction } from 'react';

interface Props {
    setActiveStep: Dispatch<SetStateAction<number>>;
    configurationFormData: ConfigurationFormData | undefined;
    detailsFormData: DetailsFormData | undefined;
}

export default function LgeCreateCreation({ setActiveStep, detailsFormData, configurationFormData }: Props) {
    return (
        <>
            <Grid templateColumns={{ base: '1fr', lg: '2fr 3fr' }} gap="4" width="full">
                <GridItem colSpan={2} mb="4">
                    <Center>
                        <Heading>Details</Heading>
                    </Center>
                </GridItem>
                <GridItem>Name:</GridItem>
                <GridItem>{detailsFormData?.name}</GridItem>
                <GridItem>Description:</GridItem>
                <GridItem>{detailsFormData?.description}</GridItem>
                <GridItem>Launch token address:</GridItem>
                <GridItem>{detailsFormData?.tokenContractAddress} + name?</GridItem>
                <GridItem>Launch token icon (url):</GridItem>
                <GridItem>{detailsFormData?.tokenIconUrl}</GridItem>
                <GridItem>Website (url):</GridItem>
                <GridItem>{detailsFormData?.websiteUrl}</GridItem>
                <GridItem>Banner image (url):</GridItem>
                <GridItem>{detailsFormData?.bannerImageUrl || '-'}</GridItem>
                <GridItem>Twitter (url):</GridItem>
                <GridItem>{detailsFormData?.twitterUrl || '-'}</GridItem>
                <GridItem>Medium (url):</GridItem>
                <GridItem>{detailsFormData?.mediumUrl || '-'}</GridItem>
                <GridItem>Discord (url):</GridItem>
                <GridItem>{detailsFormData?.discordUrl || '-'}</GridItem>
                <GridItem colSpan={2} mt="8" mb="4">
                    <Center>
                        <Heading>Configuration</Heading>
                    </Center>
                </GridItem>
                <GridItem>Start date (UTC):</GridItem>
                <GridItem>{configurationFormData?.startDate}</GridItem>
                <GridItem>End date (UTC):</GridItem>
                <GridItem>{configurationFormData?.endDate}</GridItem>
                <GridItem>Pool name:</GridItem>
                <GridItem>{configurationFormData?.poolName}</GridItem>
                <GridItem>Pool symbol:</GridItem>
                <GridItem>{configurationFormData?.poolSymbol}</GridItem>
                <GridItem>Collateral token address:</GridItem>
                <GridItem>{configurationFormData?.collateralTokenAddress}</GridItem>
                <GridItem>Start weights:</GridItem>
                <GridItem>{`${configurationFormData?.tokenStartWeight}% ${detailsFormData?.tokenContractAddress} - ${configurationFormData?.collateralStartWeight}% ${configurationFormData?.collateralTokenAddress}`}</GridItem>
                <GridItem>End weights:</GridItem>
                <GridItem>{`${configurationFormData?.tokenEndWeight}% ${detailsFormData?.tokenContractAddress} - ${configurationFormData?.collateralEndWeight}% ${configurationFormData?.collateralTokenAddress}`}</GridItem>
                <GridItem>Swap fee:</GridItem>
                <GridItem>{`${configurationFormData?.swapFeePercentage}%`}</GridItem>
            </Grid>
            <HStack justifyContent="space-between" mt="8" w="55%">
                <Button mt={4} colorScheme="teal" onClick={() => setActiveStep(1)}>
                    Prev
                </Button>
                <Button mt={4} colorScheme="teal">
                    Create LBP
                </Button>
            </HStack>
        </>
    );
}
