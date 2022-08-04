import { useAccount } from 'wagmi';
import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import { networkConfig } from '~/lib/config/network-config';
import BeethovenxMasterChefAbi from '~/lib/abi/BeethovenxMasterChef.json';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { parseUnits } from 'ethers/lib/utils';
import { GqlPoolStaking } from '~/apollo/generated/graphql-codegen-generated';
import LiquidityGaugeV5 from '~/lib/abi/LiquidityGaugeV5.json';
import { tokenFormatAmount } from '~/lib/services/token/token-util';

export function useStakingDeposit(staking: GqlPoolStaking | null) {
    const { data: accountData } = useAccount();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        contractConfig: {
            addressOrName: staking?.type === 'GAUGE' ? staking?.address : networkConfig.masterChefContractAddress,
            contractInterface: staking?.type === 'GAUGE' ? LiquidityGaugeV5 : BeethovenxMasterChefAbi,
        },
        functionName: staking?.type === 'GAUGE' ? 'deposit(uint256)' : 'deposit',
        transactionType: 'STAKE',
    });

    function stake(amount: AmountHumanReadable) {
        if (staking) {
            switch (staking.type) {
                case 'MASTER_CHEF':
                case 'FRESH_BEETS':
                    return submit({
                        args: [staking.farm?.id, parseUnits(amount, 18), accountData?.address],
                        toastText: `Stake BPT into ${networkConfig.farmTypeName}`,
                        walletText: `Stake ${tokenFormatAmount(amount)} BPT into ${networkConfig.farmTypeName}`,
                    });
                case 'GAUGE':
                    return submit({
                        args: [parseUnits(amount, 18)],
                        toastText: `Stake BPT into ${networkConfig.farmTypeName}`,
                        walletText: `Stake ${tokenFormatAmount(amount)} BPT into ${networkConfig.farmTypeName}`,
                    });
            }
        }
    }

    return {
        stake,
        ...rest,
    };
}
