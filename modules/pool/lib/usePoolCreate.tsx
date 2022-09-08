import { makeVar, useReactiveVar } from '@apollo/client';

const tokensSelectedVar = makeVar<string[]>([]);

export function usePoolCreate() {
    const tokensSelected = useReactiveVar(tokensSelectedVar);

    function setTokensSelected(selected: string) {
        tokensSelected.push(selected);
        tokensSelectedVar(tokensSelected);
    }

    return {
        tokensSelected,
        setTokensSelected,
    };
}
