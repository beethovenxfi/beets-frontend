import { makeVar, useReactiveVar } from '@apollo/client';

interface PoolDetails {
    name: string;
    owner: string;
    symbol: string;
    fee: number;
}

const tokensSelectedVar = makeVar<string[]>([]);

const initialValues: PoolDetails = {
    name: '',
    owner: '0xCd983793ADb846dcE4830c22F30C7Ef0C864a776',
    symbol: '',
    fee: 0,
};

const poolDetailsVar = makeVar<PoolDetails>(initialValues);

export function usePoolCreate() {
    const tokensSelected = useReactiveVar(tokensSelectedVar);
    const poolDetails = useReactiveVar(poolDetailsVar);

    function setTokensSelected(selected: string) {
        tokensSelectedVar([...tokensSelected, selected]);
    }

    function setPoolDetails(details: PoolDetails) {
        poolDetailsVar(details);
    }

    return {
        tokensSelected,
        poolDetails,
        setTokensSelected,
        setPoolDetails,
    };
}
