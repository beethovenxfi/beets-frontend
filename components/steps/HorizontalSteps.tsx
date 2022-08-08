import { Box, Center, Circle, Flex, FlexProps, HStack, Spinner, Tooltip, useTheme } from '@chakra-ui/react';
import { IconWallet } from '~/components/icons/IconWallet';
import { Check } from 'react-feather';
import { Fragment } from 'react';

export type StepStatus = 'current' | 'idle' | 'submitting' | 'pending' | 'complete';

interface Props extends FlexProps {
    steps: {
        status: StepStatus;
        tooltipText: string;
    }[];
}

export function HorizontalSteps({ steps, ...rest }: Props) {
    const theme = useTheme();

    return (
        <Flex justifyContent="center" {...rest}>
            <HStack spacing="0">
                {steps.map(({ status, tooltipText }, index) => (
                    <Fragment key={`step-${index}`}>
                        <Tooltip label={tooltipText}>
                            {status === 'pending' ? (
                                <Box position="relative" height="30px" width="30px">
                                    <Spinner
                                        thickness="2px"
                                        speed="0.65s"
                                        emptyColor="orange.400"
                                        color="orange.600"
                                        size="lg"
                                        height="30px"
                                        width="30px"
                                    />
                                    <Center
                                        position="absolute"
                                        top="0"
                                        left="0"
                                        bottom="0"
                                        right="0"
                                        fontWeight="bold"
                                        color="orange.400"
                                    >
                                        {index + 1}
                                    </Center>
                                </Box>
                            ) : (
                                <Circle
                                    size="30px"
                                    borderWidth={1}
                                    borderColor={
                                        status === 'idle'
                                            ? 'gray.300'
                                            : status === 'complete'
                                            ? 'beets.green'
                                            : 'beets.highlight'
                                    }
                                    color={status === 'idle' ? 'gray.100' : 'beets.highlight'}
                                    fontWeight={status === 'idle' ? 'normal' : 'bold'}
                                    cursor="default"
                                    userSelect="none"
                                >
                                    {status === 'submitting' ? (
                                        <IconWallet stroke={theme.colors.beets.highlight} boxSize="16px" ml="0.5" />
                                    ) : status === 'complete' ? (
                                        <Check size="18" color={theme.colors.beets.green} />
                                    ) : (
                                        index + 1
                                    )}
                                </Circle>
                            )}
                        </Tooltip>
                        {index < steps.length - 1 ? (
                            <Box height="1px" width={steps.length > 5 ? '32px' : '40px'} bgColor="gray.300" />
                        ) : null}
                    </Fragment>
                ))}
            </HStack>
        </Flex>
    );
}
