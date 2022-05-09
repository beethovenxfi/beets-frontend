import { makeVar } from '@apollo/client';
import { GetPoolsQueryVariables } from '../../apollo/generated/graphql-codegen-generated';

export const poolListStateVar = makeVar<GetPoolsQueryVariables>({
    first: 10,
    skip: 0,
    orderBy: 'totalLiquidity',
    orderDirection: 'desc',
    where: {
        categoryIn: ['INCENTIVIZED'],
        poolTypeNotIn: ['UNKNOWN', 'LIQUIDITY_BOOTSTRAPPING'],
        poolTypeIn: ['WEIGHTED', 'STABLE', 'PHANTOM_STABLE'],
    },
});
