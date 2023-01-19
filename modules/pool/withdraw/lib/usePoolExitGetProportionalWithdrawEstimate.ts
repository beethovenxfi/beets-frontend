import { useReactiveVar } from '@apollo/client';
import { withdrawStateVar } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { useQuery } from 'react-query';
import { oldBnumScaleAmount, oldBnumToHumanReadable } from '~/lib/services/pool/lib/old-big-number';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { useWithdraw } from '~/modules/pool/withdraw/lib/useWithdraw';
import { usePool } from '~/modules/pool/lib/usePool';
import useReliquary from '~/modules/reliquary/lib/useReliquary';

export function usePoolExitGetProportionalWithdrawEstimate(isReliquaryWithdraw = false) {
    const { poolService, pool } = usePool();
    const { userWalletBptBalance } = usePoolUserBptBalance();
    const { proportionalPercent } = useReactiveVar(withdrawStateVar);
    const { selectedRelic } = useReliquary();
    const bptIn = oldBnumToHumanReadable(
        oldBnumScaleAmount(isReliquaryWithdraw ? selectedRelic?.amount || '' : userWalletBptBalance).times(
            proportionalPercent / 100,
        ),
    );
    const { selectedWithdrawTokenAddresses } = useWithdraw();

    return useQuery(
        ['exitGetProportionalWithdrawEstimate', pool.id, bptIn, selectedWithdrawTokenAddresses],
        async () => {
            const result = await poolService.exitGetProportionalWithdrawEstimate(bptIn, selectedWithdrawTokenAddresses);

            return result;
        },
        {},
    );
}
