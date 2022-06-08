import { Input, InputProps } from '@chakra-ui/input';
import { Box, Heading } from '@chakra-ui/layout';
import { ReactNode } from 'react';

type Props = {
    label?: string;
    below?: ReactNode;
};

export default function BeetsInput({ label, below, ...inputProps }: InputProps & Props) {
    return (
        <Box position="relative" width="full">
            {label && !below && (
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
                bg="blackAlpha.600"
                fontSize="2xl"
                color="beets.gray.100"
                fontWeight="semibold"
                borderColor="transparent"
                border="2px"
                paddingTop={below ? '0' : '5'}
                paddingBottom={below ? '6' : '0'}
                _hover={{
                    borderColor: 'beets.gray.200',
                }}
                _placeholder={{
                    color: 'beets.gray.400',
                }}
                {...inputProps}
            />
            {below && (
                <Box position="absolute" bottom=".8rem" left="1.2rem" zIndex="2">
                    {below}
                </Box>
            )}
        </Box>
    );
}
