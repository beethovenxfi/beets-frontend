import { usePool } from '~/modules/pool/lib/usePool';
import { useReactiveVar } from '@apollo/client';
import { useState } from 'react';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { useAsyncEffect } from '~/lib/util/custom-hooks';
import { withdrawStateVar } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { usePoolUserBalances } from '~/modules/pool/lib/usePoolUserBalances';
import { parseUnits } from 'ethers/lib/utils';
import { useSlippage } from '~/lib/global/useSlippage';
import { PoolExitContractCallData } from '~/lib/services/pool/pool-types';

export function useWithdrawSingleAsset() {
    const { poolService, allTokens } = usePool();
    const { userBptBalance } = usePoolUserBalances();
    const { type, singleAsset } = useReactiveVar(withdrawStateVar);
    const [maxAmount, setMaxAmount] = useState<AmountHumanReadable>('0');
    const [bptIn, setBptIn] = useState<AmountHumanReadable>('0');
    const [contractCallData, setContractCallData] = useState<PoolExitContractCallData | null>(null);
    const [priceImpact, setPriceImpact] = useState<number>(0);
    const [loadingMax, setLoadingMax] = useState(false);
    const [loadingEstimate, setLoadingEstimate] = useState(false);
    const withdrawToken = allTokens.find((token) => token.address === singleAsset?.address);
    const { slippage } = useSlippage();

    useAsyncEffect(async () => {
        if (singleAsset) {
            try {
                setLoadingMax(true);

                const result = await poolService.exitGetSingleAssetWithdrawForBptIn(
                    userBptBalance,
                    singleAsset.address,
                );

                setMaxAmount(result.tokenAmount);
                setPriceImpact(result.priceImpact);
            } catch (e) {
                console.log('e', e);
            }
        }

        setLoadingMax(false);
    }, [singleAsset?.address]);

    useAsyncEffect(async () => {
        if (!singleAsset || !withdrawToken || singleAsset.amount === '') {
            setBptIn('0');
            setPriceImpact(0);

            return;
        }

        const singleAssetAmountScaled = parseUnits(singleAsset.amount, withdrawToken.decimals);
        const maxAmountScaled = parseUnits(maxAmount, withdrawToken.decimals);

        if (singleAssetAmountScaled.gt(0) && singleAssetAmountScaled.lte(maxAmountScaled)) {
            try {
                setLoadingEstimate(true);

                const result = await poolService.exitGetBptInForSingleAssetWithdraw(singleAsset);

                setBptIn(result.bptIn);
                setPriceImpact(result.priceImpact);

                const data = await poolService.exitGetContractCallData({
                    kind: 'ExactBPTInForOneTokenOut',
                    bptAmountIn: result.bptIn,
                    tokenOutAddress: singleAsset.address,
                    userBptBalance,
                    slippage: parseFloat(slippage),
                    amountOut: singleAsset.amount,
                });

                setContractCallData(data);
            } catch (e) {
                console.log('e', e);
                setBptIn('0');
                setPriceImpact(0);
            }
        } else {
            setBptIn('0');
            setPriceImpact(0);
        }

        setLoadingEstimate(false);
    }, [singleAsset?.amount]);

    return {
        maxAmount,
        priceImpact,
        loadingMax,
        bptIn,
        contractCallData,
    };
}
