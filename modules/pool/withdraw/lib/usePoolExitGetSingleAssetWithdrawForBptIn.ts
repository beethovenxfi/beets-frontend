import { usePool } from '~/modules/pool/lib/usePool';
import { useReactiveVar } from '@apollo/client';
import { withdrawStateVar } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { useQuery } from 'react-query';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';

export function usePoolExitGetSingleAssetWithdrawForBptIn() {
    const { poolService } = usePool();
    const { singleAsset } = useReactiveVar(withdrawStateVar);
    const { userTotalBptBalance } = usePoolUserBptBalance();

    return useQuery(
        ['exitGetSingleAssetWithdrawForBptIn', userTotalBptBalance, singleAsset],
        async () => {
            if (!singleAsset) {
                return {
                    tokenAmount: '0',
                    priceImpact: 0,
                };
            }

            return poolService.exitGetSingleAssetWithdrawForBptIn(userTotalBptBalance, singleAsset.address);
        },
        { enabled: !!singleAsset },
    );
}
