import { createContext, useContext } from 'react';
import { GqlLge, useGetLgeQuery } from '~/apollo/generated/graphql-codegen-generated';

export interface LgeContextType {
    lge: GqlLge | undefined;
    status: 'upcoming' | 'ended' | 'active';
    tokens: string[];
}

export const LgeContext = createContext<LgeContextType | null>(null);

export function LgeProvider({ lge: lgeFromProps, children }: { lge: GqlLge; children: any }) {
    const { data } = useGetLgeQuery({
        variables: { id: lgeFromProps.id },
        notifyOnNetworkStatusChange: true,
    });

    const lge = data?.lge;

    const now = new Date().getTime();
    const startTimestamp = lge && lge.startTimestamp * 1000;
    const endTimestamp = lge && lge.endTimestamp * 1000;
    const status =
        startTimestamp && now < startTimestamp ? 'upcoming' : endTimestamp && now > endTimestamp ? 'ended' : 'active';
    const tokens = [lge?.collateralAddress.toLowerCase() || '', lge?.tokenAddress.toLowerCase() || ''];

    return (
        <LgeContext.Provider
            value={{
                lge,
                status,
                tokens,
            }}
        >
            {children}
        </LgeContext.Provider>
    );
}

export function useLge() {
    //we force cast here because the context will never be null
    return useContext(LgeContext) as LgeContextType;
}
