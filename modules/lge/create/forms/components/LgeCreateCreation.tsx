import { Button, Grid, GridItem, HStack, Heading, useBreakpointValue } from '@chakra-ui/react';
import { ConfigurationFormData } from './LgeCreateConfigurationForm';
import { DetailsFormData } from './LgeCreateDetailsForm';
import { Dispatch, SetStateAction } from 'react';
import { format } from 'date-fns';

interface Props {
    setActiveStep: Dispatch<SetStateAction<number>>;
    configurationFormData: ConfigurationFormData | undefined;
    detailsFormData: DetailsFormData | undefined;
}

export default function LgeCreateCreation({ setActiveStep, detailsFormData, configurationFormData }: Props) {
    const isMobile = useBreakpointValue({ base: true, lg: false });

    console.log(new Date(configurationFormData?.startDate || ''));

    return (
        <>
            <Grid templateColumns={{ base: '1fr', lg: '1fr 3fr' }} gap={{ base: undefined, lg: '4' }}>
                <GridItem colSpan={isMobile ? 1 : 2} mb="4">
                    <Heading>Details</Heading>
                </GridItem>
                <GridItem fontWeight="bold">Name:</GridItem>
                <GridItem>{detailsFormData?.name}</GridItem>
                <GridItem fontWeight="bold" mt={isMobile ? '2' : undefined}>
                    Description:
                </GridItem>
                <GridItem>{detailsFormData?.description}</GridItem>
                <GridItem fontWeight="bold" mt={isMobile ? '2' : undefined}>
                    Launch token address:
                </GridItem>
                <GridItem>{detailsFormData?.tokenAddress} + name?</GridItem>
                <GridItem fontWeight="bold" mt={isMobile ? '2' : undefined}>
                    Launch token icon:
                </GridItem>
                <GridItem>{detailsFormData?.tokenIconUrl}</GridItem>
                <GridItem fontWeight="bold" mt={isMobile ? '2' : undefined}>
                    Website:
                </GridItem>
                <GridItem>{detailsFormData?.websiteUrl}</GridItem>
                <GridItem fontWeight="bold" mt={isMobile ? '2' : undefined}>
                    Banner image:
                </GridItem>
                <GridItem>{detailsFormData?.bannerImageUrl || '-'}</GridItem>
                <GridItem fontWeight="bold" mt={isMobile ? '2' : undefined}>
                    Twitter:
                </GridItem>
                <GridItem>{detailsFormData?.twitterUrl || '-'}</GridItem>
                <GridItem fontWeight="bold" mt={isMobile ? '2' : undefined}>
                    Medium:
                </GridItem>
                <GridItem>{detailsFormData?.mediumUrl || '-'}</GridItem>
                <GridItem fontWeight="bold" mt={isMobile ? '2' : undefined}>
                    Discord:
                </GridItem>
                <GridItem>{detailsFormData?.discordUrl || '-'}</GridItem>
                <GridItem colSpan={isMobile ? 1 : 2} mt="8" mb="4">
                    <Heading>Configuration</Heading>
                </GridItem>
                <GridItem fontWeight="bold" mt={isMobile ? '2' : undefined}>
                    Start date:
                </GridItem>
                <GridItem>
                    {format(new Date(configurationFormData?.startDate || ''), "yyyy-MM-dd' 'HH:mm' 'O")}
                </GridItem>
                <GridItem fontWeight="bold" mt={isMobile ? '2' : undefined}>
                    End date:
                </GridItem>
                <GridItem>{format(new Date(configurationFormData?.endDate || ''), "yyyy-MM-dd' 'HH:mm' 'O")}</GridItem>
                <GridItem fontWeight="bold" mt={isMobile ? '2' : undefined}>
                    Pool name:
                </GridItem>
                <GridItem>{configurationFormData?.poolName}</GridItem>
                <GridItem fontWeight="bold" mt={isMobile ? '2' : undefined}>
                    Pool symbol:
                </GridItem>
                <GridItem>{configurationFormData?.poolSymbol}</GridItem>
                <GridItem fontWeight="bold" mt={isMobile ? '2' : undefined}>
                    Collateral token address:
                </GridItem>
                <GridItem>{configurationFormData?.collateralAddress}</GridItem>
                <GridItem fontWeight="bold" mt={isMobile ? '2' : undefined}>
                    Start weights:
                </GridItem>
                <GridItem>{`${configurationFormData?.tokenStartWeight}% ${detailsFormData?.tokenAddress} - ${configurationFormData?.collateralStartWeight}% ${configurationFormData?.collateralAddress}`}</GridItem>
                <GridItem fontWeight="bold" mt={isMobile ? '2' : undefined}>
                    End weights:
                </GridItem>
                <GridItem>{`${configurationFormData?.tokenEndWeight}% ${detailsFormData?.tokenAddress} - ${configurationFormData?.collateralEndWeight}% ${configurationFormData?.collateralAddress}`}</GridItem>
                <GridItem fontWeight="bold" mt={isMobile ? '2' : undefined}>
                    Swap fee:
                </GridItem>
                <GridItem>{`${configurationFormData?.swapFee}%`}</GridItem>
            </Grid>
            <HStack justifyContent="space-between" mt="8" w={{ base: 'full', lg: '55%' }}>
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
