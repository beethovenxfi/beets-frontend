import { useAccount } from 'wagmi';
import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import { networkConfig } from '~/lib/config/network-config';
import BeethovenxMasterChefAbi from '~/lib/abi/BeethovenxMasterChef.json';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { parseUnits } from 'ethers/lib/utils';

export function useMasterChefWithdrawFromFarm() {
    const { data: accountData } = useAccount();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        contractConfig: {
            addressOrName: networkConfig.masterChefContractAddress,
            contractInterface: BeethovenxMasterChefAbi,
        },
        functionName: 'withdrawAndHarvest',
        transactionType: 'UNSTAKE',
    });

    function withdraw(farmId: string, amount: AmountHumanReadable) {
        submit({
            args: [farmId, parseUnits(amount, 18), accountData?.address],
            toastText: 'Withdraw and harvest',
        });
    }

    return {
        withdraw,
        ...rest,
    };
}
