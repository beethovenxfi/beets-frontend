import { useQuery } from 'react-query';
import { reliquaryZapService } from '~/lib/services/staking/reliquary-zap.service';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useSlippage } from '~/lib/global/useSlippage';
import { useBalances } from '~/lib/util/useBalances';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { AmountHumanReadable } from '~/lib/services/token/token-types';

export function useReliquaryDepositContractCallData({
    beetsAmount,
    ftmAmount,
    isNativeFtm,
}: {
    beetsAmount: AmountHumanReadable;
    ftmAmount: AmountHumanReadable;
    isNativeFtm: boolean;
}) {
    const { userAddress } = useUserAccount();
    const { slippage } = useSlippage();

    const query = useQuery(
        ['reliquaryDepositContractCallData', userAddress, slippage, beetsAmount, ftmAmount, isNativeFtm],
        async () => {
            return reliquaryZapService.getReliquaryDepositContractCallData({
                userAddress: userAddress || '',
                slippage,
                beetsAmount,
                ftmAmount,
                isNativeFtm,
                //TODO: set a relic id here if the user already has a relic
                relicId: undefined,
            });
        },
        { enabled: !!userAddress },
    );

    return {
        ...query,
    };
}
