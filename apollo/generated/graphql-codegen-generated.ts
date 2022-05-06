/* tslint:disable */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    BigDecimal: string;
    BigInt: string;
    Bytes: string;
    /** Date custom scalar type */
    Date: any;
    GqlBigNumber: any;
    /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
    JSON: any;
}

export interface FbeetsApr {
    __typename: 'FbeetsApr';
    apr: Scalars['Float'];
}

export interface GqlBalancePoolApr {
    __typename: 'GqlBalancePoolApr';
    beetsApr: Scalars['BigDecimal'];
    hasRewardApr: Scalars['Boolean'];
    items: Array<GqlBalancePoolAprItem>;
    swapApr: Scalars['BigDecimal'];
    thirdPartyApr: Scalars['BigDecimal'];
    total: Scalars['BigDecimal'];
}

export interface GqlBalancePoolAprItem {
    __typename: 'GqlBalancePoolAprItem';
    apr: Scalars['BigDecimal'];
    subItems?: Maybe<Array<GqlBalancePoolAprSubItem>>;
    title: Scalars['String'];
}

export interface GqlBalancePoolAprSubItem {
    __typename: 'GqlBalancePoolAprSubItem';
    apr: Scalars['BigDecimal'];
    title: Scalars['String'];
}

export interface GqlBalancerGetPoolActivitiesInput {
    first: Scalars['Int'];
    poolId: Scalars['ID'];
    sender?: InputMaybe<Scalars['String']>;
    skip: Scalars['Int'];
}

export interface GqlBalancerPool {
    __typename: 'GqlBalancerPool';
    address: Scalars['Bytes'];
    amp?: Maybe<Scalars['BigInt']>;
    apr: GqlBalancePoolApr;
    baseToken?: Maybe<Scalars['Bytes']>;
    composition: GqlBalancerPoolComposition;
    createTime: Scalars['Int'];
    expiryTime?: Maybe<Scalars['BigInt']>;
    factory?: Maybe<Scalars['Bytes']>;
    farm?: Maybe<GqlBeetsFarm>;
    farmTotalLiquidity: Scalars['BigDecimal'];
    fees24h: Scalars['BigDecimal'];
    holdersCount: Scalars['BigInt'];
    id: Scalars['ID'];
    isNewPool?: Maybe<Scalars['Boolean']>;
    linearPools?: Maybe<Array<GqlBalancerPoolLinearPoolData>>;
    lowerTarget?: Maybe<Scalars['String']>;
    mainIndex?: Maybe<Scalars['Int']>;
    mainTokens?: Maybe<Array<Scalars['String']>>;
    name?: Maybe<Scalars['String']>;
    owner?: Maybe<Scalars['Bytes']>;
    poolType?: Maybe<Scalars['String']>;
    principalToken?: Maybe<Scalars['Bytes']>;
    stablePhantomPools?: Maybe<Array<GqlBalancerPoolStablePhantomPoolData>>;
    swapEnabled: Scalars['Boolean'];
    swapFee: Scalars['BigDecimal'];
    swapsCount: Scalars['BigInt'];
    symbol: Scalars['String'];
    tokenRates?: Maybe<Array<Scalars['String']>>;
    tokens: Array<GqlBalancerPoolToken>;
    tokensList: Array<Scalars['Bytes']>;
    totalLiquidity: Scalars['BigDecimal'];
    totalShares: Scalars['BigDecimal'];
    totalSwapFee: Scalars['BigDecimal'];
    totalSwapVolume: Scalars['BigDecimal'];
    totalWeight?: Maybe<Scalars['BigDecimal']>;
    unitSeconds?: Maybe<Scalars['BigInt']>;
    upperTarget?: Maybe<Scalars['String']>;
    volume24h: Scalars['BigDecimal'];
    wrappedIndex?: Maybe<Scalars['Int']>;
}

