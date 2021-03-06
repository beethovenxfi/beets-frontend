import { Input, InputProps } from '@chakra-ui/input';
import { Box, BoxProps, Heading, HeadingProps, HStack, VStack } from '@chakra-ui/layout';
import PresetSelector from './PresetSelector';

type Props = {
    label?: string;
    secondaryLabel?: string;
    headingProps?: HeadingProps;
    wrapperProps?: BoxProps;
};

export default function BeetsInput({ label, secondaryLabel, children, headingProps, wrapperProps, ...inputProps }: InputProps & Props) {
    return (
        <Box position="relative" width="full" bg="blackAlpha.500" borderRadius="md" {...wrapperProps}>
            <HStack>
                {label && (
                    <Heading
                        position="absolute"
                        zIndex="dropdown"
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
                width="full"
                minHeight="20"
                height="full"
                fontSize="2xl"
                color="gray.100"
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
}
