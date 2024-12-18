import { Button, HStack, Link, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { useEffect } from 'react';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import useCheckpointTrigger from '~/modules/pool/stake/lib/useCheckpointTrigger';
import { useGaugeCheckpoint } from '~/modules/pool/stake/lib/useGaugeCheckpoint';
import useVeMigrationTrigger from '~/modules/pool/stake/lib/useVeMigrationTrigger';
import { useOldBeetsBalance } from './useOldBeetsBalance';
import { BeetsMigration } from '~/modules/migrate/BeetsMigration';
import { networkConfig } from '~/lib/config/network-config';
import { useGetTokens } from './useToken';

export default function useGlobalWarnings() {
    const { isLoading: isLoadingMigrationData, shouldShowMigrationTrigger } = useVeMigrationTrigger();
    const { isLoading: isLoadingCheckpointableGauges, checkpointableGauges } = useCheckpointTrigger();
    const { checkpoint, ...checkpointMutation } = useGaugeCheckpoint();
    const { showToast, removeToast } = useToast();
    const { isLoading: isLoadingOldBeetsBalance, balance: oldBeetsBalance } = useOldBeetsBalance();
    const { getToken } = useGetTokens();
    const tokenData = getToken(networkConfig.beets.oldAddress);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isFantom = networkConfig.chainId === '250';

    useEffect(() => {
        if (isFantom && !isOpen) {
            showToast({
                id: 'migrate-sonic',
                type: ToastType.Info,
                content: (
                    <Stack
                        direction={['column', 'row']}
                        spacing="4"
                        alignItems="center"
                        justifyContent={{ base: 'stretch', xl: undefined }}
                    >
                        <Text>Sonic is live! If you have assets on Fantom, you can now migrate to Sonic.</Text>
                        <Button variant="primary" onClick={onOpen} w={{ base: 'full', xl: 'inherit' }}>
                            Migration Guide
                        </Button>
                    </Stack>
                ),
            });
        }
    }, [isOpen]);

    // sync veBAL warning
    useEffect(() => {
        if (shouldShowMigrationTrigger) {
            showToast({
                id: 'optimism-vebal-sync',
                content: (
                    <HStack>
                        <Text>
                            You have a veBAL balance on Mainnet which is not synced to Optimism. Sync your balance to
                            ensure you are receiving your full reward potential.
                        </Text>
                        <Link href={'https://app.balancer.fi/#/ethereum/vebal'} target="_blank">
                            <Button bg="orange.300" color="orange.700" px="4">
                                Sync on Mainnet
                            </Button>
                        </Link>
                    </HStack>
                ),
                type: ToastType.Warn,
            });
        } else {
            removeToast('optimism-vebal-sync');
        }
    }, [isLoadingMigrationData, shouldShowMigrationTrigger]);

    // checkpoint gauges warning
    useEffect(() => {
        if ((checkpointableGauges || []).length) {
            showToast({
                id: 'checkpoint-gauges-trigger',
                content: (
                    <HStack>
                        <Text>
                            You have pools which need to be checkpointed. Checkpointing your pools ensure that you are
                            receiving the maximum boost for all your pools.
                        </Text>
                        <BeetsSubmitTransactionButton
                            {...checkpointMutation}
                            width="full"
                            onClick={() => {
                                checkpoint(checkpointableGauges || []);
                            }}
                            borderColor="beets.green"
                            _focus={{ boxShadow: 'none' }}
                            submittingText="Confirm..."
                            pendingText="Waiting..."
                        >
                            Checkpoint Gauges
                        </BeetsSubmitTransactionButton>
                    </HStack>
                ),
                type: ToastType.Warn,
            });
        } else {
            removeToast('checkpoint-gauges-trigger');
        }
    }, [isLoadingCheckpointableGauges]);

    // check for BEETS migration on OP
    useEffect(() => {
        if (parseFloat(oldBeetsBalance) > 0 && networkConfig.beetsMigrationEnabled) {
            showToast({
                id: 'beets-migration',
                content: <BeetsMigration oldBeetsBalance={oldBeetsBalance} tokenData={tokenData} />,
                type: ToastType.Warn,
            });
        }
    }, [isLoadingOldBeetsBalance, oldBeetsBalance]);
}
