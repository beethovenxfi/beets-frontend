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

export function usePoolCreate() {
    const tokensSelected = useReactiveVar(tokensSelectedVar);
    const poolDetails = useReactiveVar(poolDetailsVar);
    const tokenDetails = useReactiveVar(tokenDetailsVar);

    function setTokensSelected(selected: string) {
        tokensSelectedVar([...tokensSelected, selected]);
    }

    function setPoolDetails(details: PoolDetails) {
        poolDetailsVar(details);
    }

    function setTokenDetails(details: TokenDetails[]) {
        tokenDetailsVar(details);
    }

    return {
        tokensSelected,
        poolDetails,
        tokenDetails,
        setTokensSelected,
        setPoolDetails,
        setTokenDetails,
    };
}
