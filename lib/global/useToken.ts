import { GqlToken, useGetTokenPricesQuery, useGetTokensQuery } from '~/apollo/generated/graphql-codegen-generated';
import { keyBy } from 'lodash';

export function useGetTokens() {
    const { data: tokensResponse } = useGetTokensQuery({ fetchPolicy: 'cache-first' });
    const { data: pricesResponse } = useGetTokenPricesQuery({ pollInterval: 30000, fetchPolicy: 'cache-first' });

    const tokens = tokensResponse?.tokens || [];
    const prices = keyBy(pricesResponse?.tokenPrices || [], 'address');

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
