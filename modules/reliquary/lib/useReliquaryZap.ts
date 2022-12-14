import { batchRelayerContractConfig, useSubmitTransaction } from '~/lib/util/useSubmitTransaction';

export function useReliquaryZap(type: 'MIGRATE' | 'DEPOSIT' | 'WITHDRAW') {
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: batchRelayerContractConfig,
        transactionType: type === 'WITHDRAW' ? 'EXIT' : 'JOIN',
    });

    async function reliquaryZap(calls: string[]) {
        submit({
            args: [calls],
            toastText:
                type === 'WITHDRAW'
                    ? 'Withdraw toast text'
                    : type === 'MIGRATE'
                    ? 'Migrate toast text'
                    : 'Join toast text',
            walletText:
                type === 'WITHDRAW'
                    ? 'Withdraw wallet text'
                    : type === 'MIGRATE'
                    ? 'Migrate wallet text'
                    : 'Join wallet text',
        });
    }

    return {
        reliquaryZap,
        ...rest,
    };
}
