import { makeVar, useReactiveVar } from '@apollo/client';
import { TokenBase } from '~/lib/services/token/token-types';
import { useEffect, useState } from 'react';
import { isAddress } from 'ethers/lib/utils';
import { useMultiCall } from '~/lib/util/useMultiCall';
import ERC20Abi from '~/lib/abi/ERC20.json';
import { AddressZero } from '@ethersproject/constants';
import { networkConfig } from '~/lib/config/network-config';
import { GqlToken } from '~/apollo/generated/graphql-codegen-generated';

const USER_IMPORTED_CACHE_KEY = 'USER_IMPORTED_TOKENS';

const cached = typeof window !== 'undefined' ? localStorage.getItem(USER_IMPORTED_CACHE_KEY) : null;
const userImportedTokensVar = makeVar<TokenBase[]>(cached ? JSON.parse(cached) : []);

export function useUserImportedTokens() {
    const [addressToLoad, setAddressToLoad] = useState<string | null>(null);
    const [tokenToImport, setTokenToImport] = useState<TokenBase | null>(null);
    const address = addressToLoad || AddressZero;

    const { data, isError, isLoading } = useMultiCall({
        abi: ERC20Abi,
        enabled: !!addressToLoad,
        calls: [
            { address, functionName: 'symbol' },
            { address, functionName: 'decimals' },
            { address, functionName: 'name' },
        ],
    });

    useEffect(() => {
        if (addressToLoad && data && tokenToImport?.address !== addressToLoad && !getImportedToken(addressToLoad)) {
            setTokenToImport({
                address: addressToLoad,
                symbol: data[0],
                decimals: data[1],
                name: data[2],
            });
        }
    }, [(data || [])[0]]);

    useEffect(() => {
        setAddressToLoad(null);
    }, [isError]);

    function getImportedToken(address: string): TokenBase | null {
        const importedTokens = userImportedTokensVar();
        address = address.toLowerCase();

        return importedTokens.find((token) => token.address === address) || null;
    }

    function loadToken(address: string) {
        if (isAddress(address) && !getImportedToken(address)) {
            setAddressToLoad(address.toLowerCase());
        }
    }

    function clearTokenImport() {
        setAddressToLoad(null);
        setTokenToImport(null);
    }

    function importToken() {
        if (tokenToImport && !getImportedToken(tokenToImport.address)) {
            const updated = [...userImportedTokensVar(), tokenToImport];
            userImportedTokensVar(updated);
            localStorage.setItem(USER_IMPORTED_CACHE_KEY, JSON.stringify(updated));

            clearTokenImport();
        }
    }

    function removeToken(address: string) {
        const filtered = userImportedTokensVar().filter((token) => token.address !== address.toLowerCase());

        userImportedTokensVar(filtered);
        localStorage.setItem(USER_IMPORTED_CACHE_KEY, JSON.stringify(filtered));
    }

    function removeAllUserImportedTokens() {
        userImportedTokensVar([]);
        localStorage.setItem(USER_IMPORTED_CACHE_KEY, JSON.stringify([]));
    }

    const userImportedTokens: (GqlToken & { imported?: boolean })[] = useReactiveVar(userImportedTokensVar).map(
        (token) => ({
            ...token,
            __typename: 'GqlToken',
            tradable: true,
            chainId: parseInt(networkConfig.chainId),
            priority: 0,
            imported: true,
        }),
    );

    return {
        getImportedToken,
        loadToken,
        removeToken,
        removeAllUserImportedTokens,
        userImportedTokens,
        isLoading,
        isError,
        tokenToImport,
        addressToLoad,
        clearTokenImport,
        importToken,
    };
}
