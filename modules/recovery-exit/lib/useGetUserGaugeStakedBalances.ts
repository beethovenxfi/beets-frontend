import { useProvider, useQuery } from 'wagmi';
import { gaugeStakingService } from '~/lib/services/staking/gauge-staking.service';
import { AmountHumanReadable, TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { useUserAccount } from '~/lib/user/useUserAccount';

export function useGetUserGaugeStakedBalances(stakingAddresses: string[]) {
    const { userAddress } = useUserAccount();
    const provider = useProvider();

    return useQuery(
        ['userGaugeStakedBalances', userAddress || '', stakingAddresses],
        async (): Promise<AmountHumanReadable | TokenAmountHumanReadable[]> => {
            if (!userAddress) {
                return '0';
            }
            const balances = [];
            for (const stakingAddress of stakingAddresses) {
                const balance = await gaugeStakingService.getUserStakedBalance({
                    userAddress,
                    gaugeAddress: stakingAddress || '',
                    provider,
                });
                balances.push({
                    address: stakingAddress,
                    amount: balance,
                });
            }
            return balances;
        },
        {},
    );
}
