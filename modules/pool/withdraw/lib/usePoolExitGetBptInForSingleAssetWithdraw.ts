import { usePool } from '~/modules/pool/lib/usePool';
import { useReactiveVar } from '@apollo/client';
import { withdrawStateVar } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { useQuery } from 'react-query';

export function usePoolExitGetBptInForSingleAssetWithdraw() {
    const { poolService } = usePool();
    const { singleAsset } = useReactiveVar(withdrawStateVar);

    return useQuery(
        ['exitGetBptInForSingleAssetWithdraw', singleAsset],
        async () => {
            if (!singleAsset || singleAsset.amount === '') {
                return {
                    bptIn: '0',
                    priceImpact: 0,
                };
            }

            return poolService.exitGetBptInForSingleAssetWithdraw(singleAsset);
        },
        { enabled: !!singleAsset },
    );
}
