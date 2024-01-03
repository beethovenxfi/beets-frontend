import { batchRelayerContractConfig, useSubmitTransaction } from '~/lib/util/useSubmitTransaction';

export function useUserGaugeClaimAllPendingRewards() {
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: batchRelayerContractConfig,
        transactionType: 'HARVEST',
    });

    function claimAll(contractCalls: string[]) {
        return submit({
            args: [contractCalls],
            toastText: 'Claim all pool rewards',
        });
    }

    return {
        claimAll,
        ...rest,
    };
}
