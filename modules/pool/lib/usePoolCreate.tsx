import { makeVar, useReactiveVar } from '@apollo/client';

const tokensSelectedVar = makeVar<string[]>([]);

export function usePoolCreate() {
    const tokensSelected = useReactiveVar(tokensSelectedVar);

    function setTokensSelected(selected: string) {
        tokensSelectedVar([...tokensSelected, selected]);
    }

    return {
        tokensSelected,
        setTokensSelected,
    };
}