export interface GqlBalancerPool24h {
    __typename: 'GqlBalancerPool24h';
    address: Scalars['Bytes'];
    id: Scalars['ID'];
    liquidityChange24h: Scalars['BigDecimal'];
    swapFees24h: Scalars['BigDecimal'];
    swapVolume24h: Scalars['BigDecimal'];
    totalLiquidity: Scalars['BigDecimal'];
    totalShares: Scalars['BigDecimal'];
    totalSwapFee: Scalars['BigDecimal'];
    totalSwapVolume: Scalars['BigDecimal'];
}

export interface GqlBalancerPoolActivity {
    __typename: 'GqlBalancerPoolActivity';
    amounts: Array<Scalars['BigDecimal']>;
    id: Scalars['ID'];
    poolId: Scalars['String'];
    sender: Scalars['Bytes'];
    timestamp: Scalars['Int'];
    tx: Scalars['Bytes'];
    type: GqlBalancerPoolActivityType;
    valueUSD: Scalars['BigDecimal'];
}

export type GqlBalancerPoolActivityType = 'Exit' | 'Join';

export interface GqlBalancerPoolComposition {
    __typename: 'GqlBalancerPoolComposition';
    tokens: Array<GqlBalancerPoolCompositionToken>;
}

export interface GqlBalancerPoolCompositionToken {
    __typename: 'GqlBalancerPoolCompositionToken';
    address: Scalars['String'];
    balance: Scalars['BigDecimal'];
    decimals: Scalars['Int'];
    nestedTokens?: Maybe<Array<GqlBalancerPoolCompositionToken>>;
    symbol: Scalars['String'];
    valueUSD: Scalars['BigDecimal'];
    weight?: Maybe<Scalars['BigDecimal']>;
}

export interface GqlBalancerPoolLinearPoolData {
    __typename: 'GqlBalancerPoolLinearPoolData';
    address: Scalars['String'];
    balance: Scalars['String'];
    id: Scalars['ID'];
    mainToken: GqlBalancerPoolLinearPoolMainToken;
    mainTokenTotalBalance: Scalars['String'];
    poolToken: Scalars['String'];
    priceRate: Scalars['String'];
    symbol: Scalars['String'];
    totalSupply: Scalars['String'];
    unwrappedTokenAddress: Scalars['String'];
    wrappedToken: GqlBalancerPoolLinearPoolWrappedToken;
}

export interface GqlBalancerPoolLinearPoolMainToken {
    __typename: 'GqlBalancerPoolLinearPoolMainToken';
    address: Scalars['String'];
    balance: Scalars['String'];
    decimals: Scalars['Int'];
    index: Scalars['Int'];
    name: Scalars['String'];
    symbol: Scalars['String'];
    totalSupply: Scalars['String'];
}

export interface GqlBalancerPoolLinearPoolWrappedToken {
    __typename: 'GqlBalancerPoolLinearPoolWrappedToken';
    address: Scalars['String'];
    balance: Scalars['String'];
    decimals: Scalars['Int'];
    index: Scalars['Int'];
    name: Scalars['String'];
    priceRate: Scalars['String'];
    symbol: Scalars['String'];
    totalSupply: Scalars['String'];
}

export interface GqlBalancerPoolSnapshot {
    __typename: 'GqlBalancerPoolSnapshot';
    id: Scalars['ID'];
    liquidityChange24h: Scalars['BigDecimal'];
    poolId: Scalars['ID'];
    swapFees24h: Scalars['BigDecimal'];
    swapVolume24h: Scalars['BigDecimal'];
    timestamp: Scalars['Int'];
    tokens: Array<GqlBalancerPoolToken>;
    totalLiquidity: Scalars['BigDecimal'];
    totalShares: Scalars['BigDecimal'];
    totalSwapFee: Scalars['BigDecimal'];
    totalSwapVolume: Scalars['BigDecimal'];
}

export interface GqlBalancerPoolStablePhantomPoolData {
    __typename: 'GqlBalancerPoolStablePhantomPoolData';
    address: Scalars['String'];
    balance: Scalars['String'];
    id: Scalars['ID'];
    symbol: Scalars['String'];
    tokens: Array<GqlBalancerPoolToken>;
    totalSupply: Scalars['String'];
}

