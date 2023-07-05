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
    const [status, setStatus] = useState('active-upcoming');
    const now = new Date();

    const lgesExtended: GqlLgeExtended[] = (data?.lges || []).map((lge) => {
        const startDate = new Date(lge.startTimestamp);
        const endDate = new Date(lge.endTimestamp);
        const status = now < startDate ? 'upcoming' : now > endDate ? 'ended' : 'active';
        return {
            ...lge,
            status,
        };
    });

    function lgeStatus(lge: GqlLge) {
        const endDate = new Date(lge.endTimestamp);
        return status === 'active-upcoming' ? now < endDate : now > endDate;
    }

    const lgesFiltered = lgesExtended.filter(lgeStatus);

    const lgesSorted =
        status === 'active-upcoming'
            ? orderBy(lgesFiltered, 'startDate', 'asc')
            : orderBy(lgesFiltered, 'endDate', 'desc');

    return {
        lges: lgesSorted,
        loading,
        error,
        networkStatus,
        status,
        setStatus,
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
