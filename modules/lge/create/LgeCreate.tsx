import {
    Box,
    Heading,
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    useSteps,
} from '@chakra-ui/react';
import LgeCreateDetailsForm, { DetailsFormData } from './forms/LgeCreateDetailsForm';
import LgeCreateConfigurationForm, { ConfigurationFormData } from './forms/LgeCreateConfigurationForm';
import { useEffect, useState } from 'react';
import LgeCreateCreation from './forms/LgeCreateCreation';

const steps = [
    { title: 'Details', description: 'Enter your LBP details' },
    { title: 'Configuration', description: 'Configure your LBP' },
    { title: 'Creation', description: 'Create your LBP' },
];

export function LgeCreate() {
    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length,
    });

    const [detailsFormData, setDetailsFormData] = useState<DetailsFormData>();
    const [configurationFormData, setConfigurationFormData] = useState<ConfigurationFormData>();

    // useEffect(() => {
    //     console.log({ detailsFormData, configurationFormData });
    // }, [detailsFormData, configurationFormData]);

    return (
        <>
            <Heading as="h1" size="2xl" mb="16">
                Create an LBP
            </Heading>
            <Box w="1024px">
                <Stepper index={activeStep} mb="16">
                    {steps.map((step, index) => (
                        <Step key={index}>
                            <StepIndicator>
                                <StepStatus
                                    complete={<StepIcon />}
                                    incomplete={<StepNumber />}
                                    active={<StepNumber />}
                                />
                            </StepIndicator>
                            <Box flexShrink="0">
                                <StepTitle>{step.title}</StepTitle>
                                <StepDescription>{step.description}</StepDescription>
                            </Box>
                            <StepSeparator />
                        </Step>
                    ))}
                </Stepper>
                {activeStep === 0 && (
                    <LgeCreateDetailsForm
                        setActiveStep={setActiveStep}
                        setDetailsFormData={setDetailsFormData}
                        values={detailsFormData}
                    />
                )}
                {activeStep === 1 && (
                    <LgeCreateConfigurationForm
                        setActiveStep={setActiveStep}
                        setConfigurationFormData={setConfigurationFormData}
                        values={configurationFormData}
                    />
                )}
                {activeStep === 2 && (
                    <LgeCreateCreation
                        setActiveStep={setActiveStep}
                        detailsFormData={detailsFormData}
                        configurationFormData={configurationFormData}
                    />
                )}
            </Box>
        </>
    );
}
