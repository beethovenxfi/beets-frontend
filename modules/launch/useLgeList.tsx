import { useGetLgesQuery } from '~/apollo/generated/graphql-codegen-generated';
import { createContext, ReactNode, useContext } from 'react';

export function _useLgeList() {
    const { data, loading, error, networkStatus } = useGetLgesQuery({
        notifyOnNetworkStatusChange: true,
    });

    return {
        lges: data?.lges || [],
        loading,
        error,
        networkStatus,
    };
}

export const LgeListContext = createContext<ReturnType<typeof _useLgeList> | null>(null);

export function LgeListProvider(props: { children: ReactNode }) {
    const value = _useLgeList();

    return <LgeListContext.Provider value={value}>{props.children}</LgeListContext.Provider>;
}

export function useLgeList() {
    return useContext(LgeListContext) as ReturnType<typeof _useLgeList>;
}