export interface GqlBalancerPoolToken {
    __typename: 'GqlBalancerPoolToken';
    address: Scalars['String'];
    balance: Scalars['BigDecimal'];
    decimals: Scalars['Int'];
    id: Scalars['ID'];
    isBpt?: Maybe<Scalars['Boolean']>;
    isPhantomBpt?: Maybe<Scalars['Boolean']>;
    name: Scalars['String'];
    priceRate: Scalars['BigDecimal'];
    symbol: Scalars['String'];
    weight?: Maybe<Scalars['BigDecimal']>;
}

export interface GqlBalancerTokenLatestPrice {
    __typename: 'GqlBalancerTokenLatestPrice';
    asset: Scalars['Bytes'];
    block: Scalars['BigInt'];
    id: Scalars['ID'];
    price: Scalars['BigDecimal'];
    priceUSD: Scalars['BigDecimal'];
    pricingAsset: Scalars['Bytes'];
}

export interface GqlBalancerTradePair {
    __typename: 'GqlBalancerTradePair';
    token0: GqlBalancerTradePairToken;
    token1: GqlBalancerTradePairToken;
}

export interface GqlBalancerTradePairSnapshot {
    __typename: 'GqlBalancerTradePairSnapshot';
    id: Scalars['ID'];
    pair: GqlBalancerTradePair;
    timestamp: Scalars['Int'];
    totalSwapFee: Scalars['BigDecimal'];
    totalSwapVolume: Scalars['BigDecimal'];
}

export interface GqlBalancerTradePairToken {
    __typename: 'GqlBalancerTradePairToken';
    address: Scalars['String'];
    symbol: Scalars['String'];
}

export interface GqlBeetsConfig {
    __typename: 'GqlBeetsConfig';
    blacklistedPools: Array<Scalars['String']>;
    blacklistedTokens: Array<Scalars['String']>;
    boostedPools: Array<Scalars['String']>;
    excludedPools: Array<Scalars['String']>;
    featuredPools: Array<Scalars['String']>;
    homeEducationItems: Array<GqlBeetsConfigNewsItem>;
    homeFeaturedPools: Array<GqlBeetsConfigFeaturedPool>;
    homeNewsItems: Array<GqlBeetsConfigNewsItem>;
    incentivizedPools: Array<Scalars['String']>;
    pausedPools: Array<Scalars['String']>;
    poolFilters: Array<GqlBeetsConfigPoolFilterItem>;
}

export interface GqlBeetsConfigFeaturedPool {
    __typename: 'GqlBeetsConfigFeaturedPool';
    description?: Maybe<Scalars['String']>;
    image: Scalars['String'];
    poolId: Scalars['String'];
}

export interface GqlBeetsConfigNewsItem {
    __typename: 'GqlBeetsConfigNewsItem';
    description: Scalars['String'];
    image: Scalars['String'];
    publishDate: Scalars['String'];
    title: Scalars['String'];
    url: Scalars['String'];
}

export interface GqlBeetsConfigPoolFilterItem {
    __typename: 'GqlBeetsConfigPoolFilterItem';
    id: Scalars['ID'];
    pools: Array<Scalars['String']>;
    title: Scalars['String'];
}

export interface GqlBeetsFarm {
    __typename: 'GqlBeetsFarm';
    allocPoint: Scalars['Int'];
    block: Scalars['BigInt'];
    hasBeetsRewards: Scalars['Boolean'];
    id: Scalars['ID'];
    lastRewardBlock: Scalars['BigInt'];
    masterChef: GqlBeetsMasterChef;
    pair: Scalars['Bytes'];
    rewardTokens: Array<GqlBeetsFarmRewardToken>;
    rewarder?: Maybe<GqlBeetsRewarder>;
    slpBalance: Scalars['BigInt'];
    timestamp: Scalars['BigInt'];
    userCount: Scalars['BigInt'];
}

