import { GqlToken, useGetTokensQuery } from '~/apollo/generated/graphql-codegen-generated';

export function useGetTokens() {
    const { data } = useGetTokensQuery({ fetchPolicy: 'cache-only' });
    const tokens = data?.tokens || [];

    function getToken(address: string): GqlToken | null {
        const token = tokens.find((token) => token.address === address.toLowerCase());

        return token || null;
    }

    return {
        tokens,
        getToken,
    };
}

/*

export function useGetTokens(addresses: string[]): GqlToken[] {
    const { data } = useGetTokensQuery({ fetchPolicy: 'cache-only' });
    const formatted = addresses.map((address) => address.toLowerCase());
    const tokens = data?.tokens.filter((token) => formatted.includes(token.address.toLowerCase()));

    addresses.map((address) => {});

    return tokens || [];
}
*/
