import { useReactiveVar } from '@apollo/client';
import { withdrawStateVar } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { useQuery } from 'react-query';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { usePool } from '~/modules/pool/lib/usePool';
import useReliquary from '~/modules/reliquary/lib/useReliquary';

export function usePoolExitGetSingleAssetWithdrawForBptIn() {
    const { poolService } = usePool();
    const { singleAsset, isReliquaryWithdraw } = useReactiveVar(withdrawStateVar);
    const { userWalletBptBalance } = usePoolUserBptBalance();
    const { selectedRelic } = useReliquary();

    const bptIn = isReliquaryWithdraw ? selectedRelic?.amount || '' : userWalletBptBalance;

    return useQuery(
        ['exitGetSingleAssetWithdrawForBptIn', bptIn, singleAsset?.address],
        async () => {
            if (!singleAsset) {
                return {
                    tokenAmount: '0',
                    priceImpact: 0,
                };
            }

            return poolService.exitGetSingleAssetWithdrawForBptIn(bptIn, singleAsset.address);
        },
        { enabled: !!singleAsset },
    );
}
