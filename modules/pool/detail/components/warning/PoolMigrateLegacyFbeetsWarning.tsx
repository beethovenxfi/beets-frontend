import { Box, Button, Link, Stack, Text } from '@chakra-ui/react';
import { usePool } from '~/modules/pool/lib/usePool';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import { useEffect } from 'react';
import { useLegacyFBeetsBalance } from '~/modules/reliquary/lib/useLegacyFbeetsBalance';

export function PoolMigrateLegacyFbeetsWarning() {
    const { isFbeetsPool } = usePool();
    const { total } = useLegacyFBeetsBalance();
    const { showToast, removeToast } = useToast();

    useEffect(() => {
        return () => {
            removeToast('migrate-to-mabeets');
        };
    }, []);

    useEffect(() => {
        if (total > 0 && isFbeetsPool) {
            showToast({
                id: 'migrate-to-mabeets',
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
                                You currently have legacy fBEETS tokens staked or stored in your wallet. Start by
                                migrating them on the maBEETS page and then proceed to manage them from there.
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
        } else {
            removeToast('migrate-to-mabeets');
        }
    }, [total]);

    return null;
}
