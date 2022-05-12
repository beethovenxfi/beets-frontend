import { Input, InputProps } from '@chakra-ui/input';
import { Box, Heading } from '@chakra-ui/layout';

type Props = {
    label?: string;
};

export default function BeetsInput({ label, ...inputProps }: InputProps & Props) {
    return (
        <Box position="relative" width="full">
            {label && (
                <Heading
                    position="absolute"
                    zIndex="dropdown"
                    top=".5rem"
                    left=".75rem"
                    fontWeight="normal"
                    color="beets.gray.200"
                    size="xs"
                >
                    {label}
                </Heading>
            )}
            <Input
                width="full"
                minHeight="20"
                height="full"
                bg="beets.gray.600"
                fontSize="2xl"
                color="beets.gray.100"
                fontWeight="semibold"
                borderColor="transparent"
                border="2px"
                paddingTop="5"
                _hover={{
                    borderColor: 'beets.gray.200',
                }}
                _placeholder={{
                    color: 'beets.gray.400'
                }}
                {...inputProps}
            />
        </Box>
    );
}
