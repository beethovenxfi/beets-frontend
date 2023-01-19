import { batchRelayerContractConfig, useSubmitTransaction } from '~/lib/util/useSubmitTransaction';

export function useReliquaryHarvestAllRewards() {
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: batchRelayerContractConfig,
        transactionType: 'HARVEST',
    });

    function harvestAll(calls: string[]) {
        submit({
            args: [calls],
            toastText: 'Harvest all pending relic rewards',
        });
    }

    return {
        harvestAll,
        ...rest,
    };
}
