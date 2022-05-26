import { usePool } from '~/modules/pool/lib/usePool';
import { useReactiveVar } from '@apollo/client';
import { withdrawStateVar } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { useQuery } from 'react-query';
import { usePoolUserPoolTokenBalances } from '~/modules/pool/lib/usePoolUserPoolTokenBalances';

export function usePoolExitGetSingleAssetWithdrawForBptIn() {
    const { poolService } = usePool();
    const { singleAsset } = useReactiveVar(withdrawStateVar);
    const { userTotalBptBalance } = usePoolUserPoolTokenBalances();

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
