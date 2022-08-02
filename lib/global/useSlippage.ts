import { makeVar, useReactiveVar } from '@apollo/client';
import { AmountHumanReadable } from '~/lib/services/token/token-types';

const SLIPPAGE_CACHE_KEY = 'SLIPPAGE';
const cached = typeof window !== 'undefined' ? localStorage.getItem(SLIPPAGE_CACHE_KEY) : null;

const slippageVar = makeVar<AmountHumanReadable>(cached || '0.005');

export function useSlippage() {
    const slippage = useReactiveVar(slippageVar);
    const slippageDifference = 1 - parseFloat(slippage);
    const slippageAddition = 1 + parseFloat(slippage);

    function setSlippage(amount: AmountHumanReadable) {
        slippageVar(amount);

        localStorage.setItem(SLIPPAGE_CACHE_KEY, amount);
    }

    return {
        slippage,
        slippageDifference,
        slippageAddition,
        setSlippage,
    };
}
