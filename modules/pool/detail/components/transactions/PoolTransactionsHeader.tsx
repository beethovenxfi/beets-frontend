import { Box, Flex, Text } from "@chakra-ui/layout";

export default function PoolTransactionHeader() {
    return (
        <Flex
            px="4"
            py="3"
            cursor="pointer"
            borderTopLeftRadius="md"
            borderTopRightRadius="md"
            alignItems={'center'}
            bgColor="rgba(255,255,255,0.08)"
            borderBottom="2px"
            borderColor="beets.base.500"
        >
            <Box width="200px">
                <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                    Action
                </Text>
            </Box>
            <Box flex={1} textAlign="left">
                <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                    Details
                </Text>
            </Box>
            <Box width="200px" textAlign="right">
                <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                    Value
                </Text>
            </Box>
            <Box width="200px" textAlign="right">
                <Text fontSize="md" fontWeight="semibold" color="beets.base.100">
                    Time
                </Text>
            </Box>
        </Flex>
    );
}