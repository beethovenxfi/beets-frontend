import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import BeethovenxMasterChefAbi from '~/lib/abi/BeethovenxMasterChef.json';
import LiquidityGaugeV5 from '~/lib/abi/LiquidityGaugeV5.json';
import LiquidityGaugeV6 from '~/lib/abi/LiquidityGaugeV6.json';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { parseUnits } from 'ethers/lib/utils';
import { GqlPoolStaking, GqlPoolStakingOtherGauge } from '~/apollo/generated/graphql-codegen-generated';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

function getGaugeABI(gaugeVersion: number | undefined) {
    if (gaugeVersion === 2) {
        return LiquidityGaugeV6;
    }
    return LiquidityGaugeV5;
}

function getGaugeFunctionCall(gaugeVersion: number | undefined) {
    if (gaugeVersion === 2) {
        return 'withdraw(uint256)';
    }
    return 'withdraw(uint256,bool)';
}

export function useStakingWithdraw(staking?: GqlPoolStaking | null, customWithdrawalGauge?: GqlPoolStakingOtherGauge) {
    const networkConfig = useNetworkConfig();
    const { userAddress } = useUserAccount();
    const withdrawFrom = customWithdrawalGauge?.gaugeAddress || staking?.address || '';
    const gaugeVersion = customWithdrawalGauge?.version || staking?.gauge?.version;

    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: staking?.type === 'GAUGE' ? withdrawFrom : networkConfig.masterChefContractAddress,
            contractInterface: staking?.type === 'GAUGE' ? getGaugeABI(gaugeVersion) : BeethovenxMasterChefAbi,
            functionName: staking?.type === 'GAUGE' ? getGaugeFunctionCall(gaugeVersion) : 'withdrawAndHarvest',
        },
        transactionType: 'UNSTAKE',
    });

    function withdraw(amount: AmountHumanReadable) {
        const gaugeVersion = customWithdrawalGauge?.version || staking?.gauge?.version;

        if (staking) {
            switch (staking.type) {
                case 'GAUGE':
                    if (gaugeVersion === 1) {
                        return submit({
                            args: [parseUnits(amount, 18), true],
                            toastText: 'Withdraw and claim rewards',
                        });
                    }
                    if (gaugeVersion === 2) {
                        return submit({
                            args: [parseUnits(amount, 18)],
                            toastText: 'Withdraw and claim rewards',
                        });
                    }
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
