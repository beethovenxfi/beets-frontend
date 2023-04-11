import { Box, Flex, FlexProps, Text, useStyleConfig } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Props {
    title: string;
    image: ReactNode;
}

export function PageMasthead({ title, image }: Props) {

    const styles = useStyleConfig('PageMasthead') as FlexProps;
    return (
        <Flex
            borderBottomWidth={styles.borderBottomWidth}
            borderBottomColor={styles.borderBottomColor}
            mb={{ base: '6', lg: '8' }}
            alignItems="flex-end"
            position="relative"
            sx={{
                '&::after': {
                    position: 'absolute',
                    width: 'full',
                    display: 'block',
                    bottom: '-25px',
                    boxShadow: '0px -10px 18px -9px rgba(0,0,0,0.4)',
                    content: '""',
                    height: '20px',
                    bgColor: 'transparent',
                    zIndex: -1,
                },
            }}
            zIndex={1}
        >
            <Text fontSize="28px" fontWeight="semibold" as="h1" flex="1" mb="0">
                {title}
            </Text>
            <Box alignItems="flex-end" display={{ base: 'none', md: 'flex' }}>
                {image}
            </Box>
        </Flex>
    );
}
