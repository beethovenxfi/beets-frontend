import { useSubmitTransaction, vaultContractConfig } from '~/lib/util/useSubmitTransaction';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { parseUnits } from 'ethers/lib/utils';
import { GqlPoolMinimalFragment } from '~/apollo/generated/graphql-codegen-generated';
import { defaultAbiCoder } from '@ethersproject/abi';
import { useUserAccount } from '~/lib/user/useUserAccount';

export function useDoRecoveryExit(pool: GqlPoolMinimalFragment, assets: string[], onSettled: () => void) {
    const { userAddress } = useUserAccount();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            ...vaultContractConfig,
            functionName: 'exitPool',
            onSettled,
        },
        transactionType: 'EXIT',
    });

    function doRecoveryExit(amount: AmountHumanReadable) {
        const userData = defaultAbiCoder.encode(['uint256', 'uint256'], [255, parseUnits(amount, 18)]);

        submit({
            args: [
                pool.id,
                userAddress,
                userAddress,
                {
                    assets,
                    minAmountsOut: assets.map((asset) => '0'),
                    userData,
                    toInternalBalance: false,
                },
            ],
            toastText: `Recovery exit from ${pool.name}`,
            walletText: `Withdraw from ${pool.name} with ${amount} BPT`,
        });
    }

    return {
        doRecoveryExit,
        ...rest,
    };
}
