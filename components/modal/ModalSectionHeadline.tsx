import { Box, BoxProps, Text } from '@chakra-ui/react';

interface Props extends BoxProps {
    headline: string;
    description?: string;
}

export function ModalSectionHeadline({ headline, description, ...rest }: Props) {
    return (
        <Box mb="2" {...rest}>
            <Text fontSize="lg" fontWeight="semibold">
                {headline}
            </Text>
            <Text color="gray.200">{description}</Text>
        </Box>
    );
}
