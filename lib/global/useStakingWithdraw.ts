import { useAccount } from 'wagmi';
import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import BeethovenxMasterChefAbi from '~/lib/abi/BeethovenxMasterChef.json';
import LiquidityGaugeV5 from '~/lib/abi/LiquidityGaugeV5.json';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { parseUnits } from 'ethers/lib/utils';
import { GqlPoolStaking } from '~/apollo/generated/graphql-codegen-generated';

export function useStakingWithdraw(staking?: GqlPoolStaking | null) {
    const { data: accountData } = useAccount();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        contractConfig: {
            addressOrName: staking?.address || '',
            contractInterface: staking?.type === 'GAUGE' ? LiquidityGaugeV5 : BeethovenxMasterChefAbi,
        },
        functionName: staking?.type === 'GAUGE' ? 'withdraw(uint256,bool)' : 'withdrawAndHarvest',
        transactionType: 'UNSTAKE',
    });

    function withdraw(amount: AmountHumanReadable) {
        if (staking) {
            switch (staking.type) {
                case 'FRESH_BEETS':
                case 'MASTER_CHEF':
                    return submit({
                        args: [staking.farm?.id, parseUnits(amount, 18), accountData?.address],
                        toastText: 'Withdraw and claim rewards',
                    });
                case 'GAUGE':
                    return submit({
                        args: [parseUnits(amount, 18), true],
                        toastText: 'Withdraw and claim rewards',
                    });
            }
        }
    }

    return {
        withdraw,
        ...rest,
    };
}
