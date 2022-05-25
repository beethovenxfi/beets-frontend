import { GqlToken, useGetTokenPricesQuery, useGetTokensQuery } from '~/apollo/generated/graphql-codegen-generated';
import { keyBy } from 'lodash';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import numeral from 'numeral';

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

    function priceForAmount(tokenAmount: TokenAmountHumanReadable): number {
        return priceFor(tokenAmount.address) * parseFloat(tokenAmount.amount);
    }

    function formattedPrice(tokenAmount: TokenAmountHumanReadable): string {
        return numeral(priceForAmount(tokenAmount)).format('$0,0.00');
    }

    return {
        tokens: tokens.filter((token) => token.tradable),
        allTokens: tokens,
        prices,
        priceFor,
        getToken,
        formattedPrice,
        priceForAmount,
    };
}
