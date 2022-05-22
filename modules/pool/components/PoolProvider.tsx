import { createContext } from 'react';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';

export const PoolContext = createContext<GqlPoolUnion | null>(null);

interface Props {
    pool: GqlPoolUnion;
    children: any;
}

export function PoolProvider({ pool, children }: Props) {
    return <PoolContext.Provider value={pool}>{children}</PoolContext.Provider>;
}
