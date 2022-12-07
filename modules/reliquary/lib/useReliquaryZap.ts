import { batchRelayerContractConfig, useSubmitTransaction } from '~/lib/util/useSubmitTransaction';

export function useReliquaryZap() {
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: batchRelayerContractConfig,
        transactionType: 'JOIN',
    });

    async function reliquaryZap(calls: string[], type: 'MIGRATE' | 'DEPOSIT') {
        submit({
            args: [calls],
            toastText: type === 'MIGRATE' ? 'Migrate toast text' : 'Join toast text',
            walletText: type === 'MIGRATE' ? 'Migrate wallet text' : 'Join wallet text',
        });
    }

    return {
        reliquaryZap,
        ...rest,
    };
}
