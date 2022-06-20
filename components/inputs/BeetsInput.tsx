import { Input, InputProps } from '@chakra-ui/input';
import { Box, Heading, VStack } from '@chakra-ui/layout';
import PresetSelector from './PresetSelector';

type Props = {
    label?: string;
};

export default function BeetsInput({ label, children, ...inputProps }: InputProps & Props) {
    return (
        <Box position="relative" width="full" bg="blackAlpha.500" borderRadius="md">
            {label && (
                <Heading
                    position="absolute"
                    zIndex="dropdown"
                    top=".5rem"
                    left=".75rem"
                    fontWeight="normal"
                    color="gray.200"
                    size="xs"
                >
                    {label}
                </Heading>
            )}
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
