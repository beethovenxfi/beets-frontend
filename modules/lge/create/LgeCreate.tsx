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
import LgeCreateFormDetails from './forms/LgeCreateFormDetails';

const steps = [
    { title: 'Details', description: 'Enter your project details' },
    { title: 'Configuration', description: 'Configure your LBP' },
    { title: 'Creation', description: 'Create your LBP' },
];

export function LgeCreate() {
    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length,
    });

    return (
        <>
            <Heading mb="16">Create an LBP</Heading>
            <Box w="1024px">
                <Stepper index={activeStep} mb="8">
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
                {activeStep === 0 && <LgeCreateFormDetails setActiveStep={setActiveStep} />}
                {activeStep === 1 && <Box>TEST 2</Box>}
                {activeStep === 2 && <Box>TEST 3</Box>}
            </Box>
        </>
    );
}
