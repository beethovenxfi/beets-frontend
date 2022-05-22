import { usePool } from '~/modules/pool/lib/usePool';
import { useReactiveVar } from '@apollo/client';
import { useState } from 'react';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { useAsyncEffect } from '~/lib/util/custom-hooks';
import { withdrawStateVar } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { usePoolUserBalances } from '~/modules/pool/lib/usePoolUserBalances';
import { oldBnumScaleAmount, oldBnumToHumanReadable } from '~/lib/services/pool/lib/old-big-number';
import { PoolExitContractCallData } from '~/lib/services/pool/pool-types';
import { useSlippage } from '~/lib/global/useSlippage';

export function useWithdrawProportionalAmounts() {
    const { poolService } = usePool();
    const { userBptBalance } = usePoolUserBalances();
    const { proportionalPercent } = useReactiveVar(withdrawStateVar);
    const [proportionalAmounts, setProportionalAmounts] = useState<TokenAmountHumanReadable[]>([]);
    const [loading, setLoading] = useState(false);
    const [contractCallData, setContractCallData] = useState<PoolExitContractCallData | null>(null);
    const { slippage } = useSlippage();

    useAsyncEffect(async () => {
        try {
            setLoading(true);

            const userBptRatio = oldBnumToHumanReadable(
                oldBnumScaleAmount(userBptBalance).times(proportionalPercent / 100),
            );
            const result = await poolService.exitGetProportionalWithdrawEstimate(userBptRatio);

            setProportionalAmounts(result);

            const contractData = await poolService.exitGetContractCallData({
                kind: 'ExactBPTInForTokensOut',
                amountsOut: result,
                bptAmountIn: userBptRatio,
                slippage: parseFloat(slippage),
            });

            setContractCallData(contractData);
        } catch (e) {
            console.log('e', e);
        }

        setLoading(false);
    }, [proportionalPercent]);

    return {
        proportionalAmounts,
        loading,
        contractCallData,
    };
}
