import { Button, Grid, GridItem, HStack, Heading } from '@chakra-ui/react';
import { ConfigurationFormData } from './LgeCreateConfigurationForm';
import { DetailsFormData } from './LgeCreateDetailsForm';
import { Dispatch, SetStateAction } from 'react';
import { format } from 'date-fns';
import { LgeCreateModal } from './LgeCreateModal';
import { useGetTokens } from '~/lib/global/useToken';

interface Props {
    setActiveStep: Dispatch<SetStateAction<number>>;
    configurationFormData: ConfigurationFormData;
    detailsFormData: DetailsFormData;
}

export default function LgeCreateCreation({ setActiveStep, detailsFormData, configurationFormData }: Props) {
    const lgeData = {
        ...detailsFormData,
        ...configurationFormData,
    };
    const { getToken } = useGetTokens();

    const collateralToken = getToken(configurationFormData.collateralAddress);

    return (
        <>
            <Grid templateColumns={{ base: '1fr', lg: '1fr 3fr' }} gap={{ base: undefined, lg: '4' }}>
                <GridItem colSpan={{ base: 1, lg: 2 }} mb="4">
                    <Heading>Details</Heading>
                </GridItem>
                <GridItem fontWeight="bold">Name:</GridItem>
                <GridItem>{detailsFormData?.name}</GridItem>
                <GridItem fontWeight="bold" mt={{ base: '2', lg: undefined }}>
                    Description:
                </GridItem>
                <GridItem>{detailsFormData?.description}</GridItem>
                <GridItem fontWeight="bold" mt={{ base: '2', lg: undefined }}>
                    Launch token:
                </GridItem>
                <GridItem>{detailsFormData?.tokenSymbol}</GridItem>
                <GridItem fontWeight="bold" mt={{ base: '2', lg: undefined }}>
                    Launch token icon:
                </GridItem>
                <GridItem>{detailsFormData?.tokenIconUrl}</GridItem>
                <GridItem fontWeight="bold" mt={{ base: '2', lg: undefined }}>
                    Website:
                </GridItem>
                <GridItem>{detailsFormData?.websiteUrl}</GridItem>
                <GridItem fontWeight="bold" mt={{ base: '2', lg: undefined }}>
                    Banner image:
                </GridItem>
                <GridItem>{detailsFormData?.bannerImageUrl || '-'}</GridItem>
                <GridItem fontWeight="bold" mt={{ base: '2', lg: undefined }}>
                    Twitter:
                </GridItem>
                <GridItem>{detailsFormData?.twitterUrl || '-'}</GridItem>
                <GridItem fontWeight="bold" mt={{ base: '2', lg: undefined }}>
                    Medium:
                </GridItem>
                <GridItem>{detailsFormData?.mediumUrl || '-'}</GridItem>
                <GridItem fontWeight="bold" mt={{ base: '2', lg: undefined }}>
                    Discord:
                </GridItem>
                <GridItem>{detailsFormData?.discordUrl || '-'}</GridItem>
                <GridItem colSpan={{ base: 1, lg: 2 }} mt="8" mb="4">
                    <Heading>Configuration</Heading>
                </GridItem>
                <GridItem fontWeight="bold" mt={{ base: '2', lg: undefined }}>
                    Start date:
                </GridItem>
                <GridItem>
                    {format(new Date(configurationFormData?.startDate || ''), "yyyy-MM-dd' 'HH:mm' 'O")}
                </GridItem>
                <GridItem fontWeight="bold" mt={{ base: '2', lg: undefined }}>
                    End date:
                </GridItem>
                <GridItem>{format(new Date(configurationFormData?.endDate || ''), "yyyy-MM-dd' 'HH:mm' 'O")}</GridItem>
                <GridItem fontWeight="bold" mt={{ base: '2', lg: undefined }}>
                    Pool name:
                </GridItem>
                <GridItem>{configurationFormData?.poolName}</GridItem>
                <GridItem fontWeight="bold" mt={{ base: '2', lg: undefined }}>
                    Pool symbol:
                </GridItem>
                <GridItem>{configurationFormData?.poolSymbol}</GridItem>
                <GridItem fontWeight="bold" mt={{ base: '2', lg: undefined }}>
                    Collateral token:
                </GridItem>
                <GridItem>{collateralToken?.symbol}</GridItem>
                <GridItem fontWeight="bold" mt={{ base: '2', lg: undefined }}>
                    Start weights:
                </GridItem>
                <GridItem>{`${configurationFormData?.tokenStartWeight}% ${detailsFormData?.tokenSymbol} - ${configurationFormData?.collateralStartWeight}% ${collateralToken?.symbol}`}</GridItem>
                <GridItem fontWeight="bold" mt={{ base: '2', lg: undefined }}>
                    End weights:
                </GridItem>
                <GridItem>{`${configurationFormData?.tokenEndWeight}% ${detailsFormData?.tokenSymbol} - ${configurationFormData?.collateralEndWeight}% ${collateralToken?.symbol}`}</GridItem>
                <GridItem fontWeight="bold" mt={{ base: '2', lg: undefined }}>
                    Swap fee:
                </GridItem>
                <GridItem>{`${configurationFormData?.swapFee}%`}</GridItem>
            </Grid>
            <HStack justifyContent="space-between" mt="8" w={{ base: 'full', lg: '55%' }} alignItems="end">
                <Button mt={4} colorScheme="teal" onClick={() => setActiveStep(1)}>
                    Prev
                </Button>
                <LgeCreateModal lgeData={lgeData} />
            </HStack>
        </>
    );
}
