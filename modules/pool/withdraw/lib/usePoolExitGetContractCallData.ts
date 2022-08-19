import { useQuery } from 'react-query';
import { useReactiveVar } from '@apollo/client';
import { withdrawStateVar } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { usePoolExitGetProportionalWithdrawEstimate } from '~/modules/pool/withdraw/lib/usePoolExitGetProportionalWithdrawEstimate';
import { usePoolExitGetBptInForSingleAssetWithdraw } from '~/modules/pool/withdraw/lib/usePoolExitGetBptInForSingleAssetWithdraw';
import { oldBnumScaleAmount, oldBnumToHumanReadable } from '~/lib/services/pool/lib/old-big-number';
import { useSlippage } from '~/lib/global/useSlippage';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { usePool } from '~/modules/pool/lib/usePool';
import { usePoolExitGetSingleAssetWithdrawForBptIn } from '~/modules/pool/withdraw/lib/usePoolExitGetSingleAssetWithdrawForBptIn';

export function usePoolExitGetContractCallData() {
    const { userAddress } = useUserAccount();
    const { type, singleAsset, proportionalPercent } = useReactiveVar(withdrawStateVar);
    const { poolService, pool } = usePool();
    const { userWalletBptBalance } = usePoolUserBptBalance();
    const { data: proportionalAmountsOut, error, isLoading } = usePoolExitGetProportionalWithdrawEstimate();
    const { data: singleAssetWithdrawEstimate } = usePoolExitGetBptInForSingleAssetWithdraw();
    const { data: singleAssetWithdrawForMaxBptIn } = usePoolExitGetSingleAssetWithdrawForBptIn();
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
            slippage,
        ],
        () => {
            if (type === 'PROPORTIONAL' && proportionalAmountsOut) {
                const userBptRatio = oldBnumToHumanReadable(
                    oldBnumScaleAmount(userWalletBptBalance).times(proportionalPercent / 100),
                );

                return poolService.exitGetContractCallData({
                    kind: 'ExactBPTInForTokensOut',
                    amountsOut: proportionalAmountsOut,
                    bptAmountIn: userBptRatio,
                    slippage,
                    userAddress: userAddress || '',
                });
            } else if (
                type === 'SINGLE_ASSET' &&
                singleAsset &&
                singleAssetWithdrawEstimate &&
                singleAsset.amount !== ''
            ) {
                const isSingleAssetMax = singleAsset.amount === singleAssetWithdrawForMaxBptIn?.tokenAmount;

                return poolService.exitGetContractCallData({
                    kind: 'ExactBPTInForOneTokenOut',
                    bptAmountIn: isSingleAssetMax ? userWalletBptBalance : singleAssetWithdrawEstimate.bptIn,
                    tokenOutAddress: singleAsset.address,
                    slippage,
                    amountOut: singleAsset.amount,
                    userAddress: userAddress || '',
                });
            }

            return null;
        },
        {},
    );
}
