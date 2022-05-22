import { makeVar, useReactiveVar } from '@apollo/client';
import { AmountHumanReadable } from '~/lib/services/token/token-types';

//TODO should preserve this in the browser cache and reload it
const slippageVar = makeVar<AmountHumanReadable>('0.01');

export function useSlippage() {
    const slippage = useReactiveVar(slippageVar);

    function setSlippage(amount: AmountHumanReadable) {
        slippageVar(amount);
    }

    return {
        slippage,
        setSlippage,
    };
}
