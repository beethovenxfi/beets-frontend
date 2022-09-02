import { Input, InputProps } from '@chakra-ui/input';
import { Box, BoxProps, Heading, HeadingProps, HStack, VStack } from '@chakra-ui/layout';
import PresetSelector from './PresetSelector';
import { Lock } from 'react-feather';
import { forwardRef } from '@chakra-ui/react';

type Props = {
    label?: string;
    secondaryLabel?: string;
    headingProps?: HeadingProps;
    wrapperProps?: BoxProps;
};

export const BeetsInput = forwardRef(
    ({ label, secondaryLabel, children, headingProps, wrapperProps, ...inputProps }: InputProps & Props, ref) => {
        return (
            <Box position="relative" width="full" bg="blackAlpha.500" borderRadius="md" {...wrapperProps}>
                <HStack>
                    {label && (
                        <Heading
                            position="absolute"
                            top=".5rem"
                            left=".75rem"
                            fontWeight="normal"
                            color="gray.200"
                            size="xs"
                            {...headingProps}
                        >
                            {label}
                        </Heading>
                    )}
                    {secondaryLabel && (
                        <Heading
                            position="absolute"
                            zIndex="dropdown"
                            top=".5rem"
                            right=".75rem"
                            fontWeight="normal"
                            color="gray.200"
                            size="xs"
                            {...headingProps}
                        >
                            {secondaryLabel}
                        </Heading>
                    )}
                </HStack>
                <Input
                    ref={ref}
                    width="full"
                    minHeight="20"
                    height="full"
                    fontSize="lg"
                    fontWeight="semibold"
                    borderColor="transparent"
                    border="2px"
                    bgColor="transparent"
                    paddingTop="5"
                    _hover={{
                        borderColor: 'gray.200',
                    }}
                    _focus={{
                        outline: 'none',
                    }}
                    _placeholder={{
                        color: 'gray.400',
                    }}
                    {...inputProps}
                />
                {children}
            </Box>
        );
    },
);
