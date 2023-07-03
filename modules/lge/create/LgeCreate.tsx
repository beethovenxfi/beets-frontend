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
    useBreakpointValue,
} from '@chakra-ui/react';
import LgeCreateDetailsForm, { DetailsFormData } from './forms/LgeCreateDetailsForm';
import LgeCreateConfigurationForm, { ConfigurationFormData } from './forms/LgeCreateConfigurationForm';
import { useEffect, useState } from 'react';
import LgeCreateCreation from './forms/LgeCreateCreation';
import scrollIntoView from 'smooth-scroll-into-view-if-needed';

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
    const isMobile = useBreakpointValue({ base: true, lg: false });

    const [detailsFormData, setDetailsFormData] = useState<DetailsFormData>();
    const [configurationFormData, setConfigurationFormData] = useState<ConfigurationFormData>();

    const element = document.getElementById('stepper');
    if (element) {
        scrollIntoView(element, {
            behavior: 'smooth',
            scrollMode: 'if-needed',
        });
    }

    // useEffect(() => {
    //     console.log({ detailsFormData, configurationFormData });
    // }, [detailsFormData, configurationFormData]);

    return (
        <>
            <Heading as="h1" size="2xl" mb={{ base: '8', lg: '16' }}>
                Create an LBP
            </Heading>
            <Box w={{ base: undefined, lg: '1024px' }}>
                <Stepper
                    id="stepper"
                    index={activeStep}
                    mb={{ base: '4', lg: '16' }}
                    orientation={isMobile ? 'vertical' : undefined}
                    height={{ base: '200px', lg: undefined }}
                    gap={{ base: '0', lg: undefined }}
                >
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