export interface GqlBeetsFarmRewardToken {
    __typename: 'GqlBeetsFarmRewardToken';
    address: Scalars['String'];
    decimals: Scalars['Int'];
    isBeets?: Maybe<Scalars['Boolean']>;
    rewardPerDay: Scalars['BigDecimal'];
    rewardPerSecond: Scalars['BigDecimal'];
    symbol: Scalars['String'];
    tokenPrice: Scalars['BigDecimal'];
}

export interface GqlBeetsFarmUser {
    __typename: 'GqlBeetsFarmUser';
    address: Scalars['Bytes'];
    amount: Scalars['BigInt'];
    beetsHarvested: Scalars['BigInt'];
    farmId: Scalars['ID'];
    id: Scalars['ID'];
    pair: Scalars['Bytes'];
    rewardDebt: Scalars['BigInt'];
    timestamp: Scalars['BigInt'];
}

export interface GqlBeetsMasterChef {
    __typename: 'GqlBeetsMasterChef';
    beetsPerBlock: Scalars['BigInt'];
    id: Scalars['ID'];
    totalAllocPoint: Scalars['Int'];
}

export interface GqlBeetsProtocolData {
    __typename: 'GqlBeetsProtocolData';
    beetsPrice: Scalars['BigDecimal'];
    circulatingSupply: Scalars['BigDecimal'];
    fbeetsPrice: Scalars['BigDecimal'];
    marketCap: Scalars['BigDecimal'];
    poolCount: Scalars['BigInt'];
    swapFee24h: Scalars['BigDecimal'];
    swapVolume24h: Scalars['BigDecimal'];
    totalLiquidity: Scalars['BigDecimal'];
    totalSwapFee: Scalars['BigDecimal'];
    totalSwapVolume: Scalars['BigDecimal'];
}

export interface GqlBeetsRewarder {
    __typename: 'GqlBeetsRewarder';
    id: Scalars['ID'];
    rewardPerSecond: Scalars['BigInt'];
    rewardToken: Scalars['Bytes'];
    tokens: Array<GqlBeetsRewarderToken>;
}

export interface GqlBeetsRewarderToken {
    __typename: 'GqlBeetsRewarderToken';
    decimals: Scalars['Int'];
    rewardPerSecond: Scalars['BigInt'];
    symbol: Scalars['String'];
    token: Scalars['Bytes'];
    tokenPrice: Scalars['Float'];
}

export interface GqlBeetsUserPendingAllFarmRewards {
    __typename: 'GqlBeetsUserPendingAllFarmRewards';
    farmIds: Array<Scalars['String']>;
    farms: Array<GqlBeetsUserPendingFarmRewards>;
    numFarms: Scalars['BigInt'];
    tokens: Array<GqlBeetsUserPendingRewardsToken>;
    totalBalanceUSD: Scalars['BigDecimal'];
}

export interface GqlBeetsUserPendingFarmRewards {
    __typename: 'GqlBeetsUserPendingFarmRewards';
    balanceUSD: Scalars['BigDecimal'];
    farmId: Scalars['String'];
    tokens: Array<GqlBeetsUserPendingRewardsToken>;
}

export interface GqlBeetsUserPendingRewards {
    __typename: 'GqlBeetsUserPendingRewards';
    farm: GqlBeetsUserPendingAllFarmRewards;
}

export interface GqlBeetsUserPendingRewardsToken {
    __typename: 'GqlBeetsUserPendingRewardsToken';
    address: Scalars['Bytes'];
    balance: Scalars['BigDecimal'];
    balanceUSD: Scalars['BigDecimal'];
    symbol: Scalars['String'];
}

export interface GqlBeetsUserPoolData {
    __typename: 'GqlBeetsUserPoolData';
    averageApr: Scalars['BigDecimal'];
    averageFarmApr: Scalars['BigDecimal'];
    pools: Array<GqlBeetsUserPoolPoolData>;
    totalBalanceUSD: Scalars['BigDecimal'];
    totalFarmBalanceUSD: Scalars['BigDecimal'];
}

