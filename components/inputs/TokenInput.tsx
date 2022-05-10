import { Flex, Input, Button, Box, Heading, VStack } from '@chakra-ui/react';

type Props = {
    label?: string;
};

export default function TokenInput({ label }: Props) {
    return (
        <VStack width="full" alignItems="flex-start">
            {label && (
                <Heading fontWeight="medium" color="beets.gray.100" size="xs">
                    {label}
                </Heading>
            )}
            <Box position="relative" width="full">
                <Input
                    width="full"
                    minHeight="16"
                    height="full"
                    bg="beets.gray.600"
                    placeholder="0"
                    fontSize="2xl"
                    color="beets.gray.100"
                    fontWeight="semibold"
                    borderColor="transparent"
                    border="2px"
                    _hover={{
                        borderColor: 'beets.gray.200',
                    }}
                />
                <Box position="absolute" zIndex="toast" right=".75rem" top="50%" transform="translateY(-50%)">
                    <Button backgroundColor="beets.gray.300" _hover={{ backgroundColor: 'beets.green.400' }}></Button>
                </Box>
            </Box>
        </VStack>
    );
}
