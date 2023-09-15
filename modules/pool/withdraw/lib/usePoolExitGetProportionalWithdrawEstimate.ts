import { useReactiveVar } from '@apollo/client';
import { withdrawStateVar } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { useQuery } from 'react-query';
import { oldBnumScaleAmount, oldBnumToHumanReadable } from '~/lib/services/pool/lib/old-big-number';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { useWithdraw } from '~/modules/pool/withdraw/lib/useWithdraw';
import { usePool } from '~/modules/pool/lib/usePool';
import useReliquary from '~/modules/reliquary/lib/useReliquary';
import { networkConfig } from '~/lib/config/network-config';

export function usePoolExitGetProportionalWithdrawEstimate() {
    const { poolService, pool } = usePool();
    const { userWalletBptBalance } = usePoolUserBptBalance();
    const { proportionalPercent } = useReactiveVar(withdrawStateVar);
    const { selectedWithdrawTokenAddresses } = useWithdraw();
    const { selectedRelic } = useReliquary();

    const isReliquary = pool.id === networkConfig.reliquary.fbeets.poolId;
    const balance = isReliquary && selectedRelic ? selectedRelic.amount : userWalletBptBalance;
    const bptIn = oldBnumToHumanReadable(oldBnumScaleAmount(balance).times(proportionalPercent / 100));

    return useQuery(
        ['exitGetProportionalWithdrawEstimate', pool.id, bptIn, selectedWithdrawTokenAddresses],
        async () => {
            const result = await poolService.exitGetProportionalWithdrawEstimate(bptIn, selectedWithdrawTokenAddresses);

            return result;
        },
        {},
    );
}