export interface GqlBeetsUserPoolPoolData {
    __typename: 'GqlBeetsUserPoolPoolData';
    balance: Scalars['BigDecimal'];
    balanceScaled: Scalars['BigInt'];
    balanceUSD: Scalars['BigDecimal'];
    farmBalanceUSD: Scalars['BigDecimal'];
    hasUnstakedBpt?: Maybe<Scalars['Boolean']>;
    mainTokens?: Maybe<Array<GqlBeetsUserPoolTokenData>>;
    poolId: Scalars['String'];
    tokens: Array<GqlBeetsUserPoolTokenData>;
}

export interface GqlBeetsUserPoolTokenData {
    __typename: 'GqlBeetsUserPoolTokenData';
    address: Scalars['String'];
    balance: Scalars['String'];
    balanceUSD: Scalars['BigDecimal'];
    farmBalanceUSD: Scalars['BigDecimal'];
    symbol: Scalars['String'];
}

export interface GqlHistoricalTokenPrice {
    __typename: 'GqlHistoricalTokenPrice';
    address: Scalars['String'];
    prices: Array<GqlHistoricalTokenPriceEntry>;
}

export interface GqlHistoricalTokenPriceEntry {
    __typename: 'GqlHistoricalTokenPriceEntry';
    price: Scalars['Float'];
    timestamp: Scalars['String'];
}

export interface GqlLge {
    __typename: 'GqlLge';
    address: Scalars['String'];
    adminAddress: Scalars['String'];
    adminIsMultisig: Scalars['Boolean'];
    bannerImageUrl: Scalars['String'];
    collateralAmount: Scalars['String'];
    collateralEndWeight: Scalars['Int'];
    collateralStartWeight: Scalars['Int'];
    collateralTokenAddress: Scalars['String'];
    description: Scalars['String'];
    discordUrl: Scalars['String'];
    endDate: Scalars['String'];
    id: Scalars['ID'];
    mediumUrl: Scalars['String'];
    name: Scalars['String'];
    startDate: Scalars['String'];
    swapFeePercentage: Scalars['String'];
    telegramUrl: Scalars['String'];
    tokenAmount: Scalars['String'];
    tokenContractAddress: Scalars['String'];
    tokenEndWeight: Scalars['Int'];
    tokenIconUrl: Scalars['String'];
    tokenStartWeight: Scalars['Int'];
    twitterUrl: Scalars['String'];
    websiteUrl: Scalars['String'];
}

export interface GqlLgeCreateInput {
    address: Scalars['String'];
    bannerImageUrl: Scalars['String'];
    collateralAmount: Scalars['String'];
    collateralEndWeight: Scalars['Int'];
    collateralStartWeight: Scalars['Int'];
    collateralTokenAddress: Scalars['String'];
    description: Scalars['String'];
    discordUrl: Scalars['String'];
    endDate: Scalars['String'];
    id: Scalars['ID'];
    mediumUrl: Scalars['String'];
    name: Scalars['String'];
    startDate: Scalars['String'];
    swapFeePercentage: Scalars['String'];
    telegramUrl: Scalars['String'];
    tokenAmount: Scalars['String'];
    tokenContractAddress: Scalars['String'];
    tokenEndWeight: Scalars['Int'];
    tokenIconUrl: Scalars['String'];
    tokenStartWeight: Scalars['Int'];
    twitterUrl: Scalars['String'];
    websiteUrl: Scalars['String'];
}

export interface GqlLgeUpdateInput {
    description: Scalars['String'];
    discordUrl: Scalars['String'];
    id: Scalars['ID'];
    mediumUrl: Scalars['String'];
    name: Scalars['String'];
    telegramUrl: Scalars['String'];
    tokenIconUrl: Scalars['String'];
    twitterUrl: Scalars['String'];
    websiteUrl: Scalars['String'];
}

export interface GqlSorGetSwapsInput {
    swapAmount: Scalars['BigDecimal'];
    swapOptions: GqlSorSwapOptionsInput;
    swapType: GqlSorSwapType;
    tokenIn: Scalars['String'];
    tokenOut: Scalars['String'];
}

