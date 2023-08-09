import { batchRelayerContractConfig, useSubmitTransaction } from '~/lib/util/useSubmitTransaction';

export function useStakingMigration() {
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: batchRelayerContractConfig,
        transactionType: 'MIGRATE',
    });

    async function migrateGaugeStakedBalance(calls: string[]) {
        submit({
            args: [calls],
            toastText: 'Migrating staked balance...',
            walletText: 'Migrate staked balance.',
        });
    }

    return {
        migrateGaugeStakedBalance,
        ...rest,
    };
}