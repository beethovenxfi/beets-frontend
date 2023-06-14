import { Button, HStack, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import useVeMigrationTrigger from '~/modules/pool/stake/lib/useVeMigrationTrigger';

export default function useGlobalWarnings() {
    const { isOptimismSynced, isLoading: isLoadingMigrationData } = useVeMigrationTrigger();
    const { showToast, removeToast } = useToast();

    useEffect(() => {
        if (!isOptimismSynced && !isLoadingMigrationData) {
            showToast({
                id: 'optimism-vebal-sync',
                content: (
                    <HStack>
                        <Text>
                            You have a veBAL balance on Mainnet which is not synced to Optimism. Sync your balance to
                            ensure you are receiving your full reward potential.
                        </Text>
                        <Button px="4">Sync on Mainnet</Button>
                    </HStack>
                ),
                type: ToastType.Warn,
            });
        } else {
            removeToast('optimism-vebal-sync');
        }
    }, [isOptimismSynced, isLoadingMigrationData]);
}
