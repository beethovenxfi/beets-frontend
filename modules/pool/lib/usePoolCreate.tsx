import { makeVar, useReactiveVar } from '@apollo/client';

interface PoolDetails {
    name: string;
    owner: string;
    symbol: string;
    fee: number;
}

interface TokenDetails {
    address: string;
    weight: number;
    amount: number;
}

interface AmountDetails {
    address: string;
    amount: number;
}

const tokensSelectedVar = makeVar<string[]>([]);

const initialValues: PoolDetails = {
    name: '',
    owner: '0xCd983793ADb846dcE4830c22F30C7Ef0C864a776',
    symbol: '',
    fee: 0,
};

const poolDetailsVar = makeVar<PoolDetails>(initialValues);
const tokenDetailsVar = makeVar<TokenDetails[]>([]);
const amountDetailsVar = makeVar<AmountDetails[]>([]);

export function usePoolCreate() {
    const tokensSelected = useReactiveVar(tokensSelectedVar);
    const poolDetails = useReactiveVar(poolDetailsVar);
    const tokenDetails = useReactiveVar(tokenDetailsVar);
    const amountDetails = useReactiveVar(tokenDetailsVar);

    function setTokensSelected(selected: string, remove = false) {
        if (remove) {
            tokensSelectedVar(tokensSelected.filter((token) => token !== selected));
        } else {
            tokensSelectedVar([...tokensSelected, selected]);
        }
    }

    function setPoolDetails(details: PoolDetails) {
        poolDetailsVar(details);
    }

    function setTokenDetails(details: TokenDetails[]) {
        tokenDetailsVar(details);
    }

    function setAmountDetails(details: AmountDetails[]) {
        amountDetailsVar(details);
    }

    return {
        tokensSelected,
        poolDetails,
        tokenDetails,
        amountDetails,
        setTokensSelected,
        setPoolDetails,
        setTokenDetails,
        setAmountDetails,
    };
}
