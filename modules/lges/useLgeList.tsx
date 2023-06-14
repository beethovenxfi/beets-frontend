import { useGetLgesQuery } from '~/apollo/generated/graphql-codegen-generated';
import { createContext, ReactNode, useContext, useState } from 'react';
import { GqlLge } from '~/apollo/generated/graphql-codegen-generated';
import { orderBy } from 'lodash';

export interface GqlLgeExtended extends GqlLge {
    status: 'active' | 'upcoming' | 'ended';
}

export function _useLgeList() {
    const { data, loading, error, networkStatus } = useGetLgesQuery({
        notifyOnNetworkStatusChange: true,
    });
    const [filter, setFilter] = useState('active-upcoming');
    const now = new Date();

    const lgesExtended: GqlLgeExtended[] = (data?.lges || []).map((lge) => {
        const startDate = new Date(lge.startDate);
        const endDate = new Date(lge.endDate);
        const status = now < startDate ? 'upcoming' : now > endDate ? 'ended' : 'active';
        return {
            ...lge,
            status,
        };
    });

    function lgeFilter(lge: GqlLge) {
        const endDate = new Date(lge.endDate);
        return filter === 'active-upcoming' ? now < endDate : now > endDate;
    }

    const lgesFiltered = lgesExtended.filter(lgeFilter);

    const lgesSorted =
        filter === 'active-upcoming'
            ? orderBy(lgesFiltered, 'startDate', 'asc')
            : orderBy(lgesFiltered, 'endDate', 'desc');

    return {
        lges: lgesSorted,
        loading,
        error,
        networkStatus,
        setFilter,
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
