import { usePool } from '~/modules/pool/lib/usePool';
import { useReactiveVar } from '@apollo/client';
import { withdrawStateVar } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { useQuery } from 'react-query';
import { usePoolUserBalances } from '~/modules/pool/lib/usePoolUserBalances';

export function usePoolExitGetSingleAssetWithdrawForBptIn() {
    const { poolService } = usePool();
    const { singleAsset } = useReactiveVar(withdrawStateVar);
    const { userBptBalance } = usePoolUserBalances();

    return useQuery(
        ['exitGetSingleAssetWithdrawForBptIn', userBptBalance, singleAsset],
        async () => {
            if (!singleAsset) {
                return {
                    tokenAmount: '0',
                    priceImpact: 0,
                };
            }

            return poolService.exitGetSingleAssetWithdrawForBptIn(userBptBalance, singleAsset.address);
        },
        { enabled: !!singleAsset },
    );
}
