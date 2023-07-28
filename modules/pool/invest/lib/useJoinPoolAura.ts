import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { networkConfig } from '~/lib/config/network-config';
import BoosterLiteAbi from '~/lib/abi/BoosterLite.json';
import { BigNumberish } from 'ethers';

export function useJoinPoolAura(pool: GqlPoolUnion) {
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: networkConfig.aura.boosterLite,
            contractInterface: BoosterLiteAbi,
            functionName: 'deposit',
        },
        transactionType: 'STAKE',
    });

    function joinPoolAura(auraPoolId: number | undefined, amount: BigNumberish) {
        if (!auraPoolId) {
            return;
        }
        submit({
            args: [auraPoolId, amount, true],
            toastText: 'Depositing & staking in Aura',
            walletText: `Deposit & stake ${pool.name} BPT in Aura`,
        });
    }

    return {
        joinPoolAura,
        ...rest,
    };
}