export interface GqlSorGetSwapsResponse {
    __typename: 'GqlSorGetSwapsResponse';
    marketSp: Scalars['String'];
    returnAmount: Scalars['BigDecimal'];
    returnAmountConsideringFees: Scalars['BigDecimal'];
    returnAmountFromSwaps?: Maybe<Scalars['BigDecimal']>;
    routes: Array<GqlSorSwapRoute>;
    swapAmount: Scalars['BigDecimal'];
    swapAmountForSwaps?: Maybe<Scalars['BigDecimal']>;
    swaps: Array<GqlSorSwap>;
    tokenAddresses: Array<Scalars['String']>;
    tokenIn: Scalars['String'];
    tokenOut: Scalars['String'];
}

export interface GqlSorSwap {
    __typename: 'GqlSorSwap';
    amount: Scalars['String'];
    assetInIndex: Scalars['Int'];
    assetOutIndex: Scalars['Int'];
    poolId: Scalars['String'];
    userData: Scalars['String'];
}

export interface GqlSorSwapOptionsInput {
    forceRefresh?: InputMaybe<Scalars['Boolean']>;
    maxPools?: InputMaybe<Scalars['Int']>;
    timestamp?: InputMaybe<Scalars['Int']>;
}

export interface GqlSorSwapRoute {
    __typename: 'GqlSorSwapRoute';
    hops: Array<GqlSorSwapRouteHop>;
    share: Scalars['Float'];
    tokenIn: Scalars['String'];
    tokenInAmount: Scalars['BigDecimal'];
    tokenOut: Scalars['String'];
    tokenOutAmount: Scalars['BigDecimal'];
}

export interface GqlSorSwapRouteHop {
    __typename: 'GqlSorSwapRouteHop';
    poolId: Scalars['String'];
    tokenIn: Scalars['String'];
    tokenInAmount: Scalars['BigDecimal'];
    tokenOut: Scalars['String'];
    tokenOutAmount: Scalars['BigDecimal'];
}

export type GqlSorSwapType = 'EXACT_IN' | 'EXACT_OUT';

export interface GqlTokenPrice {
    __typename: 'GqlTokenPrice';
    address: Scalars['String'];
    price: Scalars['Float'];
}

export interface GqlUserPoolData {
    __typename: 'GqlUserPoolData';
    id: Scalars['String'];
    myFees: Scalars['GqlBigNumber'];
    name: Scalars['String'];
    percentOfPortfolio: Scalars['Float'];
    percentShare: Scalars['Float'];
    poolAddress: Scalars['String'];
    poolId: Scalars['String'];
    priceChange: Scalars['GqlBigNumber'];
    priceChangePercent: Scalars['Float'];
    pricePerShare: Scalars['GqlBigNumber'];
    shares: Scalars['GqlBigNumber'];
    swapFees: Scalars['GqlBigNumber'];
    swapVolume: Scalars['GqlBigNumber'];
    tokens: Array<GqlUserTokenData>;
    totalValue: Scalars['GqlBigNumber'];
}

export interface GqlUserPortfolioData {
    __typename: 'GqlUserPortfolioData';
    myFees: Scalars['GqlBigNumber'];
    pools: Array<GqlUserPoolData>;
    timestamp: Scalars['Int'];
    tokens: Array<GqlUserTokenData>;
    totalSwapFees: Scalars['GqlBigNumber'];
    totalSwapVolume: Scalars['GqlBigNumber'];
    totalValue: Scalars['GqlBigNumber'];
}

export interface GqlUserTokenData {
    __typename: 'GqlUserTokenData';
    address: Scalars['String'];
    balance: Scalars['GqlBigNumber'];
    id: Scalars['String'];
    name: Scalars['String'];
    percentOfPortfolio: Scalars['Float'];
    pricePerToken: Scalars['GqlBigNumber'];
    symbol: Scalars['String'];
    totalValue: Scalars['GqlBigNumber'];
}

