import { usePool } from '~/modules/pool/lib/usePool';
import { useQuery } from 'react-query';
import { useReactiveVar } from '@apollo/client';
import { withdrawStateVar } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { usePoolExitGetProportionalWithdrawEstimate } from '~/modules/pool/withdraw/lib/usePoolExitGetProportionalWithdrawEstimate';
import { usePoolExitGetBptInForSingleAssetWithdraw } from '~/modules/pool/withdraw/lib/usePoolExitGetBptInForSingleAssetWithdraw';
import { oldBnumScaleAmount, oldBnumToHumanReadable } from '~/lib/services/pool/lib/old-big-number';
import { usePoolUserBalances } from '~/modules/pool/lib/usePoolUserBalances';
import { useSlippage } from '~/lib/global/useSlippage';

export function usePoolExitGetContractCallData() {
    const { type, singleAsset, proportionalPercent } = useReactiveVar(withdrawStateVar);
    const { poolService, pool } = usePool();
    const { userBptBalance } = usePoolUserBalances();
    const { data: proportionalAmountsOut, error, isError, isLoading } = usePoolExitGetProportionalWithdrawEstimate();
    const { data: singleAssetWithdrawEstimate } = usePoolExitGetBptInForSingleAssetWithdraw();
    const { slippage } = useSlippage();

    return useQuery(
        [
            'exitGetContractCallData',
            pool.id,
            type,
            singleAsset,
            proportionalPercent,
            proportionalAmountsOut,
            singleAssetWithdrawEstimate,
        ],
        () => {
            if (!proportionalAmountsOut) {
                console.log('error', isLoading, error);
            }

            if (type === 'PROPORTIONAL' && proportionalAmountsOut) {
                const userBptRatio = oldBnumToHumanReadable(
                    oldBnumScaleAmount(userBptBalance).times(proportionalPercent / 100),
                );

                return poolService.exitGetContractCallData({
                    kind: 'ExactBPTInForTokensOut',
                    amountsOut: proportionalAmountsOut,
                    bptAmountIn: userBptRatio,
                    slippage: parseFloat(slippage),
                });
            } else if (
                type === 'SINGLE_ASSET' &&
                singleAsset &&
                singleAssetWithdrawEstimate &&
                singleAsset.amount !== ''
            ) {
                return poolService.exitGetContractCallData({
                    kind: 'ExactBPTInForOneTokenOut',
                    bptAmountIn: singleAssetWithdrawEstimate.bptIn,
                    tokenOutAddress: singleAsset.address,
                    userBptBalance,
                    slippage: parseFloat(slippage),
                    amountOut: singleAsset.amount,
                });
            }

            return null;
        },
        {},
    );
}
