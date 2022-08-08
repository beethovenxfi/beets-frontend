import { GqlToken, useGetTokenPricesQuery, useGetTokensQuery } from '~/apollo/generated/graphql-codegen-generated';
import { keyBy } from 'lodash';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';
import { useUserImportedTokens } from '~/lib/user/useUserImportedTokens';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { createContext, ReactNode, useContext } from 'react';

export const TokensContext = createContext<ReturnType<typeof useGetTokens> | null>(null);
interface TokenWithImportedFlag extends GqlToken {
    imported?: boolean;
}

export function useGetTokens() {
    const networkConfig = useNetworkConfig();
    const { data: tokensResponse } = useGetTokensQuery({ fetchPolicy: 'cache-first' });
    const { data: pricesResponse } = useGetTokenPricesQuery({ fetchPolicy: 'cache-first' });
    const { userImportedTokens } = useUserImportedTokens();

    const tokens: TokenWithImportedFlag[] = [...(tokensResponse?.tokens || []), ...userImportedTokens].map((token) => ({
        ...token,
        address: token.address.toLowerCase(),
    }));
    const prices = keyBy(pricesResponse?.tokenPrices || [], 'address');

    function getToken(address: string): GqlToken | null {
        const token = tokens.find((token) => token.address === address.toLowerCase());

        return token || null;
    }

    function getTradableToken(address: string): GqlToken | null {
        const token = tokens.find((token) => token.address === address.toLowerCase() && token.tradable);
        return token || null;
    }

    function getRequiredToken(address: string): GqlToken {
        const token = getToken(address);

        if (!token) {
            return {
                __typename: 'GqlToken',
                symbol: 'NONE',
                name: 'Missing',
                decimals: 18,
                address,
                chainId: parseInt(networkConfig.chainId),
                priority: 0,
                tradable: false,
            };
        }

        return token;
    }

    function priceFor(address: string): number {
        return prices[address?.toLowerCase()]?.price || 0;
    }

    function priceForAmount(tokenAmount: TokenAmountHumanReadable): number {
        return priceFor(tokenAmount.address) * parseFloat(tokenAmount.amount);
    }

    function formattedPrice(tokenAmount: TokenAmountHumanReadable): string {
        const price = priceForAmount(tokenAmount);

        return numberFormatUSDValue(price);
    }

    return {
        tokens: tokens.filter((token) => token.tradable),
        allTokens: tokens,
        prices,
        priceFor,
        getToken,
        getTradableToken,
        getRequiredToken,
        formattedPrice,
        priceForAmount,
    };
}

export function TokensProvider(props: { children: ReactNode }) {
    const tokens = useGetTokens();
    return <TokensContext.Provider value={tokens}>{props.children}</TokensContext.Provider>;
}

export const useTokens = () => useContext(TokensContext) as ReturnType<typeof useGetTokens>;