export interface Mutation {
    __typename: 'Mutation';
    cachePortfolioHistoryForDate: Scalars['Boolean'];
    clearCacheAtBlock: Scalars['Boolean'];
    clearCachedPools: Scalars['Boolean'];
    clearCachedPortfolioHistories: Scalars['Boolean'];
    lgeCreate: GqlLge;
    refreshLatestBlockCachedKey: Scalars['Boolean'];
    reloadTokenPrices?: Maybe<Scalars['Boolean']>;
}

export interface MutationCachePortfolioHistoryForDateArgs {
    date: Scalars['String'];
}

export interface MutationClearCacheAtBlockArgs {
    block: Scalars['Int'];
}

export interface MutationLgeCreateArgs {
    lge: GqlLgeCreateInput;
    signature: Scalars['String'];
}

export interface Query {
    __typename: 'Query';
    balancerGetPoolActivities: Array<GqlBalancerPoolActivity>;
    balancerGetTopTradingPairs: Array<GqlBalancerTradePairSnapshot>;
    beetsGetBeetsFarms: Array<GqlBeetsFarm>;
    beetsGetConfig: GqlBeetsConfig;
    beetsGetProtocolData: GqlBeetsProtocolData;
    beetsGetUserDataForAllFarms: Array<GqlBeetsFarmUser>;
    beetsGetUserDataForFarm?: Maybe<GqlBeetsFarmUser>;
    beetsGetUserPendingRewards: GqlBeetsUserPendingRewards;
    beetsGetUserPoolData: GqlBeetsUserPoolData;
    blocksGetAverageBlockTime: Scalars['Float'];
    fbeetsGetApr: FbeetsApr;
    gnosisIsUserMultisigWallet?: Maybe<Scalars['Boolean']>;
    latestPrice?: Maybe<GqlBalancerTokenLatestPrice>;
    lge: GqlLge;
    lges: Array<GqlLge>;
    pool: GqlBalancerPool;
    poolGet24hData: GqlBalancerPool24h;
    poolSnapshots: Array<GqlBalancerPoolSnapshot>;
    pools: Array<GqlBalancerPool>;
    poolsJSON: Array<Scalars['JSON']>;
    poolsPastPools: Array<GqlBalancerPool>;
    portfolioGetUserPortfolio: GqlUserPortfolioData;
    portfolioGetUserPortfolioHistory: Array<GqlUserPortfolioData>;
    portfolioGetUserPortfolioHistoryAdmin: Array<GqlUserPortfolioData>;
    sorGetSwaps: GqlSorGetSwapsResponse;
    tokenPriceGetCurrentPrices: Array<GqlTokenPrice>;
    tokenPriceGetHistoricalPrices: Array<GqlHistoricalTokenPrice>;
}

export interface QueryBalancerGetPoolActivitiesArgs {
    input: GqlBalancerGetPoolActivitiesInput;
}

export interface QueryBeetsGetUserDataForFarmArgs {
    farmId: Scalars['String'];
}

export interface QueryLatestPriceArgs {
    id: Scalars['ID'];
}

export interface QueryLgeArgs {
    id: Scalars['ID'];
}

export interface QueryPoolArgs {
    id: Scalars['String'];
}

export interface QueryPoolGet24hDataArgs {
    poolId: Scalars['ID'];
}

export interface QueryPoolSnapshotsArgs {
    poolId: Scalars['ID'];
}

export interface QuerySorGetSwapsArgs {
    input: GqlSorGetSwapsInput;
}

export interface QueryTokenPriceGetHistoricalPricesArgs {
    addresses: Array<Scalars['String']>;
}

export type GetSorSwapsQueryVariables = Exact<{
    input: GqlSorGetSwapsInput;
}>;

