import { Flex, FlexProps } from '@chakra-ui/react';
import BeetsButton from '~/components/button/Button';
import { Step, Steps } from '~/components/steps/index';

interface Props extends FlexProps {
    steps: {
        buttonText: string;
        infoText: string;
        onClick: () => void;
        disabled?: boolean;
        loading?: boolean;
    }[];

    activeStep: number;
}

export function TransactionActionsStepper({ steps, activeStep, ...rest }: Props) {
    return (
        <Flex flexDir="column" width="100%" {...rest}>
            <Steps activeStep={activeStep}>
                {steps.map(({ buttonText, infoText, onClick, loading, disabled }, index) => {
                    return (
                        <Step key={index} infoText={infoText}>
                            <BeetsButton mt={4} onClick={onClick} isLoading={loading} disabled={disabled}>
                                {buttonText}
                            </BeetsButton>
                        </Step>
                    );
                })}
            </Steps>
        </Flex>
    );
}
