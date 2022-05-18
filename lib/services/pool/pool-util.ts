import {
    GqlPoolBase,
    GqlPoolLinearNested,
    GqlPoolPhantomStableNested,
    GqlPoolUnion,
} from '~/apollo/generated/graphql-codegen-generated';

export function poolTokensWithoutPhantomBpt(pool: GqlPoolUnion | GqlPoolPhantomStableNested | GqlPoolLinearNested) {
    return pool.tokens.filter((token) => token.address !== pool.address);
}

export function poolIsWeightedLikePool(pool: GqlPoolUnion) {
    return pool.__typename === 'GqlPoolWeighted' || pool.__typename === 'GqlPoolLiquidityBootstrapping';
}