export type GetSorSwapsQuery = {
    __typename: 'Query';
    sorGetSwaps: {
        __typename: 'GqlSorGetSwapsResponse';
        tokenIn: string;
        tokenOut: string;
        swapAmount: string;
        tokenAddresses: Array<string>;
        returnAmount: string;
        returnAmountFromSwaps?: string | null;
        returnAmountConsideringFees: string;
        swapAmountForSwaps?: string | null;
        swaps: Array<{
            __typename: 'GqlSorSwap';
            poolId: string;
            amount: string;
            userData: string;
            assetInIndex: number;
            assetOutIndex: number;
        }>;
        routes: Array<{
            __typename: 'GqlSorSwapRoute';
            tokenIn: string;
            tokenOut: string;
            tokenInAmount: string;
            tokenOutAmount: string;
            share: number;
            hops: Array<{
                __typename: 'GqlSorSwapRouteHop';
                poolId: string;
                tokenIn: string;
                tokenOut: string;
                tokenInAmount: string;
                tokenOutAmount: string;
            }>;
        }>;
    };
};

export type GetTokenPricesQueryVariables = Exact<{ [key: string]: never }>;

export type GetTokenPricesQuery = {
    __typename: 'Query';
    tokenPriceGetCurrentPrices: Array<{ __typename: 'GqlTokenPrice'; price: number; address: string }>;
};

export const GetSorSwapsDocument = gql`
    query GetSorSwaps($input: GqlSorGetSwapsInput!) {
        sorGetSwaps(input: $input) {
            tokenIn
            tokenOut
            swapAmount
            tokenAddresses
            swaps {
                poolId
                amount
                userData
                assetInIndex
                assetOutIndex
            }
            returnAmount
            returnAmountFromSwaps
            returnAmountConsideringFees
            swapAmount
            swapAmountForSwaps
            routes {
                tokenIn
                tokenOut
                tokenInAmount
                tokenOutAmount
                share
                hops {
                    poolId
                    tokenIn
                    tokenOut
                    tokenInAmount
                    tokenOutAmount
                }
            }
        }
    }
`;

/**
 * __useGetSorSwapsQuery__
 *
 * To run a query within a React component, call `useGetSorSwapsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSorSwapsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSorSwapsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetSorSwapsQuery(baseOptions: Apollo.QueryHookOptions<GetSorSwapsQuery, GetSorSwapsQueryVariables>) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetSorSwapsQuery, GetSorSwapsQueryVariables>(GetSorSwapsDocument, options);
}
export function useGetSorSwapsLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetSorSwapsQuery, GetSorSwapsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetSorSwapsQuery, GetSorSwapsQueryVariables>(GetSorSwapsDocument, options);
}
export type GetSorSwapsQueryHookResult = ReturnType<typeof useGetSorSwapsQuery>;
export type GetSorSwapsLazyQueryHookResult = ReturnType<typeof useGetSorSwapsLazyQuery>;
export type GetSorSwapsQueryResult = Apollo.QueryResult<GetSorSwapsQuery, GetSorSwapsQueryVariables>;
export const GetTokenPricesDocument = gql`
    query GetTokenPrices {
        tokenPriceGetCurrentPrices {
            price
            address
        }
    }
`;

/**
 * __useGetTokenPricesQuery__
 *
 * To run a query within a React component, call `useGetTokenPricesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTokenPricesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTokenPricesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTokenPricesQuery(
    baseOptions?: Apollo.QueryHookOptions<GetTokenPricesQuery, GetTokenPricesQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetTokenPricesQuery, GetTokenPricesQueryVariables>(GetTokenPricesDocument, options);
}
export function useGetTokenPricesLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetTokenPricesQuery, GetTokenPricesQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetTokenPricesQuery, GetTokenPricesQueryVariables>(GetTokenPricesDocument, options);
}
export type GetTokenPricesQueryHookResult = ReturnType<typeof useGetTokenPricesQuery>;
export type GetTokenPricesLazyQueryHookResult = ReturnType<typeof useGetTokenPricesLazyQuery>;
export type GetTokenPricesQueryResult = Apollo.QueryResult<GetTokenPricesQuery, GetTokenPricesQueryVariables>;
