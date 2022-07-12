import { Box, Spinner } from '@chakra-ui/react';

export function FallbackPlaceholder() {
    return (
        <Box height="lg" display="flex" alignItems="center" flexDirection="column" mt="32">
            <Spinner size="xl" />
            <Box mt="4">Loading...</Box>
        </Box>
    );
}
