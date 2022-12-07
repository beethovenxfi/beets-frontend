import { batchRelayerContractConfig, useSubmitTransaction } from '~/lib/util/useSubmitTransaction';

export function useReliquaryFbeetsZap() {
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: batchRelayerContractConfig,
        transactionType: 'JOIN',
    });

    async function reliquaryFbeetsZap(calls: string[]) {
        submit({
            args: [calls],
            toastText: 'toast text',
            walletText: 'wallet text',
        });
    }

    return {
        reliquaryFbeetsZap,
        ...rest,
    };
}
