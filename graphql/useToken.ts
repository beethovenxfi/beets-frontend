import { GqlToken, useGetTokenPricesQuery, useGetTokensQuery } from '~/apollo/generated/graphql-codegen-generated';
import { getAddress } from '@ethersproject/address';
import { keyBy } from 'lodash';

export function useGetTokens() {
    const { data: tokensResponse } = useGetTokensQuery({ fetchPolicy: 'cache-first' });
    const { data: pricesResponse } = useGetTokenPricesQuery({ fetchPolicy: 'cache-first' });

    const tokens = tokensResponse?.tokens || [];
    const prices = keyBy(pricesResponse?.tokenPrices || [], 'address');;

    function getToken(address: string): GqlToken | null {
        const token = tokens.find((token) => token.address === address?.toLowerCase());
        return token || null;
    }

    function priceFor(address: string): number {
        return prices[address?.toLowerCase()]?.price || 0;
    }

    return {
        tokens,
        prices,
        priceFor,
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
