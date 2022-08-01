import { makeVar, useReactiveVar } from '@apollo/client';
import { AmountHumanReadable } from '~/lib/services/token/token-types';

//TODO should preserve this in the browser cache and reload it
const slippageVar = makeVar<AmountHumanReadable>('0.005');

export function useSlippage() {
    const slippage = useReactiveVar(slippageVar);
    const slippageDifference = 1 - parseFloat(slippage);
    const slippageAddition = 1 + parseFloat(slippage);

    function setSlippage(amount: AmountHumanReadable) {
        slippageVar(amount);
    }

    return {
        slippage,
        slippageDifference,
        slippageAddition,
        setSlippage,
    };
}
