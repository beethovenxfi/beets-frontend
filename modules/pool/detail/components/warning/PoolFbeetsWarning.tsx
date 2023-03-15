import React, { useEffect } from 'react';
import { Box, Button, Link, Stack, Text } from '@chakra-ui/react';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { ToastType, useToast } from '~/components/toast/BeetsToast';

export function PoolFbeetsWarning() {
    const networkConfig = useNetworkConfig();

    const { showToast } = useToast();

    useEffect(() => {
        showToast({
            id: 'fbeets-stake-alert',
            type: ToastType.Warn,
            content: (
                <Stack
                    direction={['column', 'row']}
                    spacing="4"
                    alignItems="center"
                    justifyContent={{ base: 'stretch', xl: undefined }}
                >
                    <Box>
                        <Text>
                            To earn BEETS rewards and voting power, withdraw your wFTM & BEETS and deposit into a
                            maBEETS position.
                        </Text>
                    </Box>
                    <Button
                        w={{ base: 'full', xl: 'inherit' }}
                        colorScheme="orange"
                        variant="solid"
                        backgroundColor="orange.300"
                        as={Link}
                        href="/mabeets"
                        _hover={{ textDecoration: 'none', backgroundColor: 'orange.400' }}
                    >
                        Go to maBEETS
                    </Button>
                </Stack>
            ),
        });
    }, []);

    return null;
}
