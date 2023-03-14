import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import BeethovenxMasterChefAbi from '~/lib/abi/BeethovenxMasterChef.json';
import LiquidityGaugeV5 from '~/lib/abi/LiquidityGaugeV5.json';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { parseUnits } from 'ethers/lib/utils';
import { GqlPoolStaking } from '~/apollo/generated/graphql-codegen-generated';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function useStakingWithdraw(staking?: GqlPoolStaking | null) {
    const networkConfig = useNetworkConfig();
    const { userAddress } = useUserAccount();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: staking?.type === 'GAUGE' ? staking?.address : networkConfig.masterChefContractAddress,
            contractInterface: staking?.type === 'GAUGE' ? LiquidityGaugeV5 : BeethovenxMasterChefAbi,
            functionName: staking?.type === 'GAUGE' ? 'withdraw(uint256,bool)' : 'withdrawAndHarvest',
        },
        transactionType: 'UNSTAKE',
    });

    function withdraw(amount: AmountHumanReadable) {
        if (staking) {
            switch (staking.type) {
                case 'GAUGE':
                    return submit({
                        args: [parseUnits(amount, 18), true],
                        toastText: 'Withdraw and claim rewards',
                    });
                case 'FRESH_BEETS':
                case 'MASTER_CHEF':
                default:
                    return submit({
                        args: [staking.farm?.id, parseUnits(amount, 18), userAddress],
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
