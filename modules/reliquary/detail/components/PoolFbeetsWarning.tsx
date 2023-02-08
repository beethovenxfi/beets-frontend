import React, { useEffect } from 'react';
import { Box, Button, HStack, Link, Text } from '@chakra-ui/react';
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
                <HStack spacing="4" alignItems="center">
                    <Box>
                        <Text>You can utilise your fBEETS position further by staking it in a relic.</Text>
                    </Box>
                    <Button
                        colorScheme="orange"
                        variant="solid"
                        backgroundColor="orange.300"
                        as={Link}
                        href={networkConfig.stakeUrl}
                        _hover={{ textDecoration: 'none', backgroundColor: 'orange.400' }}
                    >
                        Go to Reliquary
                    </Button>
                </HStack>
            ),
        });
    }, []);

    return null;
}
