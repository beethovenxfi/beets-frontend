import { Box, Flex, FlexProps, Text, VStack, useStyleConfig } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Props {
    title: string;
    subtitle?: string;
    image: ReactNode;
}

export function PageMasthead({ title, image, subtitle = '' }: Props) {
    const styles = useStyleConfig('PageMasthead') as FlexProps;
    return (
        <Flex
            borderBottomWidth={styles.borderBottomWidth}
            borderBottomColor={styles.borderBottomColor}
            mb={{ base: '6', lg: '8' }}
            alignItems="flex-end"
        >
            <VStack alignItems='flex-start' spacing='0'>
                <Text fontSize="28px" fontWeight="semibold" as="h1" flex="1" mb="0">
                    {title}
                </Text>
                <Text fontSize="1.1rem" fontWeight="semibold" as="h3" flex="1" mb="0">
                    {subtitle}
                </Text>
            </VStack>
            <Box alignItems="flex-end" display={{ base: 'none', md: 'flex' }}>
                {image}
            </Box>
        </Flex>
    );
}
