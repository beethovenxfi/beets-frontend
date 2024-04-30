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
    AmountHumanReadable: string;
    BigDecimal: string;
    BigInt: string;
    Bytes: string;
    Date: any;
    GqlBigNumber: any;
    /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
    JSON: any;
}

export interface GqlBalancePoolAprItem {
    __typename: 'GqlBalancePoolAprItem';
    apr: GqlPoolAprValue;
    id: Scalars['ID'];
    subItems?: Maybe<Array<GqlBalancePoolAprSubItem>>;
    title: Scalars['String'];
}

export interface GqlBalancePoolAprSubItem {
    __typename: 'GqlBalancePoolAprSubItem';
    apr: GqlPoolAprValue;
    id: Scalars['ID'];
    title: Scalars['String'];
}

export type GqlChain =
    | 'ARBITRUM'
    | 'AVALANCHE'
    | 'BASE'
    | 'FANTOM'
    | 'GNOSIS'
    | 'MAINNET'
    | 'OPTIMISM'
    | 'POLYGON'
    | 'SEPOLIA'
    | 'ZKEVM';

export interface GqlContentNewsItem {
    __typename: 'GqlContentNewsItem';
    discussionUrl?: Maybe<Scalars['String']>;
    id: Scalars['ID'];
    image?: Maybe<Scalars['String']>;
    source: GqlContentNewsItemSource;
    text: Scalars['String'];
    timestamp: Scalars['String'];
    url: Scalars['String'];
}

export type GqlContentNewsItemSource = 'discord' | 'medium' | 'twitter';

export interface GqlCowSwapApiResponse {
    __typename: 'GqlCowSwapApiResponse';
    marketSp: Scalars['String'];
    returnAmount: Scalars['String'];
    returnAmountConsideringFees: Scalars['String'];
    returnAmountFromSwaps: Scalars['String'];
    swapAmount: Scalars['String'];
    swapAmountForSwaps: Scalars['String'];
    swaps: Array<GqlSwap>;
    tokenAddresses: Array<Scalars['String']>;
    tokenIn: Scalars['String'];
    tokenOut: Scalars['String'];
}

export interface GqlFeaturePoolGroupItemExternalLink {
    __typename: 'GqlFeaturePoolGroupItemExternalLink';
    buttonText: Scalars['String'];
    buttonUrl: Scalars['String'];
    id: Scalars['ID'];
    image: Scalars['String'];
}

/** Configuration options for SOR V2 */
export interface GqlGraphTraversalConfigInput {
    /**
     * Max number of paths to return (can be less)
     *
     * Default: 5
     */
    approxPathsToReturn?: InputMaybe<Scalars['Int']>;
    /**
     * The max hops in a path.
     *
     * Default: 6
     */
    maxDepth?: InputMaybe<Scalars['Int']>;
    /**
     * Limit non boosted hop tokens in a boosted path.
     *
     * Default: 2
     */
    maxNonBoostedHopTokensInBoostedPath?: InputMaybe<Scalars['Int']>;
    /**
     * Limit of "non-boosted" pools for efficiency.
     *
     * Default: 6
     */
    maxNonBoostedPathDepth?: InputMaybe<Scalars['Int']>;
    poolIdsToInclude?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
}

export interface GqlHistoricalTokenPrice {
    __typename: 'GqlHistoricalTokenPrice';
    address: Scalars['String'];
    chain: GqlChain;
    prices: Array<GqlHistoricalTokenPriceEntry>;
}

export interface GqlHistoricalTokenPriceEntry {
    __typename: 'GqlHistoricalTokenPriceEntry';
    price: Scalars['Float'];
    timestamp: Scalars['String'];
}

export interface GqlLatestSyncedBlocks {
    __typename: 'GqlLatestSyncedBlocks';
    poolSyncBlock: Scalars['BigInt'];
    userStakeSyncBlock: Scalars['BigInt'];
    userWalletSyncBlock: Scalars['BigInt'];
}

export interface GqlPoolApr {
    __typename: 'GqlPoolApr';
    apr: GqlPoolAprValue;
    hasRewardApr: Scalars['Boolean'];
    items: Array<GqlBalancePoolAprItem>;
    nativeRewardApr: GqlPoolAprValue;
    swapApr: Scalars['BigDecimal'];
    thirdPartyApr: GqlPoolAprValue;
}

export interface GqlPoolAprRange {
    __typename: 'GqlPoolAprRange';
    max: Scalars['BigDecimal'];
    min: Scalars['BigDecimal'];
}

export interface GqlPoolAprTotal {
    __typename: 'GqlPoolAprTotal';
    total: Scalars['BigDecimal'];
}

export type GqlPoolAprValue = GqlPoolAprRange | GqlPoolAprTotal;

export interface GqlPoolBase {
    address: Scalars['Bytes'];
    allTokens: Array<GqlPoolTokenExpanded>;
    chain: GqlChain;
    createTime: Scalars['Int'];
    decimals: Scalars['Int'];
    displayTokens: Array<GqlPoolTokenDisplay>;
    dynamicData: GqlPoolDynamicData;
    factory?: Maybe<Scalars['Bytes']>;
    id: Scalars['ID'];
    investConfig: GqlPoolInvestConfig;
    name: Scalars['String'];
    owner?: Maybe<Scalars['Bytes']>;
    staking?: Maybe<GqlPoolStaking>;
    symbol: Scalars['String'];
    type: GqlPoolType;
    userBalance?: Maybe<GqlPoolUserBalance>;
    vaultVersion: Scalars['Int'];
    version: Scalars['Int'];
    withdrawConfig: GqlPoolWithdrawConfig;
}

export interface GqlPoolBatchSwap {
    __typename: 'GqlPoolBatchSwap';
    chain: GqlChain;
    id: Scalars['ID'];
    swaps: Array<GqlPoolBatchSwapSwap>;
    timestamp: Scalars['Int'];
    tokenAmountIn: Scalars['String'];
    tokenAmountOut: Scalars['String'];
    tokenIn: Scalars['String'];
    tokenInPrice: Scalars['Float'];
    tokenOut: Scalars['String'];
    tokenOutPrice: Scalars['Float'];
    tx: Scalars['String'];
    userAddress: Scalars['String'];
    valueUSD: Scalars['Float'];
}

export interface GqlPoolBatchSwapPool {
    __typename: 'GqlPoolBatchSwapPool';
    id: Scalars['ID'];
    tokens: Array<Scalars['String']>;
}

export interface GqlPoolBatchSwapSwap {
    __typename: 'GqlPoolBatchSwapSwap';
    id: Scalars['ID'];
    pool: GqlPoolMinimal;
    timestamp: Scalars['Int'];
    tokenAmountIn: Scalars['String'];
    tokenAmountOut: Scalars['String'];
    tokenIn: Scalars['String'];
    tokenOut: Scalars['String'];
    tx: Scalars['String'];
    userAddress: Scalars['String'];
    valueUSD: Scalars['Float'];
}

export interface GqlPoolComposableStable extends GqlPoolBase {
    __typename: 'GqlPoolComposableStable';
    address: Scalars['Bytes'];
    allTokens: Array<GqlPoolTokenExpanded>;
    amp: Scalars['BigInt'];
    bptPriceRate: Scalars['BigDecimal'];
    chain: GqlChain;
    createTime: Scalars['Int'];
    decimals: Scalars['Int'];
    displayTokens: Array<GqlPoolTokenDisplay>;
    dynamicData: GqlPoolDynamicData;
    factory?: Maybe<Scalars['Bytes']>;
    id: Scalars['ID'];
    investConfig: GqlPoolInvestConfig;
    name: Scalars['String'];
    nestingType: GqlPoolNestingType;
    owner: Scalars['Bytes'];
    staking?: Maybe<GqlPoolStaking>;
    symbol: Scalars['String'];
    tokens: Array<GqlPoolTokenUnion>;
    type: GqlPoolType;
    userBalance?: Maybe<GqlPoolUserBalance>;
    vaultVersion: Scalars['Int'];
    version: Scalars['Int'];
    withdrawConfig: GqlPoolWithdrawConfig;
}

export interface GqlPoolComposableStableNested {
    __typename: 'GqlPoolComposableStableNested';
    address: Scalars['Bytes'];
    amp: Scalars['BigInt'];
    bptPriceRate: Scalars['BigDecimal'];
    createTime: Scalars['Int'];
    factory?: Maybe<Scalars['Bytes']>;
    id: Scalars['ID'];
    name: Scalars['String'];
    nestingType: GqlPoolNestingType;
    owner: Scalars['Bytes'];
    swapFee: Scalars['BigDecimal'];
    symbol: Scalars['String'];
    tokens: Array<GqlPoolTokenComposableStableNestedUnion>;
    totalLiquidity: Scalars['BigDecimal'];
    totalShares: Scalars['BigDecimal'];
    type: GqlPoolType;
    version: Scalars['Int'];
}

export interface GqlPoolDynamicData {
    __typename: 'GqlPoolDynamicData';
    apr: GqlPoolApr;
    fees24h: Scalars['BigDecimal'];
    fees24hAth: Scalars['BigDecimal'];
    fees24hAthTimestamp: Scalars['Int'];
    fees24hAtl: Scalars['BigDecimal'];
    fees24hAtlTimestamp: Scalars['Int'];
    fees48h: Scalars['BigDecimal'];
    holdersCount: Scalars['BigInt'];
    isInRecoveryMode: Scalars['Boolean'];
    isPaused: Scalars['Boolean'];
    lifetimeSwapFees: Scalars['BigDecimal'];
    lifetimeVolume: Scalars['BigDecimal'];
    poolId: Scalars['ID'];
    sharePriceAth: Scalars['BigDecimal'];
    sharePriceAthTimestamp: Scalars['Int'];
    sharePriceAtl: Scalars['BigDecimal'];
    sharePriceAtlTimestamp: Scalars['Int'];
    swapEnabled: Scalars['Boolean'];
    swapFee: Scalars['BigDecimal'];
    swapsCount: Scalars['BigInt'];
    totalLiquidity: Scalars['BigDecimal'];
    totalLiquidity24hAgo: Scalars['BigDecimal'];
    totalLiquidityAth: Scalars['BigDecimal'];
    totalLiquidityAthTimestamp: Scalars['Int'];
    totalLiquidityAtl: Scalars['BigDecimal'];
    totalLiquidityAtlTimestamp: Scalars['Int'];
    totalShares: Scalars['BigDecimal'];
    totalShares24hAgo: Scalars['BigDecimal'];
    volume24h: Scalars['BigDecimal'];
    volume24hAth: Scalars['BigDecimal'];
    volume24hAthTimestamp: Scalars['Int'];
    volume24hAtl: Scalars['BigDecimal'];
    volume24hAtlTimestamp: Scalars['Int'];
    volume48h: Scalars['BigDecimal'];
    yieldCapture24h: Scalars['BigDecimal'];
    yieldCapture48h: Scalars['BigDecimal'];
}

export interface GqlPoolElement extends GqlPoolBase {
    __typename: 'GqlPoolElement';
    address: Scalars['Bytes'];
    allTokens: Array<GqlPoolTokenExpanded>;
    baseToken: Scalars['Bytes'];
    chain: GqlChain;
    createTime: Scalars['Int'];
    decimals: Scalars['Int'];
    displayTokens: Array<GqlPoolTokenDisplay>;
    dynamicData: GqlPoolDynamicData;
    factory?: Maybe<Scalars['Bytes']>;
    id: Scalars['ID'];
    investConfig: GqlPoolInvestConfig;
    name: Scalars['String'];
    owner: Scalars['Bytes'];
    principalToken: Scalars['Bytes'];
    staking?: Maybe<GqlPoolStaking>;
    symbol: Scalars['String'];
    tokens: Array<GqlPoolToken>;
    type: GqlPoolType;
    unitSeconds: Scalars['BigInt'];
    userBalance?: Maybe<GqlPoolUserBalance>;
    vaultVersion: Scalars['Int'];
    version: Scalars['Int'];
    withdrawConfig: GqlPoolWithdrawConfig;
}

export interface GqlPoolEvent {
    blockNumber: Scalars['Int'];
    blockTimestamp: Scalars['Int'];
    chain: GqlChain;
    id: Scalars['ID'];
    logIndex: Scalars['Int'];
    poolId: Scalars['String'];
    sender: Scalars['String'];
    timestamp: Scalars['Int'];
    tx: Scalars['String'];
    type: GqlPoolEventType;
    userAddress: Scalars['String'];
    valueUSD: Scalars['Float'];
}

export interface GqlPoolEventAmount {
    __typename: 'GqlPoolEventAmount';
    address: Scalars['String'];
    amount: Scalars['String'];
    valueUSD: Scalars['Float'];
}

export type GqlPoolEventType = 'EXIT' | 'JOIN' | 'SWAP';

export type GqlPoolEventsDataRange = 'NINETY_DAYS' | 'SEVEN_DAYS' | 'THIRTY_DAYS';

export interface GqlPoolEventsFilter {
    chainIn?: InputMaybe<Array<GqlChain>>;
    poolIdIn?: InputMaybe<Array<Scalars['String']>>;
    typeIn?: InputMaybe<Array<GqlPoolEventType>>;
    userAddress?: InputMaybe<Scalars['String']>;
}

export interface GqlPoolFeaturedPool {
    __typename: 'GqlPoolFeaturedPool';
    pool: GqlPoolBase;
    poolId: Scalars['ID'];
    primary: Scalars['Boolean'];
}

export interface GqlPoolFeaturedPoolGroup {
    __typename: 'GqlPoolFeaturedPoolGroup';
    icon: Scalars['String'];
    id: Scalars['ID'];
    items: Array<GqlPoolFeaturedPoolGroupItem>;
    title: Scalars['String'];
}

export type GqlPoolFeaturedPoolGroupItem = GqlFeaturePoolGroupItemExternalLink | GqlPoolMinimal;

export interface GqlPoolFilter {
    categoryIn?: InputMaybe<Array<GqlPoolFilterCategory>>;
    categoryNotIn?: InputMaybe<Array<GqlPoolFilterCategory>>;
    chainIn?: InputMaybe<Array<GqlChain>>;
    chainNotIn?: InputMaybe<Array<GqlChain>>;
    createTime?: InputMaybe<GqlPoolTimePeriod>;
    filterIn?: InputMaybe<Array<Scalars['String']>>;
    filterNotIn?: InputMaybe<Array<Scalars['String']>>;
    idIn?: InputMaybe<Array<Scalars['String']>>;
    idNotIn?: InputMaybe<Array<Scalars['String']>>;
    poolTypeIn?: InputMaybe<Array<GqlPoolType>>;
    poolTypeNotIn?: InputMaybe<Array<GqlPoolType>>;
    tokensIn?: InputMaybe<Array<Scalars['String']>>;
    tokensNotIn?: InputMaybe<Array<Scalars['String']>>;
    userAddress?: InputMaybe<Scalars['String']>;
    vaultVersionIn?: InputMaybe<Array<Scalars['Int']>>;
}

export type GqlPoolFilterCategory = 'BLACK_LISTED' | 'INCENTIVIZED';

export interface GqlPoolFx extends GqlPoolBase {
    __typename: 'GqlPoolFx';
    address: Scalars['Bytes'];
    allTokens: Array<GqlPoolTokenExpanded>;
    alpha: Scalars['String'];
    beta: Scalars['String'];
    chain: GqlChain;
    createTime: Scalars['Int'];
    decimals: Scalars['Int'];
    delta: Scalars['String'];
    displayTokens: Array<GqlPoolTokenDisplay>;
    dynamicData: GqlPoolDynamicData;
    epsilon: Scalars['String'];
    factory?: Maybe<Scalars['Bytes']>;
    id: Scalars['ID'];
    investConfig: GqlPoolInvestConfig;
    lambda: Scalars['String'];
    name: Scalars['String'];
    owner?: Maybe<Scalars['Bytes']>;
    staking?: Maybe<GqlPoolStaking>;
    symbol: Scalars['String'];
    tokens: Array<GqlPoolTokenUnion>;
    type: GqlPoolType;
    userBalance?: Maybe<GqlPoolUserBalance>;
    vaultVersion: Scalars['Int'];
    version: Scalars['Int'];
    withdrawConfig: GqlPoolWithdrawConfig;
}

export interface GqlPoolGyro extends GqlPoolBase {
    __typename: 'GqlPoolGyro';
    address: Scalars['Bytes'];
    allTokens: Array<GqlPoolTokenExpanded>;
    alpha: Scalars['String'];
    beta: Scalars['String'];
    c: Scalars['String'];
    chain: GqlChain;
    createTime: Scalars['Int'];
    dSq: Scalars['String'];
    decimals: Scalars['Int'];
    displayTokens: Array<GqlPoolTokenDisplay>;
    dynamicData: GqlPoolDynamicData;
    factory?: Maybe<Scalars['Bytes']>;
    id: Scalars['ID'];
    investConfig: GqlPoolInvestConfig;
    lambda: Scalars['String'];
    name: Scalars['String'];
    nestingType: GqlPoolNestingType;
    owner: Scalars['Bytes'];
    root3Alpha: Scalars['String'];
    s: Scalars['String'];
    sqrtAlpha: Scalars['String'];
    sqrtBeta: Scalars['String'];
    staking?: Maybe<GqlPoolStaking>;
    symbol: Scalars['String'];
    tauAlphaX: Scalars['String'];
    tauAlphaY: Scalars['String'];
    tauBetaX: Scalars['String'];
    tauBetaY: Scalars['String'];
    tokens: Array<GqlPoolTokenUnion>;
    type: GqlPoolType;
    u: Scalars['String'];
    userBalance?: Maybe<GqlPoolUserBalance>;
    v: Scalars['String'];
    vaultVersion: Scalars['Int'];
    version: Scalars['Int'];
    w: Scalars['String'];
    withdrawConfig: GqlPoolWithdrawConfig;
    z: Scalars['String'];
}

export interface GqlPoolInvestConfig {
    __typename: 'GqlPoolInvestConfig';
    options: Array<GqlPoolInvestOption>;
    proportionalEnabled: Scalars['Boolean'];
    singleAssetEnabled: Scalars['Boolean'];
}

export interface GqlPoolInvestOption {
    __typename: 'GqlPoolInvestOption';
    poolTokenAddress: Scalars['String'];
    poolTokenIndex: Scalars['Int'];
    tokenOptions: Array<GqlPoolToken>;
}

export interface GqlPoolJoinExit {
    __typename: 'GqlPoolJoinExit';
    amounts: Array<GqlPoolJoinExitAmount>;
    chain: GqlChain;
    id: Scalars['ID'];
    poolId: Scalars['String'];
    sender: Scalars['String'];
    timestamp: Scalars['Int'];
    tx: Scalars['String'];
    type: GqlPoolJoinExitType;
    valueUSD?: Maybe<Scalars['String']>;
}

export interface GqlPoolJoinExitAmount {
    __typename: 'GqlPoolJoinExitAmount';
    address: Scalars['String'];
    amount: Scalars['String'];
}

export interface GqlPoolJoinExitEventV3 extends GqlPoolEvent {
    __typename: 'GqlPoolJoinExitEventV3';
    blockNumber: Scalars['Int'];
    blockTimestamp: Scalars['Int'];
    chain: GqlChain;
    id: Scalars['ID'];
    logIndex: Scalars['Int'];
    poolId: Scalars['String'];
    sender: Scalars['String'];
    timestamp: Scalars['Int'];
    tokens: Array<GqlPoolEventAmount>;
    tx: Scalars['String'];
    type: GqlPoolEventType;
    userAddress: Scalars['String'];
    valueUSD: Scalars['Float'];
}

export interface GqlPoolJoinExitFilter {
    chainIn?: InputMaybe<Array<GqlChain>>;
    poolIdIn?: InputMaybe<Array<Scalars['String']>>;
}

export type GqlPoolJoinExitType = 'Exit' | 'Join';

export interface GqlPoolLinear extends GqlPoolBase {
    __typename: 'GqlPoolLinear';
    address: Scalars['Bytes'];
    allTokens: Array<GqlPoolTokenExpanded>;
    bptPriceRate: Scalars['BigDecimal'];
    chain: GqlChain;
    createTime: Scalars['Int'];
    decimals: Scalars['Int'];
    displayTokens: Array<GqlPoolTokenDisplay>;
    dynamicData: GqlPoolDynamicData;
    factory?: Maybe<Scalars['Bytes']>;
    id: Scalars['ID'];
    investConfig: GqlPoolInvestConfig;
    lowerTarget: Scalars['BigInt'];
    mainIndex: Scalars['Int'];
    name: Scalars['String'];
    owner: Scalars['Bytes'];
    staking?: Maybe<GqlPoolStaking>;
    symbol: Scalars['String'];
    tokens: Array<GqlPoolToken>;
    type: GqlPoolType;
    upperTarget: Scalars['BigInt'];
    userBalance?: Maybe<GqlPoolUserBalance>;
    vaultVersion: Scalars['Int'];
    version: Scalars['Int'];
    withdrawConfig: GqlPoolWithdrawConfig;
    wrappedIndex: Scalars['Int'];
}

export interface GqlPoolLinearNested {
    __typename: 'GqlPoolLinearNested';
    address: Scalars['Bytes'];
    bptPriceRate: Scalars['BigDecimal'];
    createTime: Scalars['Int'];
    factory?: Maybe<Scalars['Bytes']>;
    id: Scalars['ID'];
    lowerTarget: Scalars['BigInt'];
    mainIndex: Scalars['Int'];
    name: Scalars['String'];
    owner: Scalars['Bytes'];
    symbol: Scalars['String'];
    tokens: Array<GqlPoolToken>;
    totalLiquidity: Scalars['BigDecimal'];
    totalShares: Scalars['BigDecimal'];
    type: GqlPoolType;
    upperTarget: Scalars['BigInt'];
    version: Scalars['Int'];
    wrappedIndex: Scalars['Int'];
}

export interface GqlPoolLinearPoolData {
    __typename: 'GqlPoolLinearPoolData';
    address: Scalars['String'];
    balance: Scalars['String'];
    id: Scalars['ID'];
    mainToken: GqlPoolLinearPoolMainToken;
    mainTokenTotalBalance: Scalars['String'];
    poolToken: Scalars['String'];
    priceRate: Scalars['String'];
    symbol: Scalars['String'];
    totalSupply: Scalars['String'];
    unwrappedTokenAddress: Scalars['String'];
    wrappedToken: GqlPoolLinearPoolWrappedToken;
}

export interface GqlPoolLinearPoolMainToken {
    __typename: 'GqlPoolLinearPoolMainToken';
    address: Scalars['String'];
    balance: Scalars['String'];
    decimals: Scalars['Int'];
    index: Scalars['Int'];
    name: Scalars['String'];
    symbol: Scalars['String'];
    totalSupply: Scalars['String'];
}

export interface GqlPoolLinearPoolWrappedToken {
    __typename: 'GqlPoolLinearPoolWrappedToken';
    address: Scalars['String'];
    balance: Scalars['String'];
    decimals: Scalars['Int'];
    index: Scalars['Int'];
    name: Scalars['String'];
    priceRate: Scalars['String'];
    symbol: Scalars['String'];
    totalSupply: Scalars['String'];
}

export interface GqlPoolLiquidityBootstrapping extends GqlPoolBase {
    __typename: 'GqlPoolLiquidityBootstrapping';
    address: Scalars['Bytes'];
    allTokens: Array<GqlPoolTokenExpanded>;
    chain: GqlChain;
    createTime: Scalars['Int'];
    decimals: Scalars['Int'];
    displayTokens: Array<GqlPoolTokenDisplay>;
    dynamicData: GqlPoolDynamicData;
    factory?: Maybe<Scalars['Bytes']>;
    id: Scalars['ID'];
    investConfig: GqlPoolInvestConfig;
    name: Scalars['String'];
    nestingType: GqlPoolNestingType;
    owner: Scalars['Bytes'];
    staking?: Maybe<GqlPoolStaking>;
    symbol: Scalars['String'];
    tokens: Array<GqlPoolTokenUnion>;
    type: GqlPoolType;
    userBalance?: Maybe<GqlPoolUserBalance>;
    vaultVersion: Scalars['Int'];
    version: Scalars['Int'];
    withdrawConfig: GqlPoolWithdrawConfig;
}

export interface GqlPoolMetaStable extends GqlPoolBase {
    __typename: 'GqlPoolMetaStable';
    address: Scalars['Bytes'];
    allTokens: Array<GqlPoolTokenExpanded>;
    amp: Scalars['BigInt'];
    chain: GqlChain;
    createTime: Scalars['Int'];
    decimals: Scalars['Int'];
    displayTokens: Array<GqlPoolTokenDisplay>;
    dynamicData: GqlPoolDynamicData;
    factory?: Maybe<Scalars['Bytes']>;
    id: Scalars['ID'];
    investConfig: GqlPoolInvestConfig;
    name: Scalars['String'];
    owner: Scalars['Bytes'];
    staking?: Maybe<GqlPoolStaking>;
    symbol: Scalars['String'];
    tokens: Array<GqlPoolToken>;
    type: GqlPoolType;
    userBalance?: Maybe<GqlPoolUserBalance>;
    vaultVersion: Scalars['Int'];
    version: Scalars['Int'];
    withdrawConfig: GqlPoolWithdrawConfig;
}

export interface GqlPoolMinimal {
    __typename: 'GqlPoolMinimal';
    address: Scalars['Bytes'];
    allTokens: Array<GqlPoolTokenExpanded>;
    chain: GqlChain;
    createTime: Scalars['Int'];
    decimals: Scalars['Int'];
    displayTokens: Array<GqlPoolTokenDisplay>;
    dynamicData: GqlPoolDynamicData;
    factory?: Maybe<Scalars['Bytes']>;
    id: Scalars['ID'];
    name: Scalars['String'];
    owner?: Maybe<Scalars['Bytes']>;
    staking?: Maybe<GqlPoolStaking>;
    symbol: Scalars['String'];
    type: GqlPoolType;
    userBalance?: Maybe<GqlPoolUserBalance>;
    vaultVersion: Scalars['Int'];
    version: Scalars['Int'];
}

export type GqlPoolNestedUnion = GqlPoolComposableStableNested | GqlPoolLinearNested;

export type GqlPoolNestingType = 'HAS_ONLY_PHANTOM_BPT' | 'HAS_SOME_PHANTOM_BPT' | 'NO_NESTING';

export type GqlPoolOrderBy = 'apr' | 'fees24h' | 'totalLiquidity' | 'totalShares' | 'userbalanceUsd' | 'volume24h';

export type GqlPoolOrderDirection = 'asc' | 'desc';

export interface GqlPoolSnapshot {
    __typename: 'GqlPoolSnapshot';
    amounts: Array<Scalars['String']>;
    chain: GqlChain;
    fees24h: Scalars['String'];
    holdersCount: Scalars['String'];
    id: Scalars['ID'];
    poolId: Scalars['String'];
    sharePrice: Scalars['String'];
    swapsCount: Scalars['String'];
    timestamp: Scalars['Int'];
    totalLiquidity: Scalars['String'];
    totalShares: Scalars['String'];
    totalSwapFee: Scalars['String'];
    totalSwapVolume: Scalars['String'];
    volume24h: Scalars['String'];
}

export type GqlPoolSnapshotDataRange =
    | 'ALL_TIME'
    | 'NINETY_DAYS'
    | 'ONE_HUNDRED_EIGHTY_DAYS'
    | 'ONE_YEAR'
    | 'THIRTY_DAYS';

export interface GqlPoolStable extends GqlPoolBase {
    __typename: 'GqlPoolStable';
    address: Scalars['Bytes'];
    allTokens: Array<GqlPoolTokenExpanded>;
    amp: Scalars['BigInt'];
    chain: GqlChain;
    createTime: Scalars['Int'];
    decimals: Scalars['Int'];
    displayTokens: Array<GqlPoolTokenDisplay>;
    dynamicData: GqlPoolDynamicData;
    factory?: Maybe<Scalars['Bytes']>;
    id: Scalars['ID'];
    investConfig: GqlPoolInvestConfig;
    name: Scalars['String'];
    owner: Scalars['Bytes'];
    staking?: Maybe<GqlPoolStaking>;
    symbol: Scalars['String'];
    tokens: Array<GqlPoolToken>;
    type: GqlPoolType;
    userBalance?: Maybe<GqlPoolUserBalance>;
    vaultVersion: Scalars['Int'];
    version: Scalars['Int'];
    withdrawConfig: GqlPoolWithdrawConfig;
}

export interface GqlPoolStableComposablePoolData {
    __typename: 'GqlPoolStableComposablePoolData';
    address: Scalars['String'];
    balance: Scalars['String'];
    id: Scalars['ID'];
    symbol: Scalars['String'];
    tokens: Array<GqlPoolToken>;
    totalSupply: Scalars['String'];
}

export interface GqlPoolStaking {
    __typename: 'GqlPoolStaking';
    address: Scalars['String'];
    chain: GqlChain;
    farm?: Maybe<GqlPoolStakingMasterChefFarm>;
    gauge?: Maybe<GqlPoolStakingGauge>;
    id: Scalars['ID'];
    reliquary?: Maybe<GqlPoolStakingReliquaryFarm>;
    type: GqlPoolStakingType;
}

export interface GqlPoolStakingFarmRewarder {
    __typename: 'GqlPoolStakingFarmRewarder';
    address: Scalars['String'];
    id: Scalars['ID'];
    rewardPerSecond: Scalars['String'];
    tokenAddress: Scalars['String'];
}

export interface GqlPoolStakingGauge {
    __typename: 'GqlPoolStakingGauge';
    gaugeAddress: Scalars['String'];
    id: Scalars['ID'];
    otherGauges?: Maybe<Array<GqlPoolStakingOtherGauge>>;
    rewards: Array<GqlPoolStakingGaugeReward>;
    status: GqlPoolStakingGaugeStatus;
    version: Scalars['Int'];
    workingSupply: Scalars['String'];
}

export interface GqlPoolStakingGaugeReward {
    __typename: 'GqlPoolStakingGaugeReward';
    id: Scalars['ID'];
    rewardPerSecond: Scalars['String'];
    tokenAddress: Scalars['String'];
}

export type GqlPoolStakingGaugeStatus = 'ACTIVE' | 'KILLED' | 'PREFERRED';

export interface GqlPoolStakingMasterChefFarm {
    __typename: 'GqlPoolStakingMasterChefFarm';
    beetsPerBlock: Scalars['String'];
    id: Scalars['ID'];
    rewarders?: Maybe<Array<GqlPoolStakingFarmRewarder>>;
}

export interface GqlPoolStakingOtherGauge {
    __typename: 'GqlPoolStakingOtherGauge';
    gaugeAddress: Scalars['String'];
    id: Scalars['ID'];
    rewards: Array<GqlPoolStakingGaugeReward>;
    status: GqlPoolStakingGaugeStatus;
    version: Scalars['Int'];
}

export interface GqlPoolStakingReliquaryFarm {
    __typename: 'GqlPoolStakingReliquaryFarm';
    beetsPerSecond: Scalars['String'];
    id: Scalars['ID'];
    levels?: Maybe<Array<GqlPoolStakingReliquaryFarmLevel>>;
    totalBalance: Scalars['String'];
    totalWeightedBalance: Scalars['String'];
}

export interface GqlPoolStakingReliquaryFarmLevel {
    __typename: 'GqlPoolStakingReliquaryFarmLevel';
    allocationPoints: Scalars['Int'];
    apr: Scalars['BigDecimal'];
    balance: Scalars['BigDecimal'];
    id: Scalars['ID'];
    level: Scalars['Int'];
    requiredMaturity: Scalars['Int'];
}

export type GqlPoolStakingType = 'FRESH_BEETS' | 'GAUGE' | 'MASTER_CHEF' | 'RELIQUARY';

export interface GqlPoolSwap {
    __typename: 'GqlPoolSwap';
    chain: GqlChain;
    id: Scalars['ID'];
    poolId: Scalars['String'];
    timestamp: Scalars['Int'];
    tokenAmountIn: Scalars['String'];
    tokenAmountOut: Scalars['String'];
    tokenIn: Scalars['String'];
    tokenOut: Scalars['String'];
    tx: Scalars['String'];
    userAddress: Scalars['String'];
    valueUSD: Scalars['Float'];
}

export interface GqlPoolSwapEventV3 extends GqlPoolEvent {
    __typename: 'GqlPoolSwapEventV3';
    blockNumber: Scalars['Int'];
    blockTimestamp: Scalars['Int'];
    chain: GqlChain;
    id: Scalars['ID'];
    logIndex: Scalars['Int'];
    poolId: Scalars['String'];
    sender: Scalars['String'];
    timestamp: Scalars['Int'];
    tokenIn: GqlPoolEventAmount;
    tokenOut: GqlPoolEventAmount;
    tx: Scalars['String'];
    type: GqlPoolEventType;
    userAddress: Scalars['String'];
    valueUSD: Scalars['Float'];
}

export interface GqlPoolSwapFilter {
    chainIn?: InputMaybe<Array<GqlChain>>;
    poolIdIn?: InputMaybe<Array<Scalars['String']>>;
    tokenInIn?: InputMaybe<Array<Scalars['String']>>;
    tokenOutIn?: InputMaybe<Array<Scalars['String']>>;
}

export interface GqlPoolTimePeriod {
    gt?: InputMaybe<Scalars['Int']>;
    lt?: InputMaybe<Scalars['Int']>;
}

export interface GqlPoolToken extends GqlPoolTokenBase {
    __typename: 'GqlPoolToken';
    address: Scalars['String'];
    balance: Scalars['BigDecimal'];
    decimals: Scalars['Int'];
    id: Scalars['ID'];
    index: Scalars['Int'];
    name: Scalars['String'];
    priceRate: Scalars['BigDecimal'];
    priceRateProvider?: Maybe<Scalars['String']>;
    symbol: Scalars['String'];
    totalBalance: Scalars['BigDecimal'];
    weight?: Maybe<Scalars['BigDecimal']>;
}

export interface GqlPoolTokenBase {
    address: Scalars['String'];
    balance: Scalars['BigDecimal'];
    decimals: Scalars['Int'];
    id: Scalars['ID'];
    index: Scalars['Int'];
    name: Scalars['String'];
    priceRate: Scalars['BigDecimal'];
    priceRateProvider?: Maybe<Scalars['String']>;
    symbol: Scalars['String'];
    totalBalance: Scalars['BigDecimal'];
    weight?: Maybe<Scalars['BigDecimal']>;
}

export interface GqlPoolTokenComposableStable extends GqlPoolTokenBase {
    __typename: 'GqlPoolTokenComposableStable';
    address: Scalars['String'];
    balance: Scalars['BigDecimal'];
    decimals: Scalars['Int'];
    id: Scalars['ID'];
    index: Scalars['Int'];
    name: Scalars['String'];
    pool: GqlPoolComposableStableNested;
    priceRate: Scalars['BigDecimal'];
    priceRateProvider?: Maybe<Scalars['String']>;
    symbol: Scalars['String'];
    totalBalance: Scalars['BigDecimal'];
    weight?: Maybe<Scalars['BigDecimal']>;
}

export type GqlPoolTokenComposableStableNestedUnion = GqlPoolToken | GqlPoolTokenLinear;

export interface GqlPoolTokenDisplay {
    __typename: 'GqlPoolTokenDisplay';
    address: Scalars['String'];
    id: Scalars['ID'];
    name: Scalars['String'];
    nestedTokens?: Maybe<Array<GqlPoolTokenDisplay>>;
    symbol: Scalars['String'];
    weight?: Maybe<Scalars['BigDecimal']>;
}

export interface GqlPoolTokenExpanded {
    __typename: 'GqlPoolTokenExpanded';
    address: Scalars['String'];
    decimals: Scalars['Int'];
    id: Scalars['ID'];
    isMainToken: Scalars['Boolean'];
    isNested: Scalars['Boolean'];
    isPhantomBpt: Scalars['Boolean'];
    name: Scalars['String'];
    symbol: Scalars['String'];
    weight?: Maybe<Scalars['String']>;
}

export interface GqlPoolTokenLinear extends GqlPoolTokenBase {
    __typename: 'GqlPoolTokenLinear';
    address: Scalars['String'];
    balance: Scalars['BigDecimal'];
    decimals: Scalars['Int'];
    id: Scalars['ID'];
    index: Scalars['Int'];
    mainTokenBalance: Scalars['BigDecimal'];
    name: Scalars['String'];
    pool: GqlPoolLinearNested;
    priceRate: Scalars['BigDecimal'];
    priceRateProvider?: Maybe<Scalars['String']>;
    symbol: Scalars['String'];
    totalBalance: Scalars['BigDecimal'];
    totalMainTokenBalance: Scalars['BigDecimal'];
    weight?: Maybe<Scalars['BigDecimal']>;
    wrappedTokenBalance: Scalars['BigDecimal'];
}

export type GqlPoolTokenUnion = GqlPoolToken | GqlPoolTokenComposableStable | GqlPoolTokenLinear;

export type GqlPoolType =
    | 'COMPOSABLE_STABLE'
    | 'ELEMENT'
    | 'FX'
    | 'GYRO'
    | 'GYRO3'
    | 'GYROE'
    | 'INVESTMENT'
    | 'LINEAR'
    | 'LIQUIDITY_BOOTSTRAPPING'
    | 'META_STABLE'
    | 'PHANTOM_STABLE'
    | 'STABLE'
    | 'UNKNOWN'
    | 'WEIGHTED';

export type GqlPoolUnion =
    | GqlPoolComposableStable
    | GqlPoolElement
    | GqlPoolFx
    | GqlPoolGyro
    | GqlPoolLinear
    | GqlPoolLiquidityBootstrapping
    | GqlPoolMetaStable
    | GqlPoolStable
    | GqlPoolWeighted;

export interface GqlPoolUserBalance {
    __typename: 'GqlPoolUserBalance';
    stakedBalance: Scalars['AmountHumanReadable'];
    stakedBalanceUsd: Scalars['Float'];
    totalBalance: Scalars['AmountHumanReadable'];
    totalBalanceUsd: Scalars['Float'];
    walletBalance: Scalars['AmountHumanReadable'];
    walletBalanceUsd: Scalars['Float'];
}

export interface GqlPoolUserSwapVolume {
    __typename: 'GqlPoolUserSwapVolume';
    swapVolumeUSD: Scalars['BigDecimal'];
    userAddress: Scalars['String'];
}

export interface GqlPoolWeighted extends GqlPoolBase {
    __typename: 'GqlPoolWeighted';
    address: Scalars['Bytes'];
    allTokens: Array<GqlPoolTokenExpanded>;
    chain: GqlChain;
    createTime: Scalars['Int'];
    decimals: Scalars['Int'];
    displayTokens: Array<GqlPoolTokenDisplay>;
    dynamicData: GqlPoolDynamicData;
    factory?: Maybe<Scalars['Bytes']>;
    id: Scalars['ID'];
    investConfig: GqlPoolInvestConfig;
    name: Scalars['String'];
    nestingType: GqlPoolNestingType;
    owner: Scalars['Bytes'];
    staking?: Maybe<GqlPoolStaking>;
    symbol: Scalars['String'];
    tokens: Array<GqlPoolTokenUnion>;
    type: GqlPoolType;
    userBalance?: Maybe<GqlPoolUserBalance>;
    vaultVersion: Scalars['Int'];
    version: Scalars['Int'];
    withdrawConfig: GqlPoolWithdrawConfig;
}

export interface GqlPoolWithdrawConfig {
    __typename: 'GqlPoolWithdrawConfig';
    options: Array<GqlPoolWithdrawOption>;
    proportionalEnabled: Scalars['Boolean'];
    singleAssetEnabled: Scalars['Boolean'];
}

export interface GqlPoolWithdrawOption {
    __typename: 'GqlPoolWithdrawOption';
    poolTokenAddress: Scalars['String'];
    poolTokenIndex: Scalars['Int'];
    tokenOptions: Array<GqlPoolToken>;
}

/** Returns the price impact of the path. If there is an error in the price impact calculation, priceImpact will be undefined but the error string is populated. */
export interface GqlPriceImpact {
    __typename: 'GqlPriceImpact';
    /** If priceImpact cant be calculated and is returned as undefined, the error string will be populated. */
    error?: Maybe<Scalars['String']>;
    /** Price impact in percent 0.01 -> 0.01%; undefined if an error happened. */
    priceImpact?: Maybe<Scalars['AmountHumanReadable']>;
}

export interface GqlProtocolMetricsAggregated {
    __typename: 'GqlProtocolMetricsAggregated';
    chains: Array<GqlProtocolMetricsChain>;
    numLiquidityProviders: Scalars['BigInt'];
    poolCount: Scalars['BigInt'];
    swapFee24h: Scalars['BigDecimal'];
    swapVolume24h: Scalars['BigDecimal'];
    totalLiquidity: Scalars['BigDecimal'];
    totalSwapFee: Scalars['BigDecimal'];
    totalSwapVolume: Scalars['BigDecimal'];
    yieldCapture24h: Scalars['BigDecimal'];
}

export interface GqlProtocolMetricsChain {
    __typename: 'GqlProtocolMetricsChain';
    chainId: Scalars['String'];
    numLiquidityProviders: Scalars['BigInt'];
    poolCount: Scalars['BigInt'];
    swapFee24h: Scalars['BigDecimal'];
    swapVolume24h: Scalars['BigDecimal'];
    totalLiquidity: Scalars['BigDecimal'];
    totalSwapFee: Scalars['BigDecimal'];
    totalSwapVolume: Scalars['BigDecimal'];
    yieldCapture24h: Scalars['BigDecimal'];
}

export interface GqlRelicSnapshot {
    __typename: 'GqlRelicSnapshot';
    balance: Scalars['String'];
    entryTimestamp: Scalars['Int'];
    farmId: Scalars['String'];
    level: Scalars['Int'];
    relicId: Scalars['Int'];
}

export interface GqlReliquaryFarmLevelSnapshot {
    __typename: 'GqlReliquaryFarmLevelSnapshot';
    balance: Scalars['String'];
    id: Scalars['ID'];
    level: Scalars['String'];
}

export interface GqlReliquaryFarmSnapshot {
    __typename: 'GqlReliquaryFarmSnapshot';
    dailyDeposited: Scalars['String'];
    dailyWithdrawn: Scalars['String'];
    farmId: Scalars['String'];
    id: Scalars['ID'];
    levelBalances: Array<GqlReliquaryFarmLevelSnapshot>;
    relicCount: Scalars['String'];
    timestamp: Scalars['Int'];
    tokenBalances: Array<GqlReliquaryTokenBalanceSnapshot>;
    totalBalance: Scalars['String'];
    totalLiquidity: Scalars['String'];
    userCount: Scalars['String'];
}

export interface GqlReliquaryTokenBalanceSnapshot {
    __typename: 'GqlReliquaryTokenBalanceSnapshot';
    address: Scalars['String'];
    balance: Scalars['String'];
    decimals: Scalars['Int'];
    id: Scalars['ID'];
    name: Scalars['String'];
    symbol: Scalars['String'];
}

export interface GqlSftmxStakingData {
    __typename: 'GqlSftmxStakingData';
    /** Current exchange rate for sFTMx -> FTM */
    exchangeRate: Scalars['String'];
    /** Whether maintenance is paused. This pauses reward claiming or harvesting and withdrawing from matured vaults. */
    maintenancePaused: Scalars['Boolean'];
    /** The maximum FTM amount to depost. */
    maxDepositLimit: Scalars['AmountHumanReadable'];
    /** The minimum FTM amount to deposit. */
    minDepositLimit: Scalars['AmountHumanReadable'];
    /** Number of vaults that delegated to validators. */
    numberOfVaults: Scalars['Int'];
    /** The current rebasing APR for sFTMx. */
    stakingApr: Scalars['String'];
    /** Total amount of FTM in custody of sFTMx. Staked FTM plus free pool FTM. */
    totalFtmAmount: Scalars['AmountHumanReadable'];
    /** Total amount of FTM in the free pool. */
    totalFtmAmountInPool: Scalars['AmountHumanReadable'];
    /** Total amount of FTM staked/delegated to validators. */
    totalFtmAmountStaked: Scalars['AmountHumanReadable'];
    /** Whether undelegation is paused. Undelegate is the first step to redeem sFTMx. */
    undelegatePaused: Scalars['Boolean'];
    /** A list of all the vaults that delegated to validators. */
    vaults: Array<GqlSftmxStakingVault>;
    /** Whether withdrawals are paused. Withdraw is the second and final step to redeem sFTMx. */
    withdrawPaused: Scalars['Boolean'];
    /** Delay to wait between undelegate (1st step) and withdraw (2nd step). */
    withdrawalDelay: Scalars['Int'];
}

export interface GqlSftmxStakingSnapshot {
    __typename: 'GqlSftmxStakingSnapshot';
    /** Current exchange rate for sFTMx -> FTM */
    exchangeRate: Scalars['String'];
    id: Scalars['ID'];
    /** The timestamp of the snapshot. Timestamp is end of day midnight. */
    timestamp: Scalars['Int'];
    /** Total amount of FTM in custody of sFTMx. Staked FTM plus free pool FTM. */
    totalFtmAmount: Scalars['AmountHumanReadable'];
    /** Total amount of FTM in the free pool. */
    totalFtmAmountInPool: Scalars['AmountHumanReadable'];
    /** Total amount of FTM staked/delegated to validators. */
    totalFtmAmountStaked: Scalars['AmountHumanReadable'];
}

export type GqlSftmxStakingSnapshotDataRange =
    | 'ALL_TIME'
    | 'NINETY_DAYS'
    | 'ONE_HUNDRED_EIGHTY_DAYS'
    | 'ONE_YEAR'
    | 'THIRTY_DAYS';

export interface GqlSftmxStakingVault {
    __typename: 'GqlSftmxStakingVault';
    /** The amount of FTM that has been delegated via this vault. */
    ftmAmountStaked: Scalars['AmountHumanReadable'];
    /** Whether the vault is matured, meaning whether unlock time has passed. */
    isMatured: Scalars['Boolean'];
    /** Timestamp when the delegated FTM unlocks, matures. */
    unlockTimestamp: Scalars['Int'];
    /** The address of the validator that the vault has delegated to. */
    validatorAddress: Scalars['String'];
    /** The ID of the validator that the vault has delegated to. */
    validatorId: Scalars['String'];
    /** The contract address of the vault. */
    vaultAddress: Scalars['String'];
    /** The internal index of the vault. */
    vaultIndex: Scalars['Int'];
}

export interface GqlSftmxWithdrawalRequests {
    __typename: 'GqlSftmxWithdrawalRequests';
    /** Amount of sFTMx that is being redeemed. */
    amountSftmx: Scalars['AmountHumanReadable'];
    /** The Withdrawal ID, used for interactions. */
    id: Scalars['String'];
    /** Whether the requests is finished and the user has withdrawn. */
    isWithdrawn: Scalars['Boolean'];
    /** The timestamp when the request was placed. There is a delay until the user can withdraw. See withdrawalDelay. */
    requestTimestamp: Scalars['Int'];
    /** The user address that this request belongs to. */
    user: Scalars['String'];
}

export interface GqlSorCallData {
    __typename: 'GqlSorCallData';
    /** The call data that needs to be sent to the RPC */
    callData: Scalars['String'];
    /** Maximum amount to be sent for exact out orders */
    maxAmountInRaw?: Maybe<Scalars['String']>;
    /** Minimum amount received for exact in orders */
    minAmountOutRaw?: Maybe<Scalars['String']>;
    /** The target contract to send the call data to */
    to: Scalars['String'];
    /** Value in ETH that needs to be sent for native swaps */
    value: Scalars['BigDecimal'];
}

/** The swap paths for a swap */
export interface GqlSorGetSwapPaths {
    __typename: 'GqlSorGetSwapPaths';
    /** Transaction data that can be posted to an RPC to execute the swap. */
    callData?: Maybe<GqlSorCallData>;
    /** The price of tokenOut in tokenIn. */
    effectivePrice: Scalars['AmountHumanReadable'];
    /** The price of tokenIn in tokenOut. */
    effectivePriceReversed: Scalars['AmountHumanReadable'];
    /** The found paths as needed as input for the b-sdk to execute the swap */
    paths: Array<GqlSorPath>;
    /** Price impact of the path */
    priceImpact: GqlPriceImpact;
    /** The return amount in human form. Return amount is either tokenOutAmount (if swapType is exactIn) or tokenInAmount (if swapType is exactOut) */
    returnAmount: Scalars['AmountHumanReadable'];
    /** The return amount in a raw form */
    returnAmountRaw: Scalars['BigDecimal'];
    /** The swap routes including pool information. Used to display by the UI */
    routes: Array<GqlSorSwapRoute>;
    /** The swap amount in human form. Swap amount is either tokenInAmount (if swapType is exactIn) or tokenOutAmount (if swapType is exactOut) */
    swapAmount: Scalars['AmountHumanReadable'];
    /** The swap amount in a raw form */
    swapAmountRaw: Scalars['BigDecimal'];
    /** The swapType that was provided, exact_in vs exact_out (givenIn vs givenOut) */
    swapType: GqlSorSwapType;
    /** Swaps as needed for the vault swap input to execute the swap */
    swaps: Array<GqlSorSwap>;
    /** All token addresses (or assets) as needed for the vault swap input to execute the swap */
    tokenAddresses: Array<Scalars['String']>;
    /** The token address of the tokenIn provided */
    tokenIn: Scalars['String'];
    /** The amount of tokenIn in human form */
    tokenInAmount: Scalars['AmountHumanReadable'];
    /** The token address of the tokenOut provided */
    tokenOut: Scalars['String'];
    /** The amount of tokenOut in human form */
    tokenOutAmount: Scalars['AmountHumanReadable'];
    /** The version of the vault these paths are from */
    vaultVersion: Scalars['Int'];
}

export interface GqlSorGetSwapsResponse {
    __typename: 'GqlSorGetSwapsResponse';
    effectivePrice: Scalars['AmountHumanReadable'];
    effectivePriceReversed: Scalars['AmountHumanReadable'];
    marketSp: Scalars['String'];
    priceImpact: Scalars['AmountHumanReadable'];
    returnAmount: Scalars['AmountHumanReadable'];
    returnAmountConsideringFees: Scalars['BigDecimal'];
    returnAmountFromSwaps?: Maybe<Scalars['BigDecimal']>;
    returnAmountScaled: Scalars['BigDecimal'];
    routes: Array<GqlSorSwapRoute>;
    swapAmount: Scalars['AmountHumanReadable'];
    swapAmountForSwaps?: Maybe<Scalars['BigDecimal']>;
    swapAmountScaled: Scalars['BigDecimal'];
    swapType: GqlSorSwapType;
    swaps: Array<GqlSorSwap>;
    tokenAddresses: Array<Scalars['String']>;
    tokenIn: Scalars['String'];
    tokenInAmount: Scalars['AmountHumanReadable'];
    tokenOut: Scalars['String'];
    tokenOutAmount: Scalars['AmountHumanReadable'];
}

/** A path of a swap. A swap can have multiple paths. Used as input to execute the swap via b-sdk */
export interface GqlSorPath {
    __typename: 'GqlSorPath';
    /** Input amount of this path in scaled form */
    inputAmountRaw: Scalars['String'];
    /** Output amount of this path in scaled form */
    outputAmountRaw: Scalars['String'];
    /** A sorted list of pool ids that are used in this path */
    pools: Array<Maybe<Scalars['String']>>;
    /** A sorted list of tokens that are ussed in this path */
    tokens: Array<Maybe<Token>>;
    /** Vault version of this path. */
    vaultVersion: Scalars['Int'];
}

/** A single swap step as used for input to the vault to execute a swap */
export interface GqlSorSwap {
    __typename: 'GqlSorSwap';
    /** Amount to be swapped in this step. 0 for chained swap. */
    amount: Scalars['String'];
    /** Index of the asset used in the tokenAddress array. */
    assetInIndex: Scalars['Int'];
    /** Index of the asset used in the tokenAddress array. */
    assetOutIndex: Scalars['Int'];
    /** Pool id used in this swap step */
    poolId: Scalars['String'];
    /** UserData used in this swap, generally uses defaults. */
    userData: Scalars['String'];
}

export interface GqlSorSwapOptionsInput {
    forceRefresh?: InputMaybe<Scalars['Boolean']>;
    maxPools?: InputMaybe<Scalars['Int']>;
    queryBatchSwap?: InputMaybe<Scalars['Boolean']>;
    timestamp?: InputMaybe<Scalars['Int']>;
}

/** The swap routes including pool information. Used to display by the UI */
export interface GqlSorSwapRoute {
    __typename: 'GqlSorSwapRoute';
    /** The hops this route takes */
    hops: Array<GqlSorSwapRouteHop>;
    /** Share of this route of the total swap */
    share: Scalars['Float'];
    /** Address of the tokenIn */
    tokenIn: Scalars['String'];
    /** Amount of the tokenIn in human form */
    tokenInAmount: Scalars['AmountHumanReadable'];
    /** Address of the tokenOut */
    tokenOut: Scalars['String'];
    /** Amount of the tokenOut in human form */
    tokenOutAmount: Scalars['AmountHumanReadable'];
}

/** A hop of a route. A route can have many hops meaning it traverses more than one pool. */
export interface GqlSorSwapRouteHop {
    __typename: 'GqlSorSwapRouteHop';
    /** The pool entity of this hop. */
    pool: GqlPoolMinimal;
    /** The pool id of this hop. */
    poolId: Scalars['String'];
    /** Address of the tokenIn */
    tokenIn: Scalars['String'];
    /** Amount of the tokenIn in human form */
    tokenInAmount: Scalars['AmountHumanReadable'];
    /** Address of the tokenOut */
    tokenOut: Scalars['String'];
    /** Amount of the tokenOut in human form */
    tokenOutAmount: Scalars['AmountHumanReadable'];
}

export type GqlSorSwapType = 'EXACT_IN' | 'EXACT_OUT';

/** Inputs for the call data to create the swap transaction. If this input is given, call data is added to the response. */
export interface GqlSwapCallDataInput {
    /** How long the swap should be valid, provide a timestamp. "999999999999999999" for infinite. Default: infinite */
    deadline?: InputMaybe<Scalars['Int']>;
    /** Who receives the output amount. */
    receiver: Scalars['String'];
    /** Who sends the input amount. */
    sender: Scalars['String'];
    /** The max slippage in percent 0.01 -> 0.01% */
    slippagePercentage: Scalars['String'];
}

export interface GqlToken {
    __typename: 'GqlToken';
    address: Scalars['String'];
    chain: GqlChain;
    chainId: Scalars['Int'];
    decimals: Scalars['Int'];
    description?: Maybe<Scalars['String']>;
    discordUrl?: Maybe<Scalars['String']>;
    logoURI?: Maybe<Scalars['String']>;
    name: Scalars['String'];
    priority: Scalars['Int'];
    symbol: Scalars['String'];
    telegramUrl?: Maybe<Scalars['String']>;
    tradable: Scalars['Boolean'];
    twitterUsername?: Maybe<Scalars['String']>;
    websiteUrl?: Maybe<Scalars['String']>;
}

export interface GqlTokenAmountHumanReadable {
    address: Scalars['String'];
    amount: Scalars['AmountHumanReadable'];
}

export interface GqlTokenCandlestickChartDataItem {
    __typename: 'GqlTokenCandlestickChartDataItem';
    close: Scalars['AmountHumanReadable'];
    high: Scalars['AmountHumanReadable'];
    id: Scalars['ID'];
    low: Scalars['AmountHumanReadable'];
    open: Scalars['AmountHumanReadable'];
    timestamp: Scalars['Int'];
}

export type GqlTokenChartDataRange = 'NINETY_DAY' | 'ONE_HUNDRED_EIGHTY_DAY' | 'ONE_YEAR' | 'SEVEN_DAY' | 'THIRTY_DAY';

export interface GqlTokenData {
    __typename: 'GqlTokenData';
    description?: Maybe<Scalars['String']>;
    discordUrl?: Maybe<Scalars['String']>;
    id: Scalars['ID'];
    telegramUrl?: Maybe<Scalars['String']>;
    tokenAddress: Scalars['String'];
    twitterUsername?: Maybe<Scalars['String']>;
    websiteUrl?: Maybe<Scalars['String']>;
}

export interface GqlTokenDynamicData {
    __typename: 'GqlTokenDynamicData';
    ath: Scalars['Float'];
    atl: Scalars['Float'];
    fdv?: Maybe<Scalars['String']>;
    high24h: Scalars['Float'];
    id: Scalars['String'];
    low24h: Scalars['Float'];
    marketCap?: Maybe<Scalars['String']>;
    price: Scalars['Float'];
    priceChange24h: Scalars['Float'];
    priceChangePercent7d?: Maybe<Scalars['Float']>;
    priceChangePercent14d?: Maybe<Scalars['Float']>;
    priceChangePercent24h: Scalars['Float'];
    priceChangePercent30d?: Maybe<Scalars['Float']>;
    tokenAddress: Scalars['String'];
    updatedAt: Scalars['String'];
}

export interface GqlTokenPrice {
    __typename: 'GqlTokenPrice';
    address: Scalars['String'];
    chain: GqlChain;
    price: Scalars['Float'];
}

export interface GqlTokenPriceChartDataItem {
    __typename: 'GqlTokenPriceChartDataItem';
    id: Scalars['ID'];
    price: Scalars['AmountHumanReadable'];
    timestamp: Scalars['Int'];
}

export type GqlTokenType = 'BPT' | 'LINEAR_WRAPPED_TOKEN' | 'PHANTOM_BPT' | 'WHITE_LISTED';

export interface GqlUserFbeetsBalance {
    __typename: 'GqlUserFbeetsBalance';
    id: Scalars['String'];
    stakedBalance: Scalars['AmountHumanReadable'];
    totalBalance: Scalars['AmountHumanReadable'];
    walletBalance: Scalars['AmountHumanReadable'];
}

export interface GqlUserPoolBalance {
    __typename: 'GqlUserPoolBalance';
    chain: GqlChain;
    poolId: Scalars['String'];
    stakedBalance: Scalars['AmountHumanReadable'];
    tokenAddress: Scalars['String'];
    tokenPrice: Scalars['Float'];
    totalBalance: Scalars['AmountHumanReadable'];
    walletBalance: Scalars['AmountHumanReadable'];
}

export interface GqlUserSwapVolumeFilter {
    poolIdIn?: InputMaybe<Array<Scalars['String']>>;
    tokenInIn?: InputMaybe<Array<Scalars['String']>>;
    tokenOutIn?: InputMaybe<Array<Scalars['String']>>;
}

export interface GqlVeBalUserData {
    __typename: 'GqlVeBalUserData';
    balance: Scalars['AmountHumanReadable'];
    rank?: Maybe<Scalars['Int']>;
}

export interface GqlVotingGauge {
    __typename: 'GqlVotingGauge';
    addedTimestamp?: Maybe<Scalars['Int']>;
    address: Scalars['Bytes'];
    childGaugeAddress?: Maybe<Scalars['Bytes']>;
    isKilled: Scalars['Boolean'];
    relativeWeightCap?: Maybe<Scalars['String']>;
}

export interface GqlVotingGaugeToken {
    __typename: 'GqlVotingGaugeToken';
    address: Scalars['String'];
    logoURI: Scalars['String'];
    symbol: Scalars['String'];
    weight?: Maybe<Scalars['String']>;
}

export interface GqlVotingPool {
    __typename: 'GqlVotingPool';
    address: Scalars['Bytes'];
    chain: GqlChain;
    gauge: GqlVotingGauge;
    id: Scalars['ID'];
    symbol: Scalars['String'];
    tokens: Array<GqlVotingGaugeToken>;
    type: GqlPoolType;
}

export interface Mutation {
    __typename: 'Mutation';
    beetsPoolLoadReliquarySnapshotsForAllFarms: Scalars['String'];
    beetsSyncFbeetsRatio: Scalars['String'];
    cacheAverageBlockTime: Scalars['String'];
    poolBlackListAddPool: Scalars['String'];
    poolBlackListRemovePool: Scalars['String'];
    poolDeletePool: Scalars['String'];
    poolInitOnChainDataForAllPools: Scalars['String'];
    poolInitializeSnapshotsForPool: Scalars['String'];
    poolLoadOnChainDataForAllPools: Scalars['String'];
    poolLoadOnChainDataForPoolsWithActiveUpdates: Scalars['String'];
    poolLoadSnapshotsForAllPools: Scalars['String'];
    poolLoadSnapshotsForPools: Scalars['String'];
    poolReloadAllPoolAprs: Scalars['String'];
    poolReloadAllTokenNestedPoolIds: Scalars['String'];
    poolReloadStakingForAllPools: Scalars['String'];
    poolSetPoolsWithPreferredGaugesAsIncentivized: Scalars['String'];
    poolSyncAllPoolsFromSubgraph: Array<Scalars['String']>;
    poolSyncLatestSnapshotsForAllPools: Scalars['String'];
    poolSyncNewPoolsFromSubgraph: Array<Scalars['String']>;
    poolSyncPool: Scalars['String'];
    poolSyncPoolAllTokensRelationship: Scalars['String'];
    poolSyncSanityPoolData: Scalars['String'];
    poolSyncStakingForPools: Scalars['String'];
    poolSyncSwapsForLast48Hours: Scalars['String'];
    poolSyncTotalShares: Scalars['String'];
    poolUpdateAprs: Scalars['String'];
    poolUpdateLifetimeValuesForAllPools: Scalars['String'];
    poolUpdateLiquidity24hAgoForAllPools: Scalars['String'];
    poolUpdateLiquidityValuesForAllPools: Scalars['String'];
    poolUpdateVolumeAndFeeValuesForAllPools: Scalars['String'];
    protocolCacheMetrics: Scalars['String'];
    sftmxSyncStakingData: Scalars['String'];
    sftmxSyncWithdrawalRequests: Scalars['String'];
    tokenDeleteTokenType: Scalars['String'];
    tokenReloadAllTokenTypes: Scalars['String'];
    tokenReloadTokenPrices?: Maybe<Scalars['Boolean']>;
    tokenSyncLatestFxPrices: Scalars['String'];
    tokenSyncTokenDefinitions: Scalars['String'];
    userInitStakedBalances: Scalars['String'];
    userInitWalletBalancesForAllPools: Scalars['String'];
    userInitWalletBalancesForPool: Scalars['String'];
    userSyncBalance: Scalars['String'];
    userSyncBalanceAllPools: Scalars['String'];
    userSyncChangedStakedBalances: Scalars['String'];
    userSyncChangedWalletBalancesForAllPools: Scalars['String'];
    veBalSyncAllUserBalances: Scalars['String'];
    veBalSyncTotalSupply: Scalars['String'];
}

export interface MutationPoolBlackListAddPoolArgs {
    poolId: Scalars['String'];
}

export interface MutationPoolBlackListRemovePoolArgs {
    poolId: Scalars['String'];
}

export interface MutationPoolDeletePoolArgs {
    poolId: Scalars['String'];
}

export interface MutationPoolInitializeSnapshotsForPoolArgs {
    poolId: Scalars['String'];
}

export interface MutationPoolLoadSnapshotsForPoolsArgs {
    poolIds: Array<Scalars['String']>;
    reload?: InputMaybe<Scalars['Boolean']>;
}

export interface MutationPoolReloadAllPoolAprsArgs {
    chain: GqlChain;
}

export interface MutationPoolReloadStakingForAllPoolsArgs {
    stakingTypes: Array<GqlPoolStakingType>;
}

export interface MutationPoolSyncLatestSnapshotsForAllPoolsArgs {
    daysToSync?: InputMaybe<Scalars['Int']>;
}

export interface MutationPoolSyncPoolArgs {
    poolId: Scalars['String'];
}

export interface MutationPoolUpdateAprsArgs {
    chain: GqlChain;
}

export interface MutationTokenDeleteTokenTypeArgs {
    tokenAddress: Scalars['String'];
    type: GqlTokenType;
}

export interface MutationTokenReloadTokenPricesArgs {
    chains: Array<GqlChain>;
}

export interface MutationTokenSyncLatestFxPricesArgs {
    chain: GqlChain;
}

export interface MutationUserInitStakedBalancesArgs {
    stakingTypes: Array<GqlPoolStakingType>;
}

export interface MutationUserInitWalletBalancesForPoolArgs {
    poolId: Scalars['String'];
}

export interface MutationUserSyncBalanceArgs {
    poolId: Scalars['String'];
}

export interface Query {
    __typename: 'Query';
    beetsGetFbeetsRatio: Scalars['String'];
    beetsPoolGetReliquaryFarmSnapshots: Array<GqlReliquaryFarmSnapshot>;
    blocksGetAverageBlockTime: Scalars['Float'];
    blocksGetBlocksPerDay: Scalars['Float'];
    blocksGetBlocksPerSecond: Scalars['Float'];
    blocksGetBlocksPerYear: Scalars['Float'];
    contentGetNewsItems: Array<GqlContentNewsItem>;
    latestSyncedBlocks: GqlLatestSyncedBlocks;
    /** Will de deprecated in favor of poolGetEvents */
    poolGetBatchSwaps: Array<GqlPoolBatchSwap>;
    /** Getting swap, join and exit events */
    poolGetEvents: Array<GqlPoolEvent>;
    poolGetFeaturedPoolGroups: Array<GqlPoolFeaturedPoolGroup>;
    poolGetFeaturedPools: Array<GqlPoolFeaturedPool>;
    poolGetFxPools: Array<GqlPoolFx>;
    poolGetGyroPools: Array<GqlPoolGyro>;
    /** Will de deprecated in favor of poolGetEvents */
    poolGetJoinExits: Array<GqlPoolJoinExit>;
    poolGetLinearPools: Array<GqlPoolLinear>;
    poolGetPool: GqlPoolBase;
    poolGetPools: Array<GqlPoolMinimal>;
    poolGetPoolsCount: Scalars['Int'];
    poolGetSnapshots: Array<GqlPoolSnapshot>;
    /** Will de deprecated in favor of poolGetEvents */
    poolGetSwaps: Array<GqlPoolSwap>;
    protocolMetricsAggregated: GqlProtocolMetricsAggregated;
    protocolMetricsChain: GqlProtocolMetricsChain;
    /** Get the staking data and status for sFTMx */
    sftmxGetStakingData: GqlSftmxStakingData;
    /** Get snapshots for sftmx staking for a specific range */
    sftmxGetStakingSnapshots: Array<GqlSftmxStakingSnapshot>;
    /** Retrieve the withdrawalrequests from a user */
    sftmxGetWithdrawalRequests: Array<GqlSftmxWithdrawalRequests>;
    /** Get swap quote from the SOR v2 for the V2 vault */
    sorGetSwapPaths: GqlSorGetSwapPaths;
    /** Get swap quote from the SOR, queries both the old and new SOR */
    sorGetSwaps: GqlSorGetSwapsResponse;
    tokenGetCandlestickChartData: Array<GqlTokenCandlestickChartDataItem>;
    tokenGetCurrentPrices: Array<GqlTokenPrice>;
    tokenGetHistoricalPrices: Array<GqlHistoricalTokenPrice>;
    tokenGetPriceChartData: Array<GqlTokenPriceChartDataItem>;
    tokenGetProtocolTokenPrice: Scalars['AmountHumanReadable'];
    tokenGetRelativePriceChartData: Array<GqlTokenPriceChartDataItem>;
    tokenGetTokenData?: Maybe<GqlTokenData>;
    tokenGetTokenDynamicData?: Maybe<GqlTokenDynamicData>;
    tokenGetTokens: Array<GqlToken>;
    tokenGetTokensData: Array<GqlTokenData>;
    tokenGetTokensDynamicData: Array<GqlTokenDynamicData>;
    userGetFbeetsBalance: GqlUserFbeetsBalance;
    userGetPoolBalances: Array<GqlUserPoolBalance>;
    /** Will de deprecated in favor of poolGetEvents */
    userGetPoolJoinExits: Array<GqlPoolJoinExit>;
    userGetStaking: Array<GqlPoolStaking>;
    /** Will de deprecated in favor of poolGetEvents */
    userGetSwaps: Array<GqlPoolSwap>;
    veBalGetTotalSupply: Scalars['AmountHumanReadable'];
    veBalGetUser: GqlVeBalUserData;
    veBalGetUserBalance: Scalars['AmountHumanReadable'];
    veBalGetVotingList: Array<GqlVotingPool>;
}

export interface QueryBeetsPoolGetReliquaryFarmSnapshotsArgs {
    id: Scalars['String'];
    range: GqlPoolSnapshotDataRange;
}

export interface QueryPoolGetBatchSwapsArgs {
    first?: InputMaybe<Scalars['Int']>;
    skip?: InputMaybe<Scalars['Int']>;
    where?: InputMaybe<GqlPoolSwapFilter>;
}

export interface QueryPoolGetEventsArgs {
    chain: GqlChain;
    poolId: Scalars['String'];
    range: GqlPoolEventsDataRange;
    typeIn: Array<GqlPoolEventType>;
    userAddress?: InputMaybe<Scalars['String']>;
}

export interface QueryPoolGetFeaturedPoolGroupsArgs {
    chains?: InputMaybe<Array<GqlChain>>;
}

export interface QueryPoolGetFeaturedPoolsArgs {
    chains: Array<GqlChain>;
}

export interface QueryPoolGetFxPoolsArgs {
    chains?: InputMaybe<Array<GqlChain>>;
}

export interface QueryPoolGetGyroPoolsArgs {
    chains?: InputMaybe<Array<GqlChain>>;
}

export interface QueryPoolGetJoinExitsArgs {
    first?: InputMaybe<Scalars['Int']>;
    skip?: InputMaybe<Scalars['Int']>;
    where?: InputMaybe<GqlPoolJoinExitFilter>;
}

export interface QueryPoolGetLinearPoolsArgs {
    chains?: InputMaybe<Array<GqlChain>>;
}

export interface QueryPoolGetPoolArgs {
    chain?: InputMaybe<GqlChain>;
    id: Scalars['String'];
    userAddress?: InputMaybe<Scalars['String']>;
}

export interface QueryPoolGetPoolsArgs {
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<GqlPoolOrderBy>;
    orderDirection?: InputMaybe<GqlPoolOrderDirection>;
    skip?: InputMaybe<Scalars['Int']>;
    textSearch?: InputMaybe<Scalars['String']>;
    where?: InputMaybe<GqlPoolFilter>;
}

export interface QueryPoolGetPoolsCountArgs {
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<GqlPoolOrderBy>;
    orderDirection?: InputMaybe<GqlPoolOrderDirection>;
    skip?: InputMaybe<Scalars['Int']>;
    textSearch?: InputMaybe<Scalars['String']>;
    where?: InputMaybe<GqlPoolFilter>;
}

export interface QueryPoolGetSnapshotsArgs {
    chain?: InputMaybe<GqlChain>;
    id: Scalars['String'];
    range: GqlPoolSnapshotDataRange;
}

export interface QueryPoolGetSwapsArgs {
    first?: InputMaybe<Scalars['Int']>;
    skip?: InputMaybe<Scalars['Int']>;
    where?: InputMaybe<GqlPoolSwapFilter>;
}

export interface QueryProtocolMetricsAggregatedArgs {
    chains?: InputMaybe<Array<GqlChain>>;
}

export interface QueryProtocolMetricsChainArgs {
    chain?: InputMaybe<GqlChain>;
}

export interface QuerySftmxGetStakingSnapshotsArgs {
    range: GqlSftmxStakingSnapshotDataRange;
}

export interface QuerySftmxGetWithdrawalRequestsArgs {
    user: Scalars['String'];
}

export interface QuerySorGetSwapPathsArgs {
    callDataInput?: InputMaybe<GqlSwapCallDataInput>;
    chain: GqlChain;
    queryBatchSwap?: InputMaybe<Scalars['Boolean']>;
    swapAmount: Scalars['BigDecimal'];
    swapType: GqlSorSwapType;
    tokenIn: Scalars['String'];
    tokenOut: Scalars['String'];
    useVaultVersion?: InputMaybe<Scalars['Int']>;
}

export interface QuerySorGetCowSwapsArgs {
    chain: GqlChain;
    swapAmount: Scalars['BigDecimal'];
    swapType: GqlSorSwapType;
    tokenIn: Scalars['String'];
    tokenOut: Scalars['String'];
}

export interface QuerySorGetSwapsArgs {
    chain?: InputMaybe<GqlChain>;
    swapAmount: Scalars['BigDecimal'];
    swapOptions: GqlSorSwapOptionsInput;
    swapType: GqlSorSwapType;
    tokenIn: Scalars['String'];
    tokenOut: Scalars['String'];
}

export interface QueryTokenGetCandlestickChartDataArgs {
    address: Scalars['String'];
    chain?: InputMaybe<GqlChain>;
    range: GqlTokenChartDataRange;
}

export interface QueryTokenGetCurrentPricesArgs {
    chains?: InputMaybe<Array<GqlChain>>;
}

export interface QueryTokenGetHistoricalPricesArgs {
    addresses: Array<Scalars['String']>;
    chain: GqlChain;
    range: GqlTokenChartDataRange;
}

export interface QueryTokenGetPriceChartDataArgs {
    address: Scalars['String'];
    chain?: InputMaybe<GqlChain>;
    range: GqlTokenChartDataRange;
}

export interface QueryTokenGetProtocolTokenPriceArgs {
    chain?: InputMaybe<GqlChain>;
}

export interface QueryTokenGetRelativePriceChartDataArgs {
    chain?: InputMaybe<GqlChain>;
    range: GqlTokenChartDataRange;
    tokenIn: Scalars['String'];
    tokenOut: Scalars['String'];
}

export interface QueryTokenGetTokenDataArgs {
    address: Scalars['String'];
    chain?: InputMaybe<GqlChain>;
}

export interface QueryTokenGetTokenDynamicDataArgs {
    address: Scalars['String'];
    chain?: InputMaybe<GqlChain>;
}

export interface QueryTokenGetTokensArgs {
    chains?: InputMaybe<Array<GqlChain>>;
}

export interface QueryTokenGetTokensDataArgs {
    addresses: Array<Scalars['String']>;
}

export interface QueryTokenGetTokensDynamicDataArgs {
    addresses: Array<Scalars['String']>;
    chain?: InputMaybe<GqlChain>;
}

export interface QueryUserGetPoolBalancesArgs {
    address?: InputMaybe<Scalars['String']>;
    chains?: InputMaybe<Array<GqlChain>>;
}

export interface QueryUserGetPoolJoinExitsArgs {
    address?: InputMaybe<Scalars['String']>;
    chain?: InputMaybe<GqlChain>;
    first?: InputMaybe<Scalars['Int']>;
    poolId: Scalars['String'];
    skip?: InputMaybe<Scalars['Int']>;
}

export interface QueryUserGetStakingArgs {
    address?: InputMaybe<Scalars['String']>;
    chains?: InputMaybe<Array<GqlChain>>;
}

export interface QueryUserGetSwapsArgs {
    address?: InputMaybe<Scalars['String']>;
    chain?: InputMaybe<GqlChain>;
    first?: InputMaybe<Scalars['Int']>;
    poolId: Scalars['String'];
    skip?: InputMaybe<Scalars['Int']>;
}

export interface Token {
    __typename: 'Token';
    address: Scalars['String'];
    decimals: Scalars['Int'];
}

export type GetPoolBatchSwapsQueryVariables = Exact<{
    first?: InputMaybe<Scalars['Int']>;
    skip?: InputMaybe<Scalars['Int']>;
    where?: InputMaybe<GqlPoolSwapFilter>;
}>;

export type GetPoolBatchSwapsQuery = {
    __typename: 'Query';
    batchSwaps: Array<{
        __typename: 'GqlPoolBatchSwap';
        id: string;
        timestamp: number;
        tokenAmountIn: string;
        tokenAmountOut: string;
        tokenIn: string;
        tokenOut: string;
        tokenInPrice: number;
        tokenOutPrice: number;
        tx: string;
        userAddress: string;
        valueUSD: number;
        swaps: Array<{
            __typename: 'GqlPoolBatchSwapSwap';
            id: string;
            timestamp: number;
            tokenAmountIn: string;
            tokenAmountOut: string;
            tokenIn: string;
            tokenOut: string;
            valueUSD: number;
            pool: {
                __typename: 'GqlPoolMinimal';
                id: string;
                name: string;
                type: GqlPoolType;
                symbol: string;
                allTokens: Array<{
                    __typename: 'GqlPoolTokenExpanded';
                    address: string;
                    isNested: boolean;
                    isPhantomBpt: boolean;
                    weight?: string | null;
                }>;
            };
        }>;
    }>;
};

export type GqlPoolBatchSwapFragment = {
    __typename: 'GqlPoolBatchSwap';
    id: string;
    timestamp: number;
    tokenAmountIn: string;
    tokenAmountOut: string;
    tokenIn: string;
    tokenOut: string;
    tokenInPrice: number;
    tokenOutPrice: number;
    tx: string;
    userAddress: string;
    valueUSD: number;
    swaps: Array<{
        __typename: 'GqlPoolBatchSwapSwap';
        id: string;
        timestamp: number;
        tokenAmountIn: string;
        tokenAmountOut: string;
        tokenIn: string;
        tokenOut: string;
        valueUSD: number;
        pool: {
            __typename: 'GqlPoolMinimal';
            id: string;
            name: string;
            type: GqlPoolType;
            symbol: string;
            allTokens: Array<{
                __typename: 'GqlPoolTokenExpanded';
                address: string;
                isNested: boolean;
                isPhantomBpt: boolean;
                weight?: string | null;
            }>;
        };
    }>;
};

export type GqlPoolBatchSwapSwapFragment = {
    __typename: 'GqlPoolBatchSwapSwap';
    id: string;
    timestamp: number;
    tokenAmountIn: string;
    tokenAmountOut: string;
    tokenIn: string;
    tokenOut: string;
    valueUSD: number;
    pool: {
        __typename: 'GqlPoolMinimal';
        id: string;
        name: string;
        type: GqlPoolType;
        symbol: string;
        allTokens: Array<{
            __typename: 'GqlPoolTokenExpanded';
            address: string;
            isNested: boolean;
            isPhantomBpt: boolean;
            weight?: string | null;
        }>;
    };
};

export type GetAppGlobalDataQueryVariables = Exact<{ [key: string]: never }>;

export type GetAppGlobalDataQuery = {
    __typename: 'Query';
    beetsGetFbeetsRatio: string;
    blocksGetBlocksPerDay: number;
    blocksGetAverageBlockTime: number;
    veBALTotalSupply: string;
    tokenGetTokens: Array<{
        __typename: 'GqlToken';
        address: string;
        name: string;
        symbol: string;
        decimals: number;
        chainId: number;
        logoURI?: string | null;
        priority: number;
        tradable: boolean;
    }>;
};

export type GetAppGlobalPollingDataQueryVariables = Exact<{ [key: string]: never }>;

export type GetAppGlobalPollingDataQuery = {
    __typename: 'Query';
    blocksGetBlocksPerDay: number;
    blocksGetAverageBlockTime: number;
    tokenGetProtocolTokenPrice: string;
    tokenGetCurrentPrices: Array<{ __typename: 'GqlTokenPrice'; price: number; address: string }>;
    protocolMetricsChain: {
        __typename: 'GqlProtocolMetricsChain';
        totalLiquidity: string;
        totalSwapVolume: string;
        totalSwapFee: string;
        poolCount: string;
        swapFee24h: string;
        swapVolume24h: string;
    };
};

export type GetTokensQueryVariables = Exact<{ [key: string]: never }>;

export type GetTokensQuery = {
    __typename: 'Query';
    tokens: Array<{
        __typename: 'GqlToken';
        address: string;
        name: string;
        symbol: string;
        decimals: number;
        chain: GqlChain;
        chainId: number;
        logoURI?: string | null;
        priority: number;
        tradable: boolean;
    }>;
};

export type GetTokenPricesQueryVariables = Exact<{ [key: string]: never }>;

export type GetTokenPricesQuery = {
    __typename: 'Query';
    tokenPrices: Array<{ __typename: 'GqlTokenPrice'; price: number; address: string }>;
};

export type GetTokensDynamicDataQueryVariables = Exact<{
    addresses: Array<Scalars['String']> | Scalars['String'];
}>;

export type GetTokensDynamicDataQuery = {
    __typename: 'Query';
    dynamicData: Array<{
        __typename: 'GqlTokenDynamicData';
        ath: number;
        atl: number;
        fdv?: string | null;
        high24h: number;
        id: string;
        low24h: number;
        marketCap?: string | null;
        price: number;
        priceChange24h: number;
        priceChangePercent7d?: number | null;
        priceChangePercent14d?: number | null;
        priceChangePercent24h: number;
        priceChangePercent30d?: number | null;
        tokenAddress: string;
        updatedAt: string;
    }>;
};

export type GetFbeetsRatioQueryVariables = Exact<{ [key: string]: never }>;

export type GetFbeetsRatioQuery = { __typename: 'Query'; ratio: string };

export type GetProtocolDataQueryVariables = Exact<{ [key: string]: never }>;

export type GetProtocolDataQuery = {
    __typename: 'Query';
    beetsPrice: string;
    protocolData: {
        __typename: 'GqlProtocolMetricsChain';
        totalLiquidity: string;
        totalSwapVolume: string;
        totalSwapFee: string;
        poolCount: string;
        swapFee24h: string;
        swapVolume24h: string;
    };
};

export type GetBlocksPerDayQueryVariables = Exact<{ [key: string]: never }>;

export type GetBlocksPerDayQuery = { __typename: 'Query'; blocksPerDay: number; avgBlockTime: number };

export type GetBeetsPriceQueryVariables = Exact<{ [key: string]: never }>;

export type GetBeetsPriceQuery = { __typename: 'Query'; beetsPrice: string };

export type GetUserDataQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserDataQuery = {
    __typename: 'Query';
    veBALUserBalance: string;
    balances: Array<{
        __typename: 'GqlUserPoolBalance';
        poolId: string;
        tokenAddress: string;
        tokenPrice: number;
        totalBalance: string;
        stakedBalance: string;
        walletBalance: string;
    }>;
    fbeetsBalance: {
        __typename: 'GqlUserFbeetsBalance';
        totalBalance: string;
        stakedBalance: string;
        walletBalance: string;
    };
    staking: Array<{
        __typename: 'GqlPoolStaking';
        id: string;
        chain: GqlChain;
        type: GqlPoolStakingType;
        address: string;
        chain: GqlChain;
        farm?: {
            __typename: 'GqlPoolStakingMasterChefFarm';
            id: string;
            beetsPerBlock: string;
            rewarders?: Array<{
                __typename: 'GqlPoolStakingFarmRewarder';
                id: string;
                address: string;
                tokenAddress: string;
                rewardPerSecond: string;
            }> | null;
        } | null;
        gauge?: {
            __typename: 'GqlPoolStakingGauge';
            id: string;
            gaugeAddress: string;
            version: number;
            status: GqlPoolStakingGaugeStatus;
            workingSupply: string;
            otherGauges?: Array<{
                __typename: 'GqlPoolStakingOtherGauge';
                gaugeAddress: string;
                version: number;
                status: GqlPoolStakingGaugeStatus;
                id: string;
                rewards: Array<{
                    __typename: 'GqlPoolStakingGaugeReward';
                    id: string;
                    tokenAddress: string;
                    rewardPerSecond: string;
                }>;
            }> | null;
            rewards: Array<{
                __typename: 'GqlPoolStakingGaugeReward';
                id: string;
                rewardPerSecond: string;
                tokenAddress: string;
            }>;
        } | null;
    }>;
};

export type UserSyncBalanceMutationVariables = Exact<{
    poolId: Scalars['String'];
}>;

export type UserSyncBalanceMutation = { __typename: 'Mutation'; userSyncBalance: string };

export type GetHomeDataQueryVariables = Exact<{ [key: string]: never }>;

export type GetHomeDataQuery = {
    __typename: 'Query';
    poolGetFeaturedPoolGroups: Array<{
        __typename: 'GqlPoolFeaturedPoolGroup';
        id: string;
        icon: string;
        title: string;
        items: Array<
            | {
                  __typename: 'GqlFeaturePoolGroupItemExternalLink';
                  id: string;
                  image: string;
                  buttonText: string;
                  buttonUrl: string;
              }
            | {
                  __typename: 'GqlPoolMinimal';
                  id: string;
                  address: string;
                  name: string;
                  dynamicData: {
                      __typename: 'GqlPoolDynamicData';
                      totalLiquidity: string;
                      totalShares: string;
                      apr: {
                          __typename: 'GqlPoolApr';
                          hasRewardApr: boolean;
                          swapApr: string;
                          thirdPartyApr:
                              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                              | { __typename: 'GqlPoolAprTotal'; total: string };
                          nativeRewardApr:
                              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                              | { __typename: 'GqlPoolAprTotal'; total: string };
                          apr:
                              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                              | { __typename: 'GqlPoolAprTotal'; total: string };
                          items: Array<{
                              __typename: 'GqlBalancePoolAprItem';
                              id: string;
                              title: string;
                              apr:
                                  | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                                  | { __typename: 'GqlPoolAprTotal'; total: string };
                              subItems?: Array<{
                                  __typename: 'GqlBalancePoolAprSubItem';
                                  id: string;
                                  title: string;
                                  apr:
                                      | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                                      | { __typename: 'GqlPoolAprTotal'; total: string };
                              }> | null;
                          }>;
                      };
                  };
                  allTokens: Array<{
                      __typename: 'GqlPoolTokenExpanded';
                      id: string;
                      address: string;
                      isNested: boolean;
                      isPhantomBpt: boolean;
                      weight?: string | null;
                  }>;
                  displayTokens: Array<{
                      __typename: 'GqlPoolTokenDisplay';
                      id: string;
                      address: string;
                      name: string;
                      weight?: string | null;
                      symbol: string;
                      nestedTokens?: Array<{
                          __typename: 'GqlPoolTokenDisplay';
                          id: string;
                          address: string;
                          name: string;
                          weight?: string | null;
                          symbol: string;
                      }> | null;
                  }>;
              }
        >;
    }>;
    contentGetNewsItems: Array<{
        __typename: 'GqlContentNewsItem';
        id: string;
        text: string;
        image?: string | null;
        url: string;
        source: GqlContentNewsItemSource;
        timestamp: string;
        discussionUrl?: string | null;
    }>;
};

export type GetHomeFeaturedPoolsQueryVariables = Exact<{ [key: string]: never }>;

export type GetHomeFeaturedPoolsQuery = {
    __typename: 'Query';
    featuredPoolGroups: Array<{
        __typename: 'GqlPoolFeaturedPoolGroup';
        id: string;
        icon: string;
        title: string;
        items: Array<
            | {
                  __typename: 'GqlFeaturePoolGroupItemExternalLink';
                  id: string;
                  image: string;
                  buttonText: string;
                  buttonUrl: string;
              }
            | {
                  __typename: 'GqlPoolMinimal';
                  id: string;
                  address: string;
                  name: string;
                  dynamicData: {
                      __typename: 'GqlPoolDynamicData';
                      totalLiquidity: string;
                      totalShares: string;
                      apr: {
                          __typename: 'GqlPoolApr';
                          hasRewardApr: boolean;
                          swapApr: string;
                          thirdPartyApr:
                              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                              | { __typename: 'GqlPoolAprTotal'; total: string };
                          nativeRewardApr:
                              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                              | { __typename: 'GqlPoolAprTotal'; total: string };
                          apr:
                              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                              | { __typename: 'GqlPoolAprTotal'; total: string };
                          items: Array<{
                              __typename: 'GqlBalancePoolAprItem';
                              id: string;
                              title: string;
                              apr:
                                  | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                                  | { __typename: 'GqlPoolAprTotal'; total: string };
                              subItems?: Array<{
                                  __typename: 'GqlBalancePoolAprSubItem';
                                  id: string;
                                  title: string;
                                  apr:
                                      | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                                      | { __typename: 'GqlPoolAprTotal'; total: string };
                              }> | null;
                          }>;
                      };
                  };
                  allTokens: Array<{
                      __typename: 'GqlPoolTokenExpanded';
                      id: string;
                      address: string;
                      isNested: boolean;
                      isPhantomBpt: boolean;
                      weight?: string | null;
                  }>;
                  displayTokens: Array<{
                      __typename: 'GqlPoolTokenDisplay';
                      id: string;
                      address: string;
                      name: string;
                      weight?: string | null;
                      symbol: string;
                      nestedTokens?: Array<{
                          __typename: 'GqlPoolTokenDisplay';
                          id: string;
                          address: string;
                          name: string;
                          weight?: string | null;
                          symbol: string;
                      }> | null;
                  }>;
              }
        >;
    }>;
};

export type GetHomeNewsItemsQueryVariables = Exact<{ [key: string]: never }>;

export type GetHomeNewsItemsQuery = {
    __typename: 'Query';
    newsItems: Array<{
        __typename: 'GqlContentNewsItem';
        id: string;
        text: string;
        image?: string | null;
        url: string;
        source: GqlContentNewsItemSource;
        timestamp: string;
        discussionUrl?: string | null;
    }>;
};

export type GqlPoolFeaturedPoolGroupFragment = {
    __typename: 'GqlPoolFeaturedPoolGroup';
    id: string;
    icon: string;
    title: string;
    items: Array<
        | {
              __typename: 'GqlFeaturePoolGroupItemExternalLink';
              id: string;
              image: string;
              buttonText: string;
              buttonUrl: string;
          }
        | {
              __typename: 'GqlPoolMinimal';
              id: string;
              address: string;
              name: string;
              dynamicData: {
                  __typename: 'GqlPoolDynamicData';
                  totalLiquidity: string;
                  totalShares: string;
                  apr: {
                      __typename: 'GqlPoolApr';
                      hasRewardApr: boolean;
                      swapApr: string;
                      thirdPartyApr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      nativeRewardApr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      apr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      items: Array<{
                          __typename: 'GqlBalancePoolAprItem';
                          id: string;
                          title: string;
                          apr:
                              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                              | { __typename: 'GqlPoolAprTotal'; total: string };
                          subItems?: Array<{
                              __typename: 'GqlBalancePoolAprSubItem';
                              id: string;
                              title: string;
                              apr:
                                  | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                                  | { __typename: 'GqlPoolAprTotal'; total: string };
                          }> | null;
                      }>;
                  };
              };
              allTokens: Array<{
                  __typename: 'GqlPoolTokenExpanded';
                  id: string;
                  address: string;
                  isNested: boolean;
                  isPhantomBpt: boolean;
                  weight?: string | null;
              }>;
              displayTokens: Array<{
                  __typename: 'GqlPoolTokenDisplay';
                  id: string;
                  address: string;
                  name: string;
                  weight?: string | null;
                  symbol: string;
                  nestedTokens?: Array<{
                      __typename: 'GqlPoolTokenDisplay';
                      id: string;
                      address: string;
                      name: string;
                      weight?: string | null;
                      symbol: string;
                  }> | null;
              }>;
          }
    >;
};

export type GqlPoolCardDataFragment = {
    __typename: 'GqlPoolMinimal';
    id: string;
    address: string;
    name: string;
    dynamicData: {
        __typename: 'GqlPoolDynamicData';
        totalLiquidity: string;
        totalShares: string;
        apr: {
            __typename: 'GqlPoolApr';
            hasRewardApr: boolean;
            swapApr: string;
            thirdPartyApr:
                | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                | { __typename: 'GqlPoolAprTotal'; total: string };
            nativeRewardApr:
                | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                | { __typename: 'GqlPoolAprTotal'; total: string };
            apr:
                | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                | { __typename: 'GqlPoolAprTotal'; total: string };
            items: Array<{
                __typename: 'GqlBalancePoolAprItem';
                id: string;
                title: string;
                apr:
                    | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                    | { __typename: 'GqlPoolAprTotal'; total: string };
                subItems?: Array<{
                    __typename: 'GqlBalancePoolAprSubItem';
                    id: string;
                    title: string;
                    apr:
                        | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                        | { __typename: 'GqlPoolAprTotal'; total: string };
                }> | null;
            }>;
        };
    };
    allTokens: Array<{
        __typename: 'GqlPoolTokenExpanded';
        id: string;
        address: string;
        isNested: boolean;
        isPhantomBpt: boolean;
        weight?: string | null;
    }>;
    displayTokens: Array<{
        __typename: 'GqlPoolTokenDisplay';
        id: string;
        address: string;
        name: string;
        weight?: string | null;
        symbol: string;
        nestedTokens?: Array<{
            __typename: 'GqlPoolTokenDisplay';
            id: string;
            address: string;
            name: string;
            weight?: string | null;
            symbol: string;
        }> | null;
    }>;
};

export type GetLinearPoolsQueryVariables = Exact<{ [key: string]: never }>;

export type GetLinearPoolsQuery = {
    __typename: 'Query';
    pools: Array<{
        __typename: 'GqlPoolLinear';
        id: string;
        address: string;
        name: string;
        owner: string;
        decimals: number;
        factory?: string | null;
        symbol: string;
        createTime: number;
        mainIndex: number;
        wrappedIndex: number;
        lowerTarget: string;
        upperTarget: string;
        dynamicData: {
            __typename: 'GqlPoolDynamicData';
            poolId: string;
            swapEnabled: boolean;
            totalLiquidity: string;
            totalLiquidity24hAgo: string;
            totalShares: string;
            totalShares24hAgo: string;
            fees24h: string;
            swapFee: string;
            volume24h: string;
            fees48h: string;
            volume48h: string;
            apr: {
                __typename: 'GqlPoolApr';
                hasRewardApr: boolean;
                swapApr: string;
                thirdPartyApr:
                    | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                    | { __typename: 'GqlPoolAprTotal'; total: string };
                nativeRewardApr:
                    | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                    | { __typename: 'GqlPoolAprTotal'; total: string };
                apr:
                    | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                    | { __typename: 'GqlPoolAprTotal'; total: string };
                items: Array<{
                    __typename: 'GqlBalancePoolAprItem';
                    id: string;
                    title: string;
                    apr:
                        | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                        | { __typename: 'GqlPoolAprTotal'; total: string };
                    subItems?: Array<{
                        __typename: 'GqlBalancePoolAprSubItem';
                        id: string;
                        title: string;
                        apr:
                            | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                            | { __typename: 'GqlPoolAprTotal'; total: string };
                    }> | null;
                }>;
            };
        };
        tokens: Array<{
            __typename: 'GqlPoolToken';
            id: string;
            index: number;
            name: string;
            symbol: string;
            balance: string;
            address: string;
            priceRate: string;
            decimals: number;
            weight?: string | null;
            totalBalance: string;
        }>;
    }>;
};

export type GqlPoolLinearFragment = {
    __typename: 'GqlPoolLinear';
    id: string;
    address: string;
    name: string;
    owner: string;
    decimals: number;
    factory?: string | null;
    symbol: string;
    createTime: number;
    mainIndex: number;
    wrappedIndex: number;
    lowerTarget: string;
    upperTarget: string;
    dynamicData: {
        __typename: 'GqlPoolDynamicData';
        poolId: string;
        swapEnabled: boolean;
        totalLiquidity: string;
        totalLiquidity24hAgo: string;
        totalShares: string;
        totalShares24hAgo: string;
        fees24h: string;
        swapFee: string;
        volume24h: string;
        fees48h: string;
        volume48h: string;
        apr: {
            __typename: 'GqlPoolApr';
            hasRewardApr: boolean;
            swapApr: string;
            thirdPartyApr:
                | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                | { __typename: 'GqlPoolAprTotal'; total: string };
            nativeRewardApr:
                | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                | { __typename: 'GqlPoolAprTotal'; total: string };
            apr:
                | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                | { __typename: 'GqlPoolAprTotal'; total: string };
            items: Array<{
                __typename: 'GqlBalancePoolAprItem';
                id: string;
                title: string;
                apr:
                    | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                    | { __typename: 'GqlPoolAprTotal'; total: string };
                subItems?: Array<{
                    __typename: 'GqlBalancePoolAprSubItem';
                    id: string;
                    title: string;
                    apr:
                        | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                        | { __typename: 'GqlPoolAprTotal'; total: string };
                }> | null;
            }>;
        };
    };
    tokens: Array<{
        __typename: 'GqlPoolToken';
        id: string;
        index: number;
        name: string;
        symbol: string;
        balance: string;
        address: string;
        priceRate: string;
        decimals: number;
        weight?: string | null;
        totalBalance: string;
    }>;
};

export type GetPoolQueryVariables = Exact<{
    id: Scalars['String'];
}>;

export type GetPoolQuery = {
    __typename: 'Query';
    pool:
        | {
              __typename: 'GqlPoolComposableStable';
              amp: string;
              nestingType: GqlPoolNestingType;
              id: string;
              address: string;
              name: string;
              owner: string;
              decimals: number;
              factory?: string | null;
              symbol: string;
              createTime: number;
              version: number;
              tokens: Array<
                  | {
                        __typename: 'GqlPoolToken';
                        id: string;
                        index: number;
                        name: string;
                        symbol: string;
                        balance: string;
                        address: string;
                        priceRate: string;
                        decimals: number;
                        weight?: string | null;
                        totalBalance: string;
                    }
                  | {
                        __typename: 'GqlPoolTokenComposableStable';
                        id: string;
                        index: number;
                        name: string;
                        symbol: string;
                        balance: string;
                        address: string;
                        weight?: string | null;
                        priceRate: string;
                        decimals: number;
                        totalBalance: string;
                        pool: {
                            __typename: 'GqlPoolComposableStableNested';
                            id: string;
                            name: string;
                            symbol: string;
                            address: string;
                            owner: string;
                            factory?: string | null;
                            createTime: number;
                            totalShares: string;
                            totalLiquidity: string;
                            nestingType: GqlPoolNestingType;
                            swapFee: string;
                            amp: string;
                            tokens: Array<
                                | {
                                      __typename: 'GqlPoolToken';
                                      id: string;
                                      index: number;
                                      name: string;
                                      symbol: string;
                                      balance: string;
                                      address: string;
                                      priceRate: string;
                                      decimals: number;
                                      weight?: string | null;
                                      totalBalance: string;
                                  }
                                | {
                                      __typename: 'GqlPoolTokenLinear';
                                      id: string;
                                      index: number;
                                      name: string;
                                      symbol: string;
                                      balance: string;
                                      address: string;
                                      priceRate: string;
                                      decimals: number;
                                      weight?: string | null;
                                      mainTokenBalance: string;
                                      wrappedTokenBalance: string;
                                      totalMainTokenBalance: string;
                                      totalBalance: string;
                                      pool: {
                                          __typename: 'GqlPoolLinearNested';
                                          id: string;
                                          name: string;
                                          symbol: string;
                                          address: string;
                                          owner: string;
                                          factory?: string | null;
                                          createTime: number;
                                          wrappedIndex: number;
                                          mainIndex: number;
                                          upperTarget: string;
                                          lowerTarget: string;
                                          totalShares: string;
                                          totalLiquidity: string;
                                          bptPriceRate: string;
                                          tokens: Array<{
                                              __typename: 'GqlPoolToken';
                                              id: string;
                                              index: number;
                                              name: string;
                                              symbol: string;
                                              balance: string;
                                              address: string;
                                              priceRate: string;
                                              decimals: number;
                                              weight?: string | null;
                                              totalBalance: string;
                                          }>;
                                      };
                                  }
                            >;
                        };
                    }
                  | {
                        __typename: 'GqlPoolTokenLinear';
                        id: string;
                        index: number;
                        name: string;
                        symbol: string;
                        balance: string;
                        address: string;
                        priceRate: string;
                        decimals: number;
                        weight?: string | null;
                        mainTokenBalance: string;
                        wrappedTokenBalance: string;
                        totalMainTokenBalance: string;
                        totalBalance: string;
                        pool: {
                            __typename: 'GqlPoolLinearNested';
                            id: string;
                            name: string;
                            symbol: string;
                            address: string;
                            owner: string;
                            factory?: string | null;
                            createTime: number;
                            wrappedIndex: number;
                            mainIndex: number;
                            upperTarget: string;
                            lowerTarget: string;
                            totalShares: string;
                            totalLiquidity: string;
                            bptPriceRate: string;
                            tokens: Array<{
                                __typename: 'GqlPoolToken';
                                id: string;
                                index: number;
                                name: string;
                                symbol: string;
                                balance: string;
                                address: string;
                                priceRate: string;
                                decimals: number;
                                weight?: string | null;
                                totalBalance: string;
                            }>;
                        };
                    }
              >;
              dynamicData: {
                  __typename: 'GqlPoolDynamicData';
                  poolId: string;
                  swapEnabled: boolean;
                  totalLiquidity: string;
                  totalLiquidity24hAgo: string;
                  totalShares: string;
                  totalShares24hAgo: string;
                  fees24h: string;
                  swapFee: string;
                  volume24h: string;
                  fees48h: string;
                  volume48h: string;
                  lifetimeVolume: string;
                  lifetimeSwapFees: string;
                  holdersCount: string;
                  swapsCount: string;
                  sharePriceAth: string;
                  sharePriceAthTimestamp: number;
                  sharePriceAtl: string;
                  sharePriceAtlTimestamp: number;
                  totalLiquidityAth: string;
                  totalLiquidityAthTimestamp: number;
                  totalLiquidityAtl: string;
                  totalLiquidityAtlTimestamp: number;
                  volume24hAth: string;
                  volume24hAthTimestamp: number;
                  volume24hAtl: string;
                  volume24hAtlTimestamp: number;
                  fees24hAth: string;
                  fees24hAthTimestamp: number;
                  fees24hAtl: string;
                  fees24hAtlTimestamp: number;
                  apr: {
                      __typename: 'GqlPoolApr';
                      hasRewardApr: boolean;
                      swapApr: string;
                      thirdPartyApr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      nativeRewardApr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      apr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      items: Array<{
                          __typename: 'GqlBalancePoolAprItem';
                          id: string;
                          title: string;
                          apr:
                              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                              | { __typename: 'GqlPoolAprTotal'; total: string };
                          subItems?: Array<{
                              __typename: 'GqlBalancePoolAprSubItem';
                              id: string;
                              title: string;
                              apr:
                                  | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                                  | { __typename: 'GqlPoolAprTotal'; total: string };
                          }> | null;
                      }>;
                  };
              };
              allTokens: Array<{
                  __typename: 'GqlPoolTokenExpanded';
                  id: string;
                  address: string;
                  name: string;
                  symbol: string;
                  decimals: number;
                  isNested: boolean;
                  isPhantomBpt: boolean;
              }>;
              displayTokens: Array<{
                  __typename: 'GqlPoolTokenDisplay';
                  id: string;
                  address: string;
                  name: string;
                  weight?: string | null;
                  symbol: string;
                  nestedTokens?: Array<{
                      __typename: 'GqlPoolTokenDisplay';
                      id: string;
                      address: string;
                      name: string;
                      weight?: string | null;
                      symbol: string;
                  }> | null;
              }>;
              staking?: {
                  __typename: 'GqlPoolStaking';
                  id: string;
                  type: GqlPoolStakingType;
                  address: string;
                  farm?: {
                      __typename: 'GqlPoolStakingMasterChefFarm';
                      id: string;
                      beetsPerBlock: string;
                      rewarders?: Array<{
                          __typename: 'GqlPoolStakingFarmRewarder';
                          id: string;
                          address: string;
                          tokenAddress: string;
                          rewardPerSecond: string;
                      }> | null;
                  } | null;
                  gauge?: {
                      __typename: 'GqlPoolStakingGauge';
                      id: string;
                      gaugeAddress: string;
                      version: number;
                      status: GqlPoolStakingGaugeStatus;
                      workingSupply: string;
                      otherGauges?: Array<{
                          __typename: 'GqlPoolStakingOtherGauge';
                          gaugeAddress: string;
                          version: number;
                          status: GqlPoolStakingGaugeStatus;
                          id: string;
                          rewards: Array<{
                              __typename: 'GqlPoolStakingGaugeReward';
                              id: string;
                              tokenAddress: string;
                              rewardPerSecond: string;
                          }>;
                      }> | null;
                      rewards: Array<{
                          __typename: 'GqlPoolStakingGaugeReward';
                          id: string;
                          rewardPerSecond: string;
                          tokenAddress: string;
                      }>;
                  } | null;
                  reliquary?: {
                      __typename: 'GqlPoolStakingReliquaryFarm';
                      beetsPerSecond: string;
                      totalBalance: string;
                      levels?: Array<{
                          __typename: 'GqlPoolStakingReliquaryFarmLevel';
                          level: number;
                          balance: string;
                          apr: string;
                          allocationPoints: number;
                      }> | null;
                  } | null;
              } | null;
              investConfig: {
                  __typename: 'GqlPoolInvestConfig';
                  singleAssetEnabled: boolean;
                  proportionalEnabled: boolean;
                  options: Array<{
                      __typename: 'GqlPoolInvestOption';
                      poolTokenIndex: number;
                      poolTokenAddress: string;
                      tokenOptions: Array<{
                          __typename: 'GqlPoolToken';
                          id: string;
                          index: number;
                          name: string;
                          symbol: string;
                          balance: string;
                          address: string;
                          priceRate: string;
                          decimals: number;
                          weight?: string | null;
                          totalBalance: string;
                      }>;
                  }>;
              };
              withdrawConfig: {
                  __typename: 'GqlPoolWithdrawConfig';
                  singleAssetEnabled: boolean;
                  proportionalEnabled: boolean;
                  options: Array<{
                      __typename: 'GqlPoolWithdrawOption';
                      poolTokenIndex: number;
                      poolTokenAddress: string;
                      tokenOptions: Array<{
                          __typename: 'GqlPoolToken';
                          id: string;
                          index: number;
                          name: string;
                          symbol: string;
                          balance: string;
                          address: string;
                          priceRate: string;
                          decimals: number;
                          weight?: string | null;
                          totalBalance: string;
                      }>;
                  }>;
              };
          }
        | {
              __typename: 'GqlPoolElement';
              unitSeconds: string;
              principalToken: string;
              baseToken: string;
              id: string;
              address: string;
              name: string;
              owner: string;
              decimals: number;
              factory?: string | null;
              symbol: string;
              createTime: number;
              version: number;
              tokens: Array<{
                  __typename: 'GqlPoolToken';
                  id: string;
                  index: number;
                  name: string;
                  symbol: string;
                  balance: string;
                  address: string;
                  priceRate: string;
                  decimals: number;
                  weight?: string | null;
                  totalBalance: string;
              }>;
              dynamicData: {
                  __typename: 'GqlPoolDynamicData';
                  poolId: string;
                  swapEnabled: boolean;
                  totalLiquidity: string;
                  totalLiquidity24hAgo: string;
                  totalShares: string;
                  totalShares24hAgo: string;
                  fees24h: string;
                  swapFee: string;
                  volume24h: string;
                  fees48h: string;
                  volume48h: string;
                  lifetimeVolume: string;
                  lifetimeSwapFees: string;
                  holdersCount: string;
                  swapsCount: string;
                  sharePriceAth: string;
                  sharePriceAthTimestamp: number;
                  sharePriceAtl: string;
                  sharePriceAtlTimestamp: number;
                  totalLiquidityAth: string;
                  totalLiquidityAthTimestamp: number;
                  totalLiquidityAtl: string;
                  totalLiquidityAtlTimestamp: number;
                  volume24hAth: string;
                  volume24hAthTimestamp: number;
                  volume24hAtl: string;
                  volume24hAtlTimestamp: number;
                  fees24hAth: string;
                  fees24hAthTimestamp: number;
                  fees24hAtl: string;
                  fees24hAtlTimestamp: number;
                  apr: {
                      __typename: 'GqlPoolApr';
                      hasRewardApr: boolean;
                      swapApr: string;
                      thirdPartyApr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      nativeRewardApr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      apr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      items: Array<{
                          __typename: 'GqlBalancePoolAprItem';
                          id: string;
                          title: string;
                          apr:
                              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                              | { __typename: 'GqlPoolAprTotal'; total: string };
                          subItems?: Array<{
                              __typename: 'GqlBalancePoolAprSubItem';
                              id: string;
                              title: string;
                              apr:
                                  | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                                  | { __typename: 'GqlPoolAprTotal'; total: string };
                          }> | null;
                      }>;
                  };
              };
              allTokens: Array<{
                  __typename: 'GqlPoolTokenExpanded';
                  id: string;
                  address: string;
                  name: string;
                  symbol: string;
                  decimals: number;
                  isNested: boolean;
                  isPhantomBpt: boolean;
              }>;
              displayTokens: Array<{
                  __typename: 'GqlPoolTokenDisplay';
                  id: string;
                  address: string;
                  name: string;
                  weight?: string | null;
                  symbol: string;
                  nestedTokens?: Array<{
                      __typename: 'GqlPoolTokenDisplay';
                      id: string;
                      address: string;
                      name: string;
                      weight?: string | null;
                      symbol: string;
                  }> | null;
              }>;
              staking?: {
                  __typename: 'GqlPoolStaking';
                  id: string;
                  type: GqlPoolStakingType;
                  address: string;
                  farm?: {
                      __typename: 'GqlPoolStakingMasterChefFarm';
                      id: string;
                      beetsPerBlock: string;
                      rewarders?: Array<{
                          __typename: 'GqlPoolStakingFarmRewarder';
                          id: string;
                          address: string;
                          tokenAddress: string;
                          rewardPerSecond: string;
                      }> | null;
                  } | null;
                  gauge?: {
                      __typename: 'GqlPoolStakingGauge';
                      id: string;
                      gaugeAddress: string;
                      version: number;
                      status: GqlPoolStakingGaugeStatus;
                      workingSupply: string;
                      otherGauges?: Array<{
                          __typename: 'GqlPoolStakingOtherGauge';
                          gaugeAddress: string;
                          version: number;
                          status: GqlPoolStakingGaugeStatus;
                          id: string;
                          rewards: Array<{
                              __typename: 'GqlPoolStakingGaugeReward';
                              id: string;
                              tokenAddress: string;
                              rewardPerSecond: string;
                          }>;
                      }> | null;
                      rewards: Array<{
                          __typename: 'GqlPoolStakingGaugeReward';
                          id: string;
                          rewardPerSecond: string;
                          tokenAddress: string;
                      }>;
                  } | null;
                  reliquary?: {
                      __typename: 'GqlPoolStakingReliquaryFarm';
                      beetsPerSecond: string;
                      totalBalance: string;
                      levels?: Array<{
                          __typename: 'GqlPoolStakingReliquaryFarmLevel';
                          level: number;
                          balance: string;
                          apr: string;
                          allocationPoints: number;
                      }> | null;
                  } | null;
              } | null;
              investConfig: {
                  __typename: 'GqlPoolInvestConfig';
                  singleAssetEnabled: boolean;
                  proportionalEnabled: boolean;
                  options: Array<{
                      __typename: 'GqlPoolInvestOption';
                      poolTokenIndex: number;
                      poolTokenAddress: string;
                      tokenOptions: Array<{
                          __typename: 'GqlPoolToken';
                          id: string;
                          index: number;
                          name: string;
                          symbol: string;
                          balance: string;
                          address: string;
                          priceRate: string;
                          decimals: number;
                          weight?: string | null;
                          totalBalance: string;
                      }>;
                  }>;
              };
              withdrawConfig: {
                  __typename: 'GqlPoolWithdrawConfig';
                  singleAssetEnabled: boolean;
                  proportionalEnabled: boolean;
                  options: Array<{
                      __typename: 'GqlPoolWithdrawOption';
                      poolTokenIndex: number;
                      poolTokenAddress: string;
                      tokenOptions: Array<{
                          __typename: 'GqlPoolToken';
                          id: string;
                          index: number;
                          name: string;
                          symbol: string;
                          balance: string;
                          address: string;
                          priceRate: string;
                          decimals: number;
                          weight?: string | null;
                          totalBalance: string;
                      }>;
                  }>;
              };
          }
        | {
              __typename: 'GqlPoolFx';
              id: string;
              address: string;
              name: string;
              owner?: string | null;
              decimals: number;
              factory?: string | null;
              symbol: string;
              createTime: number;
              version: number;
              dynamicData: {
                  __typename: 'GqlPoolDynamicData';
                  poolId: string;
                  swapEnabled: boolean;
                  totalLiquidity: string;
                  totalLiquidity24hAgo: string;
                  totalShares: string;
                  totalShares24hAgo: string;
                  fees24h: string;
                  swapFee: string;
                  volume24h: string;
                  fees48h: string;
                  volume48h: string;
                  lifetimeVolume: string;
                  lifetimeSwapFees: string;
                  holdersCount: string;
                  swapsCount: string;
                  sharePriceAth: string;
                  sharePriceAthTimestamp: number;
                  sharePriceAtl: string;
                  sharePriceAtlTimestamp: number;
                  totalLiquidityAth: string;
                  totalLiquidityAthTimestamp: number;
                  totalLiquidityAtl: string;
                  totalLiquidityAtlTimestamp: number;
                  volume24hAth: string;
                  volume24hAthTimestamp: number;
                  volume24hAtl: string;
                  volume24hAtlTimestamp: number;
                  fees24hAth: string;
                  fees24hAthTimestamp: number;
                  fees24hAtl: string;
                  fees24hAtlTimestamp: number;
                  apr: {
                      __typename: 'GqlPoolApr';
                      hasRewardApr: boolean;
                      swapApr: string;
                      thirdPartyApr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      nativeRewardApr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      apr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      items: Array<{
                          __typename: 'GqlBalancePoolAprItem';
                          id: string;
                          title: string;
                          apr:
                              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                              | { __typename: 'GqlPoolAprTotal'; total: string };
                          subItems?: Array<{
                              __typename: 'GqlBalancePoolAprSubItem';
                              id: string;
                              title: string;
                              apr:
                                  | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                                  | { __typename: 'GqlPoolAprTotal'; total: string };
                          }> | null;
                      }>;
                  };
              };
              allTokens: Array<{
                  __typename: 'GqlPoolTokenExpanded';
                  id: string;
                  address: string;
                  name: string;
                  symbol: string;
                  decimals: number;
                  isNested: boolean;
                  isPhantomBpt: boolean;
              }>;
              displayTokens: Array<{
                  __typename: 'GqlPoolTokenDisplay';
                  id: string;
                  address: string;
                  name: string;
                  weight?: string | null;
                  symbol: string;
                  nestedTokens?: Array<{
                      __typename: 'GqlPoolTokenDisplay';
                      id: string;
                      address: string;
                      name: string;
                      weight?: string | null;
                      symbol: string;
                  }> | null;
              }>;
              staking?: {
                  __typename: 'GqlPoolStaking';
                  id: string;
                  type: GqlPoolStakingType;
                  address: string;
                  farm?: {
                      __typename: 'GqlPoolStakingMasterChefFarm';
                      id: string;
                      beetsPerBlock: string;
                      rewarders?: Array<{
                          __typename: 'GqlPoolStakingFarmRewarder';
                          id: string;
                          address: string;
                          tokenAddress: string;
                          rewardPerSecond: string;
                      }> | null;
                  } | null;
                  gauge?: {
                      __typename: 'GqlPoolStakingGauge';
                      id: string;
                      gaugeAddress: string;
                      version: number;
                      status: GqlPoolStakingGaugeStatus;
                      workingSupply: string;
                      otherGauges?: Array<{
                          __typename: 'GqlPoolStakingOtherGauge';
                          gaugeAddress: string;
                          version: number;
                          status: GqlPoolStakingGaugeStatus;
                          id: string;
                          rewards: Array<{
                              __typename: 'GqlPoolStakingGaugeReward';
                              id: string;
                              tokenAddress: string;
                              rewardPerSecond: string;
                          }>;
                      }> | null;
                      rewards: Array<{
                          __typename: 'GqlPoolStakingGaugeReward';
                          id: string;
                          rewardPerSecond: string;
                          tokenAddress: string;
                      }>;
                  } | null;
                  reliquary?: {
                      __typename: 'GqlPoolStakingReliquaryFarm';
                      beetsPerSecond: string;
                      totalBalance: string;
                      levels?: Array<{
                          __typename: 'GqlPoolStakingReliquaryFarmLevel';
                          level: number;
                          balance: string;
                          apr: string;
                          allocationPoints: number;
                      }> | null;
                  } | null;
              } | null;
              investConfig: {
                  __typename: 'GqlPoolInvestConfig';
                  singleAssetEnabled: boolean;
                  proportionalEnabled: boolean;
                  options: Array<{
                      __typename: 'GqlPoolInvestOption';
                      poolTokenIndex: number;
                      poolTokenAddress: string;
                      tokenOptions: Array<{
                          __typename: 'GqlPoolToken';
                          id: string;
                          index: number;
                          name: string;
                          symbol: string;
                          balance: string;
                          address: string;
                          priceRate: string;
                          decimals: number;
                          weight?: string | null;
                          totalBalance: string;
                      }>;
                  }>;
              };
              withdrawConfig: {
                  __typename: 'GqlPoolWithdrawConfig';
                  singleAssetEnabled: boolean;
                  proportionalEnabled: boolean;
                  options: Array<{
                      __typename: 'GqlPoolWithdrawOption';
                      poolTokenIndex: number;
                      poolTokenAddress: string;
                      tokenOptions: Array<{
                          __typename: 'GqlPoolToken';
                          id: string;
                          index: number;
                          name: string;
                          symbol: string;
                          balance: string;
                          address: string;
                          priceRate: string;
                          decimals: number;
                          weight?: string | null;
                          totalBalance: string;
                      }>;
                  }>;
              };
          }
        | {
              __typename: 'GqlPoolGyro';
              alpha: string;
              beta: string;
              type: GqlPoolType;
              nestingType: GqlPoolNestingType;
              id: string;
              address: string;
              name: string;
              owner: string;
              decimals: number;
              factory?: string | null;
              symbol: string;
              createTime: number;
              version: number;
              tokens: Array<
                  | {
                        __typename: 'GqlPoolToken';
                        id: string;
                        index: number;
                        name: string;
                        symbol: string;
                        balance: string;
                        address: string;
                        priceRate: string;
                        decimals: number;
                        weight?: string | null;
                        totalBalance: string;
                    }
                  | { __typename: 'GqlPoolTokenComposableStable' }
                  | { __typename: 'GqlPoolTokenLinear' }
              >;
              dynamicData: {
                  __typename: 'GqlPoolDynamicData';
                  poolId: string;
                  swapEnabled: boolean;
                  totalLiquidity: string;
                  totalLiquidity24hAgo: string;
                  totalShares: string;
                  totalShares24hAgo: string;
                  fees24h: string;
                  swapFee: string;
                  volume24h: string;
                  fees48h: string;
                  volume48h: string;
                  lifetimeVolume: string;
                  lifetimeSwapFees: string;
                  holdersCount: string;
                  swapsCount: string;
                  sharePriceAth: string;
                  sharePriceAthTimestamp: number;
                  sharePriceAtl: string;
                  sharePriceAtlTimestamp: number;
                  totalLiquidityAth: string;
                  totalLiquidityAthTimestamp: number;
                  totalLiquidityAtl: string;
                  totalLiquidityAtlTimestamp: number;
                  volume24hAth: string;
                  volume24hAthTimestamp: number;
                  volume24hAtl: string;
                  volume24hAtlTimestamp: number;
                  fees24hAth: string;
                  fees24hAthTimestamp: number;
                  fees24hAtl: string;
                  fees24hAtlTimestamp: number;
                  apr: {
                      __typename: 'GqlPoolApr';
                      hasRewardApr: boolean;
                      swapApr: string;
                      thirdPartyApr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      nativeRewardApr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      apr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      items: Array<{
                          __typename: 'GqlBalancePoolAprItem';
                          id: string;
                          title: string;
                          apr:
                              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                              | { __typename: 'GqlPoolAprTotal'; total: string };
                          subItems?: Array<{
                              __typename: 'GqlBalancePoolAprSubItem';
                              id: string;
                              title: string;
                              apr:
                                  | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                                  | { __typename: 'GqlPoolAprTotal'; total: string };
                          }> | null;
                      }>;
                  };
              };
              allTokens: Array<{
                  __typename: 'GqlPoolTokenExpanded';
                  id: string;
                  address: string;
                  name: string;
                  symbol: string;
                  decimals: number;
                  isNested: boolean;
                  isPhantomBpt: boolean;
              }>;
              displayTokens: Array<{
                  __typename: 'GqlPoolTokenDisplay';
                  id: string;
                  address: string;
                  name: string;
                  weight?: string | null;
                  symbol: string;
                  nestedTokens?: Array<{
                      __typename: 'GqlPoolTokenDisplay';
                      id: string;
                      address: string;
                      name: string;
                      weight?: string | null;
                      symbol: string;
                  }> | null;
              }>;
              staking?: {
                  __typename: 'GqlPoolStaking';
                  id: string;
                  type: GqlPoolStakingType;
                  address: string;
                  farm?: {
                      __typename: 'GqlPoolStakingMasterChefFarm';
                      id: string;
                      beetsPerBlock: string;
                      rewarders?: Array<{
                          __typename: 'GqlPoolStakingFarmRewarder';
                          id: string;
                          address: string;
                          tokenAddress: string;
                          rewardPerSecond: string;
                      }> | null;
                  } | null;
                  gauge?: {
                      __typename: 'GqlPoolStakingGauge';
                      id: string;
                      gaugeAddress: string;
                      version: number;
                      status: GqlPoolStakingGaugeStatus;
                      workingSupply: string;
                      otherGauges?: Array<{
                          __typename: 'GqlPoolStakingOtherGauge';
                          gaugeAddress: string;
                          version: number;
                          status: GqlPoolStakingGaugeStatus;
                          id: string;
                          rewards: Array<{
                              __typename: 'GqlPoolStakingGaugeReward';
                              id: string;
                              tokenAddress: string;
                              rewardPerSecond: string;
                          }>;
                      }> | null;
                      rewards: Array<{
                          __typename: 'GqlPoolStakingGaugeReward';
                          id: string;
                          rewardPerSecond: string;
                          tokenAddress: string;
                      }>;
                  } | null;
                  reliquary?: {
                      __typename: 'GqlPoolStakingReliquaryFarm';
                      beetsPerSecond: string;
                      totalBalance: string;
                      levels?: Array<{
                          __typename: 'GqlPoolStakingReliquaryFarmLevel';
                          level: number;
                          balance: string;
                          apr: string;
                          allocationPoints: number;
                      }> | null;
                  } | null;
              } | null;
              investConfig: {
                  __typename: 'GqlPoolInvestConfig';
                  singleAssetEnabled: boolean;
                  proportionalEnabled: boolean;
                  options: Array<{
                      __typename: 'GqlPoolInvestOption';
                      poolTokenIndex: number;
                      poolTokenAddress: string;
                      tokenOptions: Array<{
                          __typename: 'GqlPoolToken';
                          id: string;
                          index: number;
                          name: string;
                          symbol: string;
                          balance: string;
                          address: string;
                          priceRate: string;
                          decimals: number;
                          weight?: string | null;
                          totalBalance: string;
                      }>;
                  }>;
              };
              withdrawConfig: {
                  __typename: 'GqlPoolWithdrawConfig';
                  singleAssetEnabled: boolean;
                  proportionalEnabled: boolean;
                  options: Array<{
                      __typename: 'GqlPoolWithdrawOption';
                      poolTokenIndex: number;
                      poolTokenAddress: string;
                      tokenOptions: Array<{
                          __typename: 'GqlPoolToken';
                          id: string;
                          index: number;
                          name: string;
                          symbol: string;
                          balance: string;
                          address: string;
                          priceRate: string;
                          decimals: number;
                          weight?: string | null;
                          totalBalance: string;
                      }>;
                  }>;
              };
          }
        | {
              __typename: 'GqlPoolLinear';
              mainIndex: number;
              wrappedIndex: number;
              lowerTarget: string;
              upperTarget: string;
              id: string;
              address: string;
              name: string;
              owner: string;
              decimals: number;
              factory?: string | null;
              symbol: string;
              createTime: number;
              version: number;
              tokens: Array<{
                  __typename: 'GqlPoolToken';
                  id: string;
                  index: number;
                  name: string;
                  symbol: string;
                  balance: string;
                  address: string;
                  priceRate: string;
                  decimals: number;
                  weight?: string | null;
                  totalBalance: string;
              }>;
              dynamicData: {
                  __typename: 'GqlPoolDynamicData';
                  poolId: string;
                  swapEnabled: boolean;
                  totalLiquidity: string;
                  totalLiquidity24hAgo: string;
                  totalShares: string;
                  totalShares24hAgo: string;
                  fees24h: string;
                  swapFee: string;
                  volume24h: string;
                  fees48h: string;
                  volume48h: string;
                  lifetimeVolume: string;
                  lifetimeSwapFees: string;
                  holdersCount: string;
                  swapsCount: string;
                  sharePriceAth: string;
                  sharePriceAthTimestamp: number;
                  sharePriceAtl: string;
                  sharePriceAtlTimestamp: number;
                  totalLiquidityAth: string;
                  totalLiquidityAthTimestamp: number;
                  totalLiquidityAtl: string;
                  totalLiquidityAtlTimestamp: number;
                  volume24hAth: string;
                  volume24hAthTimestamp: number;
                  volume24hAtl: string;
                  volume24hAtlTimestamp: number;
                  fees24hAth: string;
                  fees24hAthTimestamp: number;
                  fees24hAtl: string;
                  fees24hAtlTimestamp: number;
                  apr: {
                      __typename: 'GqlPoolApr';
                      hasRewardApr: boolean;
                      swapApr: string;
                      thirdPartyApr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      nativeRewardApr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      apr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      items: Array<{
                          __typename: 'GqlBalancePoolAprItem';
                          id: string;
                          title: string;
                          apr:
                              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                              | { __typename: 'GqlPoolAprTotal'; total: string };
                          subItems?: Array<{
                              __typename: 'GqlBalancePoolAprSubItem';
                              id: string;
                              title: string;
                              apr:
                                  | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                                  | { __typename: 'GqlPoolAprTotal'; total: string };
                          }> | null;
                      }>;
                  };
              };
              allTokens: Array<{
                  __typename: 'GqlPoolTokenExpanded';
                  id: string;
                  address: string;
                  name: string;
                  symbol: string;
                  decimals: number;
                  isNested: boolean;
                  isPhantomBpt: boolean;
              }>;
              displayTokens: Array<{
                  __typename: 'GqlPoolTokenDisplay';
                  id: string;
                  address: string;
                  name: string;
                  weight?: string | null;
                  symbol: string;
                  nestedTokens?: Array<{
                      __typename: 'GqlPoolTokenDisplay';
                      id: string;
                      address: string;
                      name: string;
                      weight?: string | null;
                      symbol: string;
                  }> | null;
              }>;
              staking?: {
                  __typename: 'GqlPoolStaking';
                  id: string;
                  type: GqlPoolStakingType;
                  address: string;
                  farm?: {
                      __typename: 'GqlPoolStakingMasterChefFarm';
                      id: string;
                      beetsPerBlock: string;
                      rewarders?: Array<{
                          __typename: 'GqlPoolStakingFarmRewarder';
                          id: string;
                          address: string;
                          tokenAddress: string;
                          rewardPerSecond: string;
                      }> | null;
                  } | null;
                  gauge?: {
                      __typename: 'GqlPoolStakingGauge';
                      id: string;
                      gaugeAddress: string;
                      version: number;
                      status: GqlPoolStakingGaugeStatus;
                      workingSupply: string;
                      otherGauges?: Array<{
                          __typename: 'GqlPoolStakingOtherGauge';
                          gaugeAddress: string;
                          version: number;
                          status: GqlPoolStakingGaugeStatus;
                          id: string;
                          rewards: Array<{
                              __typename: 'GqlPoolStakingGaugeReward';
                              id: string;
                              tokenAddress: string;
                              rewardPerSecond: string;
                          }>;
                      }> | null;
                      rewards: Array<{
                          __typename: 'GqlPoolStakingGaugeReward';
                          id: string;
                          rewardPerSecond: string;
                          tokenAddress: string;
                      }>;
                  } | null;
                  reliquary?: {
                      __typename: 'GqlPoolStakingReliquaryFarm';
                      beetsPerSecond: string;
                      totalBalance: string;
                      levels?: Array<{
                          __typename: 'GqlPoolStakingReliquaryFarmLevel';
                          level: number;
                          balance: string;
                          apr: string;
                          allocationPoints: number;
                      }> | null;
                  } | null;
              } | null;
              investConfig: {
                  __typename: 'GqlPoolInvestConfig';
                  singleAssetEnabled: boolean;
                  proportionalEnabled: boolean;
                  options: Array<{
                      __typename: 'GqlPoolInvestOption';
                      poolTokenIndex: number;
                      poolTokenAddress: string;
                      tokenOptions: Array<{
                          __typename: 'GqlPoolToken';
                          id: string;
                          index: number;
                          name: string;
                          symbol: string;
                          balance: string;
                          address: string;
                          priceRate: string;
                          decimals: number;
                          weight?: string | null;
                          totalBalance: string;
                      }>;
                  }>;
              };
              withdrawConfig: {
                  __typename: 'GqlPoolWithdrawConfig';
                  singleAssetEnabled: boolean;
                  proportionalEnabled: boolean;
                  options: Array<{
                      __typename: 'GqlPoolWithdrawOption';
                      poolTokenIndex: number;
                      poolTokenAddress: string;
                      tokenOptions: Array<{
                          __typename: 'GqlPoolToken';
                          id: string;
                          index: number;
                          name: string;
                          symbol: string;
                          balance: string;
                          address: string;
                          priceRate: string;
                          decimals: number;
                          weight?: string | null;
                          totalBalance: string;
                      }>;
                  }>;
              };
          }
        | {
              __typename: 'GqlPoolLiquidityBootstrapping';
              name: string;
              nestingType: GqlPoolNestingType;
              id: string;
              address: string;
              owner: string;
              decimals: number;
              factory?: string | null;
              symbol: string;
              createTime: number;
              version: number;
              tokens: Array<
                  | {
                        __typename: 'GqlPoolToken';
                        id: string;
                        index: number;
                        name: string;
                        symbol: string;
                        balance: string;
                        address: string;
                        priceRate: string;
                        decimals: number;
                        weight?: string | null;
                        totalBalance: string;
                    }
                  | {
                        __typename: 'GqlPoolTokenComposableStable';
                        id: string;
                        index: number;
                        name: string;
                        symbol: string;
                        balance: string;
                        address: string;
                        weight?: string | null;
                        priceRate: string;
                        decimals: number;
                        totalBalance: string;
                        pool: {
                            __typename: 'GqlPoolComposableStableNested';
                            id: string;
                            name: string;
                            symbol: string;
                            address: string;
                            owner: string;
                            factory?: string | null;
                            createTime: number;
                            totalShares: string;
                            totalLiquidity: string;
                            nestingType: GqlPoolNestingType;
                            swapFee: string;
                            amp: string;
                            tokens: Array<
                                | {
                                      __typename: 'GqlPoolToken';
                                      id: string;
                                      index: number;
                                      name: string;
                                      symbol: string;
                                      balance: string;
                                      address: string;
                                      priceRate: string;
                                      decimals: number;
                                      weight?: string | null;
                                      totalBalance: string;
                                  }
                                | {
                                      __typename: 'GqlPoolTokenLinear';
                                      id: string;
                                      index: number;
                                      name: string;
                                      symbol: string;
                                      balance: string;
                                      address: string;
                                      priceRate: string;
                                      decimals: number;
                                      weight?: string | null;
                                      mainTokenBalance: string;
                                      wrappedTokenBalance: string;
                                      totalMainTokenBalance: string;
                                      totalBalance: string;
                                      pool: {
                                          __typename: 'GqlPoolLinearNested';
                                          id: string;
                                          name: string;
                                          symbol: string;
                                          address: string;
                                          owner: string;
                                          factory?: string | null;
                                          createTime: number;
                                          wrappedIndex: number;
                                          mainIndex: number;
                                          upperTarget: string;
                                          lowerTarget: string;
                                          totalShares: string;
                                          totalLiquidity: string;
                                          bptPriceRate: string;
                                          tokens: Array<{
                                              __typename: 'GqlPoolToken';
                                              id: string;
                                              index: number;
                                              name: string;
                                              symbol: string;
                                              balance: string;
                                              address: string;
                                              priceRate: string;
                                              decimals: number;
                                              weight?: string | null;
                                              totalBalance: string;
                                          }>;
                                      };
                                  }
                            >;
                        };
                    }
                  | {
                        __typename: 'GqlPoolTokenLinear';
                        id: string;
                        index: number;
                        name: string;
                        symbol: string;
                        balance: string;
                        address: string;
                        priceRate: string;
                        decimals: number;
                        weight?: string | null;
                        mainTokenBalance: string;
                        wrappedTokenBalance: string;
                        totalMainTokenBalance: string;
                        totalBalance: string;
                        pool: {
                            __typename: 'GqlPoolLinearNested';
                            id: string;
                            name: string;
                            symbol: string;
                            address: string;
                            owner: string;
                            factory?: string | null;
                            createTime: number;
                            wrappedIndex: number;
                            mainIndex: number;
                            upperTarget: string;
                            lowerTarget: string;
                            totalShares: string;
                            totalLiquidity: string;
                            bptPriceRate: string;
                            tokens: Array<{
                                __typename: 'GqlPoolToken';
                                id: string;
                                index: number;
                                name: string;
                                symbol: string;
                                balance: string;
                                address: string;
                                priceRate: string;
                                decimals: number;
                                weight?: string | null;
                                totalBalance: string;
                            }>;
                        };
                    }
              >;
              dynamicData: {
                  __typename: 'GqlPoolDynamicData';
                  poolId: string;
                  swapEnabled: boolean;
                  totalLiquidity: string;
                  totalLiquidity24hAgo: string;
                  totalShares: string;
                  totalShares24hAgo: string;
                  fees24h: string;
                  swapFee: string;
                  volume24h: string;
                  fees48h: string;
                  volume48h: string;
                  lifetimeVolume: string;
                  lifetimeSwapFees: string;
                  holdersCount: string;
                  swapsCount: string;
                  sharePriceAth: string;
                  sharePriceAthTimestamp: number;
                  sharePriceAtl: string;
                  sharePriceAtlTimestamp: number;
                  totalLiquidityAth: string;
                  totalLiquidityAthTimestamp: number;
                  totalLiquidityAtl: string;
                  totalLiquidityAtlTimestamp: number;
                  volume24hAth: string;
                  volume24hAthTimestamp: number;
                  volume24hAtl: string;
                  volume24hAtlTimestamp: number;
                  fees24hAth: string;
                  fees24hAthTimestamp: number;
                  fees24hAtl: string;
                  fees24hAtlTimestamp: number;
                  apr: {
                      __typename: 'GqlPoolApr';
                      hasRewardApr: boolean;
                      swapApr: string;
                      thirdPartyApr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      nativeRewardApr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      apr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      items: Array<{
                          __typename: 'GqlBalancePoolAprItem';
                          id: string;
                          title: string;
                          apr:
                              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                              | { __typename: 'GqlPoolAprTotal'; total: string };
                          subItems?: Array<{
                              __typename: 'GqlBalancePoolAprSubItem';
                              id: string;
                              title: string;
                              apr:
                                  | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                                  | { __typename: 'GqlPoolAprTotal'; total: string };
                          }> | null;
                      }>;
                  };
              };
              allTokens: Array<{
                  __typename: 'GqlPoolTokenExpanded';
                  id: string;
                  address: string;
                  name: string;
                  symbol: string;
                  decimals: number;
                  isNested: boolean;
                  isPhantomBpt: boolean;
              }>;
              displayTokens: Array<{
                  __typename: 'GqlPoolTokenDisplay';
                  id: string;
                  address: string;
                  name: string;
                  weight?: string | null;
                  symbol: string;
                  nestedTokens?: Array<{
                      __typename: 'GqlPoolTokenDisplay';
                      id: string;
                      address: string;
                      name: string;
                      weight?: string | null;
                      symbol: string;
                  }> | null;
              }>;
              staking?: {
                  __typename: 'GqlPoolStaking';
                  id: string;
                  type: GqlPoolStakingType;
                  address: string;
                  farm?: {
                      __typename: 'GqlPoolStakingMasterChefFarm';
                      id: string;
                      beetsPerBlock: string;
                      rewarders?: Array<{
                          __typename: 'GqlPoolStakingFarmRewarder';
                          id: string;
                          address: string;
                          tokenAddress: string;
                          rewardPerSecond: string;
                      }> | null;
                  } | null;
                  gauge?: {
                      __typename: 'GqlPoolStakingGauge';
                      id: string;
                      gaugeAddress: string;
                      version: number;
                      status: GqlPoolStakingGaugeStatus;
                      workingSupply: string;
                      otherGauges?: Array<{
                          __typename: 'GqlPoolStakingOtherGauge';
                          gaugeAddress: string;
                          version: number;
                          status: GqlPoolStakingGaugeStatus;
                          id: string;
                          rewards: Array<{
                              __typename: 'GqlPoolStakingGaugeReward';
                              id: string;
                              tokenAddress: string;
                              rewardPerSecond: string;
                          }>;
                      }> | null;
                      rewards: Array<{
                          __typename: 'GqlPoolStakingGaugeReward';
                          id: string;
                          rewardPerSecond: string;
                          tokenAddress: string;
                      }>;
                  } | null;
                  reliquary?: {
                      __typename: 'GqlPoolStakingReliquaryFarm';
                      beetsPerSecond: string;
                      totalBalance: string;
                      levels?: Array<{
                          __typename: 'GqlPoolStakingReliquaryFarmLevel';
                          level: number;
                          balance: string;
                          apr: string;
                          allocationPoints: number;
                      }> | null;
                  } | null;
              } | null;
              investConfig: {
                  __typename: 'GqlPoolInvestConfig';
                  singleAssetEnabled: boolean;
                  proportionalEnabled: boolean;
                  options: Array<{
                      __typename: 'GqlPoolInvestOption';
                      poolTokenIndex: number;
                      poolTokenAddress: string;
                      tokenOptions: Array<{
                          __typename: 'GqlPoolToken';
                          id: string;
                          index: number;
                          name: string;
                          symbol: string;
                          balance: string;
                          address: string;
                          priceRate: string;
                          decimals: number;
                          weight?: string | null;
                          totalBalance: string;
                      }>;
                  }>;
              };
              withdrawConfig: {
                  __typename: 'GqlPoolWithdrawConfig';
                  singleAssetEnabled: boolean;
                  proportionalEnabled: boolean;
                  options: Array<{
                      __typename: 'GqlPoolWithdrawOption';
                      poolTokenIndex: number;
                      poolTokenAddress: string;
                      tokenOptions: Array<{
                          __typename: 'GqlPoolToken';
                          id: string;
                          index: number;
                          name: string;
                          symbol: string;
                          balance: string;
                          address: string;
                          priceRate: string;
                          decimals: number;
                          weight?: string | null;
                          totalBalance: string;
                      }>;
                  }>;
              };
          }
        | {
              __typename: 'GqlPoolMetaStable';
              amp: string;
              id: string;
              address: string;
              name: string;
              owner: string;
              decimals: number;
              factory?: string | null;
              symbol: string;
              createTime: number;
              version: number;
              tokens: Array<{
                  __typename: 'GqlPoolToken';
                  id: string;
                  index: number;
                  name: string;
                  symbol: string;
                  balance: string;
                  address: string;
                  priceRate: string;
                  decimals: number;
                  weight?: string | null;
                  totalBalance: string;
              }>;
              dynamicData: {
                  __typename: 'GqlPoolDynamicData';
                  poolId: string;
                  swapEnabled: boolean;
                  totalLiquidity: string;
                  totalLiquidity24hAgo: string;
                  totalShares: string;
                  totalShares24hAgo: string;
                  fees24h: string;
                  swapFee: string;
                  volume24h: string;
                  fees48h: string;
                  volume48h: string;
                  lifetimeVolume: string;
                  lifetimeSwapFees: string;
                  holdersCount: string;
                  swapsCount: string;
                  sharePriceAth: string;
                  sharePriceAthTimestamp: number;
                  sharePriceAtl: string;
                  sharePriceAtlTimestamp: number;
                  totalLiquidityAth: string;
                  totalLiquidityAthTimestamp: number;
                  totalLiquidityAtl: string;
                  totalLiquidityAtlTimestamp: number;
                  volume24hAth: string;
                  volume24hAthTimestamp: number;
                  volume24hAtl: string;
                  volume24hAtlTimestamp: number;
                  fees24hAth: string;
                  fees24hAthTimestamp: number;
                  fees24hAtl: string;
                  fees24hAtlTimestamp: number;
                  apr: {
                      __typename: 'GqlPoolApr';
                      hasRewardApr: boolean;
                      swapApr: string;
                      thirdPartyApr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      nativeRewardApr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      apr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      items: Array<{
                          __typename: 'GqlBalancePoolAprItem';
                          id: string;
                          title: string;
                          apr:
                              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                              | { __typename: 'GqlPoolAprTotal'; total: string };
                          subItems?: Array<{
                              __typename: 'GqlBalancePoolAprSubItem';
                              id: string;
                              title: string;
                              apr:
                                  | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                                  | { __typename: 'GqlPoolAprTotal'; total: string };
                          }> | null;
                      }>;
                  };
              };
              allTokens: Array<{
                  __typename: 'GqlPoolTokenExpanded';
                  id: string;
                  address: string;
                  name: string;
                  symbol: string;
                  decimals: number;
                  isNested: boolean;
                  isPhantomBpt: boolean;
              }>;
              displayTokens: Array<{
                  __typename: 'GqlPoolTokenDisplay';
                  id: string;
                  address: string;
                  name: string;
                  weight?: string | null;
                  symbol: string;
                  nestedTokens?: Array<{
                      __typename: 'GqlPoolTokenDisplay';
                      id: string;
                      address: string;
                      name: string;
                      weight?: string | null;
                      symbol: string;
                  }> | null;
              }>;
              staking?: {
                  __typename: 'GqlPoolStaking';
                  id: string;
                  type: GqlPoolStakingType;
                  address: string;
                  farm?: {
                      __typename: 'GqlPoolStakingMasterChefFarm';
                      id: string;
                      beetsPerBlock: string;
                      rewarders?: Array<{
                          __typename: 'GqlPoolStakingFarmRewarder';
                          id: string;
                          address: string;
                          tokenAddress: string;
                          rewardPerSecond: string;
                      }> | null;
                  } | null;
                  gauge?: {
                      __typename: 'GqlPoolStakingGauge';
                      id: string;
                      gaugeAddress: string;
                      version: number;
                      status: GqlPoolStakingGaugeStatus;
                      workingSupply: string;
                      otherGauges?: Array<{
                          __typename: 'GqlPoolStakingOtherGauge';
                          gaugeAddress: string;
                          version: number;
                          status: GqlPoolStakingGaugeStatus;
                          id: string;
                          rewards: Array<{
                              __typename: 'GqlPoolStakingGaugeReward';
                              id: string;
                              tokenAddress: string;
                              rewardPerSecond: string;
                          }>;
                      }> | null;
                      rewards: Array<{
                          __typename: 'GqlPoolStakingGaugeReward';
                          id: string;
                          rewardPerSecond: string;
                          tokenAddress: string;
                      }>;
                  } | null;
                  reliquary?: {
                      __typename: 'GqlPoolStakingReliquaryFarm';
                      beetsPerSecond: string;
                      totalBalance: string;
                      levels?: Array<{
                          __typename: 'GqlPoolStakingReliquaryFarmLevel';
                          level: number;
                          balance: string;
                          apr: string;
                          allocationPoints: number;
                      }> | null;
                  } | null;
              } | null;
              investConfig: {
                  __typename: 'GqlPoolInvestConfig';
                  singleAssetEnabled: boolean;
                  proportionalEnabled: boolean;
                  options: Array<{
                      __typename: 'GqlPoolInvestOption';
                      poolTokenIndex: number;
                      poolTokenAddress: string;
                      tokenOptions: Array<{
                          __typename: 'GqlPoolToken';
                          id: string;
                          index: number;
                          name: string;
                          symbol: string;
                          balance: string;
                          address: string;
                          priceRate: string;
                          decimals: number;
                          weight?: string | null;
                          totalBalance: string;
                      }>;
                  }>;
              };
              withdrawConfig: {
                  __typename: 'GqlPoolWithdrawConfig';
                  singleAssetEnabled: boolean;
                  proportionalEnabled: boolean;
                  options: Array<{
                      __typename: 'GqlPoolWithdrawOption';
                      poolTokenIndex: number;
                      poolTokenAddress: string;
                      tokenOptions: Array<{
                          __typename: 'GqlPoolToken';
                          id: string;
                          index: number;
                          name: string;
                          symbol: string;
                          balance: string;
                          address: string;
                          priceRate: string;
                          decimals: number;
                          weight?: string | null;
                          totalBalance: string;
                      }>;
                  }>;
              };
          }
        | {
              __typename: 'GqlPoolStable';
              amp: string;
              id: string;
              address: string;
              name: string;
              owner: string;
              decimals: number;
              factory?: string | null;
              symbol: string;
              createTime: number;
              version: number;
              tokens: Array<{
                  __typename: 'GqlPoolToken';
                  id: string;
                  index: number;
                  name: string;
                  symbol: string;
                  balance: string;
                  address: string;
                  priceRate: string;
                  decimals: number;
                  weight?: string | null;
                  totalBalance: string;
              }>;
              dynamicData: {
                  __typename: 'GqlPoolDynamicData';
                  poolId: string;
                  swapEnabled: boolean;
                  totalLiquidity: string;
                  totalLiquidity24hAgo: string;
                  totalShares: string;
                  totalShares24hAgo: string;
                  fees24h: string;
                  swapFee: string;
                  volume24h: string;
                  fees48h: string;
                  volume48h: string;
                  lifetimeVolume: string;
                  lifetimeSwapFees: string;
                  holdersCount: string;
                  swapsCount: string;
                  sharePriceAth: string;
                  sharePriceAthTimestamp: number;
                  sharePriceAtl: string;
                  sharePriceAtlTimestamp: number;
                  totalLiquidityAth: string;
                  totalLiquidityAthTimestamp: number;
                  totalLiquidityAtl: string;
                  totalLiquidityAtlTimestamp: number;
                  volume24hAth: string;
                  volume24hAthTimestamp: number;
                  volume24hAtl: string;
                  volume24hAtlTimestamp: number;
                  fees24hAth: string;
                  fees24hAthTimestamp: number;
                  fees24hAtl: string;
                  fees24hAtlTimestamp: number;
                  apr: {
                      __typename: 'GqlPoolApr';
                      hasRewardApr: boolean;
                      swapApr: string;
                      thirdPartyApr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      nativeRewardApr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      apr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      items: Array<{
                          __typename: 'GqlBalancePoolAprItem';
                          id: string;
                          title: string;
                          apr:
                              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                              | { __typename: 'GqlPoolAprTotal'; total: string };
                          subItems?: Array<{
                              __typename: 'GqlBalancePoolAprSubItem';
                              id: string;
                              title: string;
                              apr:
                                  | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                                  | { __typename: 'GqlPoolAprTotal'; total: string };
                          }> | null;
                      }>;
                  };
              };
              allTokens: Array<{
                  __typename: 'GqlPoolTokenExpanded';
                  id: string;
                  address: string;
                  name: string;
                  symbol: string;
                  decimals: number;
                  isNested: boolean;
                  isPhantomBpt: boolean;
              }>;
              displayTokens: Array<{
                  __typename: 'GqlPoolTokenDisplay';
                  id: string;
                  address: string;
                  name: string;
                  weight?: string | null;
                  symbol: string;
                  nestedTokens?: Array<{
                      __typename: 'GqlPoolTokenDisplay';
                      id: string;
                      address: string;
                      name: string;
                      weight?: string | null;
                      symbol: string;
                  }> | null;
              }>;
              staking?: {
                  __typename: 'GqlPoolStaking';
                  id: string;
                  type: GqlPoolStakingType;
                  address: string;
                  farm?: {
                      __typename: 'GqlPoolStakingMasterChefFarm';
                      id: string;
                      beetsPerBlock: string;
                      rewarders?: Array<{
                          __typename: 'GqlPoolStakingFarmRewarder';
                          id: string;
                          address: string;
                          tokenAddress: string;
                          rewardPerSecond: string;
                      }> | null;
                  } | null;
                  gauge?: {
                      __typename: 'GqlPoolStakingGauge';
                      id: string;
                      gaugeAddress: string;
                      version: number;
                      status: GqlPoolStakingGaugeStatus;
                      workingSupply: string;
                      otherGauges?: Array<{
                          __typename: 'GqlPoolStakingOtherGauge';
                          gaugeAddress: string;
                          version: number;
                          status: GqlPoolStakingGaugeStatus;
                          id: string;
                          rewards: Array<{
                              __typename: 'GqlPoolStakingGaugeReward';
                              id: string;
                              tokenAddress: string;
                              rewardPerSecond: string;
                          }>;
                      }> | null;
                      rewards: Array<{
                          __typename: 'GqlPoolStakingGaugeReward';
                          id: string;
                          rewardPerSecond: string;
                          tokenAddress: string;
                      }>;
                  } | null;
                  reliquary?: {
                      __typename: 'GqlPoolStakingReliquaryFarm';
                      beetsPerSecond: string;
                      totalBalance: string;
                      levels?: Array<{
                          __typename: 'GqlPoolStakingReliquaryFarmLevel';
                          level: number;
                          balance: string;
                          apr: string;
                          allocationPoints: number;
                      }> | null;
                  } | null;
              } | null;
              investConfig: {
                  __typename: 'GqlPoolInvestConfig';
                  singleAssetEnabled: boolean;
                  proportionalEnabled: boolean;
                  options: Array<{
                      __typename: 'GqlPoolInvestOption';
                      poolTokenIndex: number;
                      poolTokenAddress: string;
                      tokenOptions: Array<{
                          __typename: 'GqlPoolToken';
                          id: string;
                          index: number;
                          name: string;
                          symbol: string;
                          balance: string;
                          address: string;
                          priceRate: string;
                          decimals: number;
                          weight?: string | null;
                          totalBalance: string;
                      }>;
                  }>;
              };
              withdrawConfig: {
                  __typename: 'GqlPoolWithdrawConfig';
                  singleAssetEnabled: boolean;
                  proportionalEnabled: boolean;
                  options: Array<{
                      __typename: 'GqlPoolWithdrawOption';
                      poolTokenIndex: number;
                      poolTokenAddress: string;
                      tokenOptions: Array<{
                          __typename: 'GqlPoolToken';
                          id: string;
                          index: number;
                          name: string;
                          symbol: string;
                          balance: string;
                          address: string;
                          priceRate: string;
                          decimals: number;
                          weight?: string | null;
                          totalBalance: string;
                      }>;
                  }>;
              };
          }
        | {
              __typename: 'GqlPoolWeighted';
              nestingType: GqlPoolNestingType;
              id: string;
              address: string;
              name: string;
              owner: string;
              decimals: number;
              factory?: string | null;
              symbol: string;
              createTime: number;
              version: number;
              tokens: Array<
                  | {
                        __typename: 'GqlPoolToken';
                        id: string;
                        index: number;
                        name: string;
                        symbol: string;
                        balance: string;
                        address: string;
                        priceRate: string;
                        decimals: number;
                        weight?: string | null;
                        totalBalance: string;
                    }
                  | {
                        __typename: 'GqlPoolTokenComposableStable';
                        id: string;
                        index: number;
                        name: string;
                        symbol: string;
                        balance: string;
                        address: string;
                        weight?: string | null;
                        priceRate: string;
                        decimals: number;
                        totalBalance: string;
                        pool: {
                            __typename: 'GqlPoolComposableStableNested';
                            id: string;
                            name: string;
                            symbol: string;
                            address: string;
                            owner: string;
                            factory?: string | null;
                            createTime: number;
                            totalShares: string;
                            totalLiquidity: string;
                            nestingType: GqlPoolNestingType;
                            swapFee: string;
                            amp: string;
                            tokens: Array<
                                | {
                                      __typename: 'GqlPoolToken';
                                      id: string;
                                      index: number;
                                      name: string;
                                      symbol: string;
                                      balance: string;
                                      address: string;
                                      priceRate: string;
                                      decimals: number;
                                      weight?: string | null;
                                      totalBalance: string;
                                  }
                                | {
                                      __typename: 'GqlPoolTokenLinear';
                                      id: string;
                                      index: number;
                                      name: string;
                                      symbol: string;
                                      balance: string;
                                      address: string;
                                      priceRate: string;
                                      decimals: number;
                                      weight?: string | null;
                                      mainTokenBalance: string;
                                      wrappedTokenBalance: string;
                                      totalMainTokenBalance: string;
                                      totalBalance: string;
                                      pool: {
                                          __typename: 'GqlPoolLinearNested';
                                          id: string;
                                          name: string;
                                          symbol: string;
                                          address: string;
                                          owner: string;
                                          factory?: string | null;
                                          createTime: number;
                                          wrappedIndex: number;
                                          mainIndex: number;
                                          upperTarget: string;
                                          lowerTarget: string;
                                          totalShares: string;
                                          totalLiquidity: string;
                                          bptPriceRate: string;
                                          tokens: Array<{
                                              __typename: 'GqlPoolToken';
                                              id: string;
                                              index: number;
                                              name: string;
                                              symbol: string;
                                              balance: string;
                                              address: string;
                                              priceRate: string;
                                              decimals: number;
                                              weight?: string | null;
                                              totalBalance: string;
                                          }>;
                                      };
                                  }
                            >;
                        };
                    }
                  | {
                        __typename: 'GqlPoolTokenLinear';
                        id: string;
                        index: number;
                        name: string;
                        symbol: string;
                        balance: string;
                        address: string;
                        priceRate: string;
                        decimals: number;
                        weight?: string | null;
                        mainTokenBalance: string;
                        wrappedTokenBalance: string;
                        totalMainTokenBalance: string;
                        totalBalance: string;
                        pool: {
                            __typename: 'GqlPoolLinearNested';
                            id: string;
                            name: string;
                            symbol: string;
                            address: string;
                            owner: string;
                            factory?: string | null;
                            createTime: number;
                            wrappedIndex: number;
                            mainIndex: number;
                            upperTarget: string;
                            lowerTarget: string;
                            totalShares: string;
                            totalLiquidity: string;
                            bptPriceRate: string;
                            tokens: Array<{
                                __typename: 'GqlPoolToken';
                                id: string;
                                index: number;
                                name: string;
                                symbol: string;
                                balance: string;
                                address: string;
                                priceRate: string;
                                decimals: number;
                                weight?: string | null;
                                totalBalance: string;
                            }>;
                        };
                    }
              >;
              dynamicData: {
                  __typename: 'GqlPoolDynamicData';
                  poolId: string;
                  swapEnabled: boolean;
                  totalLiquidity: string;
                  totalLiquidity24hAgo: string;
                  totalShares: string;
                  totalShares24hAgo: string;
                  fees24h: string;
                  swapFee: string;
                  volume24h: string;
                  fees48h: string;
                  volume48h: string;
                  lifetimeVolume: string;
                  lifetimeSwapFees: string;
                  holdersCount: string;
                  swapsCount: string;
                  sharePriceAth: string;
                  sharePriceAthTimestamp: number;
                  sharePriceAtl: string;
                  sharePriceAtlTimestamp: number;
                  totalLiquidityAth: string;
                  totalLiquidityAthTimestamp: number;
                  totalLiquidityAtl: string;
                  totalLiquidityAtlTimestamp: number;
                  volume24hAth: string;
                  volume24hAthTimestamp: number;
                  volume24hAtl: string;
                  volume24hAtlTimestamp: number;
                  fees24hAth: string;
                  fees24hAthTimestamp: number;
                  fees24hAtl: string;
                  fees24hAtlTimestamp: number;
                  apr: {
                      __typename: 'GqlPoolApr';
                      hasRewardApr: boolean;
                      swapApr: string;
                      thirdPartyApr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      nativeRewardApr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      apr:
                          | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                          | { __typename: 'GqlPoolAprTotal'; total: string };
                      items: Array<{
                          __typename: 'GqlBalancePoolAprItem';
                          id: string;
                          title: string;
                          apr:
                              | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                              | { __typename: 'GqlPoolAprTotal'; total: string };
                          subItems?: Array<{
                              __typename: 'GqlBalancePoolAprSubItem';
                              id: string;
                              title: string;
                              apr:
                                  | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                                  | { __typename: 'GqlPoolAprTotal'; total: string };
                          }> | null;
                      }>;
                  };
              };
              allTokens: Array<{
                  __typename: 'GqlPoolTokenExpanded';
                  id: string;
                  address: string;
                  name: string;
                  symbol: string;
                  decimals: number;
                  isNested: boolean;
                  isPhantomBpt: boolean;
              }>;
              displayTokens: Array<{
                  __typename: 'GqlPoolTokenDisplay';
                  id: string;
                  address: string;
                  name: string;
                  weight?: string | null;
                  symbol: string;
                  nestedTokens?: Array<{
                      __typename: 'GqlPoolTokenDisplay';
                      id: string;
                      address: string;
                      name: string;
                      weight?: string | null;
                      symbol: string;
                  }> | null;
              }>;
              staking?: {
                  __typename: 'GqlPoolStaking';
                  id: string;
                  type: GqlPoolStakingType;
                  address: string;
                  farm?: {
                      __typename: 'GqlPoolStakingMasterChefFarm';
                      id: string;
                      beetsPerBlock: string;
                      rewarders?: Array<{
                          __typename: 'GqlPoolStakingFarmRewarder';
                          id: string;
                          address: string;
                          tokenAddress: string;
                          rewardPerSecond: string;
                      }> | null;
                  } | null;
                  gauge?: {
                      __typename: 'GqlPoolStakingGauge';
                      id: string;
                      gaugeAddress: string;
                      version: number;
                      status: GqlPoolStakingGaugeStatus;
                      workingSupply: string;
                      otherGauges?: Array<{
                          __typename: 'GqlPoolStakingOtherGauge';
                          gaugeAddress: string;
                          version: number;
                          status: GqlPoolStakingGaugeStatus;
                          id: string;
                          rewards: Array<{
                              __typename: 'GqlPoolStakingGaugeReward';
                              id: string;
                              tokenAddress: string;
                              rewardPerSecond: string;
                          }>;
                      }> | null;
                      rewards: Array<{
                          __typename: 'GqlPoolStakingGaugeReward';
                          id: string;
                          rewardPerSecond: string;
                          tokenAddress: string;
                      }>;
                  } | null;
                  reliquary?: {
                      __typename: 'GqlPoolStakingReliquaryFarm';
                      beetsPerSecond: string;
                      totalBalance: string;
                      levels?: Array<{
                          __typename: 'GqlPoolStakingReliquaryFarmLevel';
                          level: number;
                          balance: string;
                          apr: string;
                          allocationPoints: number;
                      }> | null;
                  } | null;
              } | null;
              investConfig: {
                  __typename: 'GqlPoolInvestConfig';
                  singleAssetEnabled: boolean;
                  proportionalEnabled: boolean;
                  options: Array<{
                      __typename: 'GqlPoolInvestOption';
                      poolTokenIndex: number;
                      poolTokenAddress: string;
                      tokenOptions: Array<{
                          __typename: 'GqlPoolToken';
                          id: string;
                          index: number;
                          name: string;
                          symbol: string;
                          balance: string;
                          address: string;
                          priceRate: string;
                          decimals: number;
                          weight?: string | null;
                          totalBalance: string;
                      }>;
                  }>;
              };
              withdrawConfig: {
                  __typename: 'GqlPoolWithdrawConfig';
                  singleAssetEnabled: boolean;
                  proportionalEnabled: boolean;
                  options: Array<{
                      __typename: 'GqlPoolWithdrawOption';
                      poolTokenIndex: number;
                      poolTokenAddress: string;
                      tokenOptions: Array<{
                          __typename: 'GqlPoolToken';
                          id: string;
                          index: number;
                          name: string;
                          symbol: string;
                          balance: string;
                          address: string;
                          priceRate: string;
                          decimals: number;
                          weight?: string | null;
                          totalBalance: string;
                      }>;
                  }>;
              };
          };
};

export type GqlPoolTokenFragment = {
    __typename: 'GqlPoolToken';
    id: string;
    index: number;
    name: string;
    symbol: string;
    balance: string;
    address: string;
    priceRate: string;
    decimals: number;
    weight?: string | null;
    totalBalance: string;
};

export type GqlPoolTokenLinearFragment = {
    __typename: 'GqlPoolTokenLinear';
    id: string;
    index: number;
    name: string;
    symbol: string;
    balance: string;
    address: string;
    priceRate: string;
    decimals: number;
    weight?: string | null;
    mainTokenBalance: string;
    wrappedTokenBalance: string;
    totalMainTokenBalance: string;
    totalBalance: string;
    pool: {
        __typename: 'GqlPoolLinearNested';
        id: string;
        name: string;
        symbol: string;
        address: string;
        owner: string;
        factory?: string | null;
        createTime: number;
        wrappedIndex: number;
        mainIndex: number;
        upperTarget: string;
        lowerTarget: string;
        totalShares: string;
        totalLiquidity: string;
        bptPriceRate: string;
        tokens: Array<{
            __typename: 'GqlPoolToken';
            id: string;
            index: number;
            name: string;
            symbol: string;
            balance: string;
            address: string;
            priceRate: string;
            decimals: number;
            weight?: string | null;
            totalBalance: string;
        }>;
    };
};

export type GqlPoolTokenComposableStableFragment = {
    __typename: 'GqlPoolTokenComposableStable';
    id: string;
    index: number;
    name: string;
    symbol: string;
    balance: string;
    address: string;
    weight?: string | null;
    priceRate: string;
    decimals: number;
    totalBalance: string;
    pool: {
        __typename: 'GqlPoolComposableStableNested';
        id: string;
        name: string;
        symbol: string;
        address: string;
        owner: string;
        factory?: string | null;
        createTime: number;
        totalShares: string;
        totalLiquidity: string;
        nestingType: GqlPoolNestingType;
        swapFee: string;
        amp: string;
        tokens: Array<
            | {
                  __typename: 'GqlPoolToken';
                  id: string;
                  index: number;
                  name: string;
                  symbol: string;
                  balance: string;
                  address: string;
                  priceRate: string;
                  decimals: number;
                  weight?: string | null;
                  totalBalance: string;
              }
            | {
                  __typename: 'GqlPoolTokenLinear';
                  id: string;
                  index: number;
                  name: string;
                  symbol: string;
                  balance: string;
                  address: string;
                  priceRate: string;
                  decimals: number;
                  weight?: string | null;
                  mainTokenBalance: string;
                  wrappedTokenBalance: string;
                  totalMainTokenBalance: string;
                  totalBalance: string;
                  pool: {
                      __typename: 'GqlPoolLinearNested';
                      id: string;
                      name: string;
                      symbol: string;
                      address: string;
                      owner: string;
                      factory?: string | null;
                      createTime: number;
                      wrappedIndex: number;
                      mainIndex: number;
                      upperTarget: string;
                      lowerTarget: string;
                      totalShares: string;
                      totalLiquidity: string;
                      bptPriceRate: string;
                      tokens: Array<{
                          __typename: 'GqlPoolToken';
                          id: string;
                          index: number;
                          name: string;
                          symbol: string;
                          balance: string;
                          address: string;
                          priceRate: string;
                          decimals: number;
                          weight?: string | null;
                          totalBalance: string;
                      }>;
                  };
              }
        >;
    };
};

export type GetPoolSwapsQueryVariables = Exact<{
    first?: InputMaybe<Scalars['Int']>;
    skip?: InputMaybe<Scalars['Int']>;
    where?: InputMaybe<GqlPoolSwapFilter>;
}>;

export type GetPoolSwapsQuery = {
    __typename: 'Query';
    swaps: Array<{
        __typename: 'GqlPoolSwap';
        id: string;
        poolId: string;
        timestamp: number;
        tokenAmountIn: string;
        tokenAmountOut: string;
        tokenIn: string;
        tokenOut: string;
        tx: string;
        userAddress: string;
        valueUSD: number;
    }>;
};

export type GetPoolJoinExitsQueryVariables = Exact<{
    first?: InputMaybe<Scalars['Int']>;
    skip?: InputMaybe<Scalars['Int']>;
    poolId: Scalars['String'];
}>;

export type GetPoolJoinExitsQuery = {
    __typename: 'Query';
    joinExits: Array<{
        __typename: 'GqlPoolJoinExit';
        id: string;
        timestamp: number;
        tx: string;
        type: GqlPoolJoinExitType;
        poolId: string;
        valueUSD?: string | null;
        amounts: Array<{ __typename: 'GqlPoolJoinExitAmount'; address: string; amount: string }>;
    }>;
};

export type GetPoolBptPriceChartDataQueryVariables = Exact<{
    address: Scalars['String'];
    range: GqlTokenChartDataRange;
}>;

export type GetPoolBptPriceChartDataQuery = {
    __typename: 'Query';
    prices: Array<{ __typename: 'GqlTokenPriceChartDataItem'; id: string; price: string; timestamp: number }>;
};

export type GetPoolUserJoinExitsQueryVariables = Exact<{
    first?: InputMaybe<Scalars['Int']>;
    skip?: InputMaybe<Scalars['Int']>;
    poolId: Scalars['String'];
}>;

export type GetPoolUserJoinExitsQuery = {
    __typename: 'Query';
    joinExits: Array<{
        __typename: 'GqlPoolJoinExit';
        id: string;
        timestamp: number;
        tx: string;
        type: GqlPoolJoinExitType;
        poolId: string;
        valueUSD?: string | null;
        amounts: Array<{ __typename: 'GqlPoolJoinExitAmount'; address: string; amount: string }>;
    }>;
};

export type GetUserSwapsQueryVariables = Exact<{
    first?: InputMaybe<Scalars['Int']>;
    skip?: InputMaybe<Scalars['Int']>;
    poolId: Scalars['String'];
}>;

export type GetUserSwapsQuery = {
    __typename: 'Query';
    swaps: Array<{
        __typename: 'GqlPoolSwap';
        id: string;
        poolId: string;
        timestamp: number;
        tokenAmountIn: string;
        tokenAmountOut: string;
        tokenIn: string;
        tokenOut: string;
        tx: string;
        valueUSD: number;
    }>;
};

export type GetPoolSnapshotsQueryVariables = Exact<{
    poolId: Scalars['String'];
    range: GqlPoolSnapshotDataRange;
}>;

export type GetPoolSnapshotsQuery = {
    __typename: 'Query';
    snapshots: Array<{
        __typename: 'GqlPoolSnapshot';
        id: string;
        timestamp: number;
        totalLiquidity: string;
        volume24h: string;
        fees24h: string;
        sharePrice: string;
    }>;
};

export type GetPoolTokensDynamicDataQueryVariables = Exact<{
    addresses: Array<Scalars['String']> | Scalars['String'];
}>;

export type GetPoolTokensDynamicDataQuery = {
    __typename: 'Query';
    staticData: Array<{
        __typename: 'GqlTokenData';
        id: string;
        tokenAddress: string;
        description?: string | null;
        discordUrl?: string | null;
        telegramUrl?: string | null;
        twitterUsername?: string | null;
        websiteUrl?: string | null;
    }>;
    dynamicData: Array<{
        __typename: 'GqlTokenDynamicData';
        id: string;
        tokenAddress: string;
        ath: number;
        atl: number;
        marketCap?: string | null;
        fdv?: string | null;
        priceChange24h: number;
        priceChangePercent24h: number;
        priceChangePercent7d?: number | null;
        priceChangePercent14d?: number | null;
        priceChangePercent30d?: number | null;
        high24h: number;
        low24h: number;
        updatedAt: string;
    }>;
};

export type GetPoolsQueryVariables = Exact<{
    first?: InputMaybe<Scalars['Int']>;
    skip?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<GqlPoolOrderBy>;
    orderDirection?: InputMaybe<GqlPoolOrderDirection>;
    where?: InputMaybe<GqlPoolFilter>;
    textSearch?: InputMaybe<Scalars['String']>;
}>;

export type GetPoolsQuery = {
    __typename: 'Query';
    count: number;
    poolGetPools: Array<{
        __typename: 'GqlPoolMinimal';
        id: string;
        address: string;
        name: string;
        symbol: string;
        createTime: number;
        version: number;
        dynamicData: {
            __typename: 'GqlPoolDynamicData';
            totalLiquidity: string;
            totalShares: string;
            fees24h: string;
            swapFee: string;
            volume24h: string;
            apr: {
                __typename: 'GqlPoolApr';
                hasRewardApr: boolean;
                swapApr: string;
                thirdPartyApr:
                    | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                    | { __typename: 'GqlPoolAprTotal'; total: string };
                nativeRewardApr:
                    | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                    | { __typename: 'GqlPoolAprTotal'; total: string };
                apr:
                    | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                    | { __typename: 'GqlPoolAprTotal'; total: string };
                items: Array<{
                    __typename: 'GqlBalancePoolAprItem';
                    id: string;
                    title: string;
                    apr:
                        | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                        | { __typename: 'GqlPoolAprTotal'; total: string };
                    subItems?: Array<{
                        __typename: 'GqlBalancePoolAprSubItem';
                        id: string;
                        title: string;
                        apr:
                            | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                            | { __typename: 'GqlPoolAprTotal'; total: string };
                    }> | null;
                }>;
            };
        };
        allTokens: Array<{
            __typename: 'GqlPoolTokenExpanded';
            id: string;
            address: string;
            isNested: boolean;
            isPhantomBpt: boolean;
            weight?: string | null;
            symbol: string;
        }>;
        displayTokens: Array<{
            __typename: 'GqlPoolTokenDisplay';
            id: string;
            address: string;
            name: string;
            weight?: string | null;
            symbol: string;
            nestedTokens?: Array<{
                __typename: 'GqlPoolTokenDisplay';
                id: string;
                address: string;
                name: string;
                weight?: string | null;
                symbol: string;
            }> | null;
        }>;
        staking?: {
            __typename: 'GqlPoolStaking';
            id: string;
            type: GqlPoolStakingType;
            address: string;
            farm?: {
                __typename: 'GqlPoolStakingMasterChefFarm';
                id: string;
                beetsPerBlock: string;
                rewarders?: Array<{
                    __typename: 'GqlPoolStakingFarmRewarder';
                    id: string;
                    address: string;
                    tokenAddress: string;
                    rewardPerSecond: string;
                }> | null;
            } | null;
        } | null;
    }>;
};

export type GqlPoolMinimalFragment = {
    __typename: 'GqlPoolMinimal';
    id: string;
    address: string;
    name: string;
    symbol: string;
    createTime: number;
    version: number;
    dynamicData: {
        __typename: 'GqlPoolDynamicData';
        totalLiquidity: string;
        totalShares: string;
        fees24h: string;
        swapFee: string;
        volume24h: string;
        apr: {
            __typename: 'GqlPoolApr';
            hasRewardApr: boolean;
            swapApr: string;
            thirdPartyApr:
                | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                | { __typename: 'GqlPoolAprTotal'; total: string };
            nativeRewardApr:
                | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                | { __typename: 'GqlPoolAprTotal'; total: string };
            apr:
                | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                | { __typename: 'GqlPoolAprTotal'; total: string };
            items: Array<{
                __typename: 'GqlBalancePoolAprItem';
                id: string;
                title: string;
                apr:
                    | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                    | { __typename: 'GqlPoolAprTotal'; total: string };
                subItems?: Array<{
                    __typename: 'GqlBalancePoolAprSubItem';
                    id: string;
                    title: string;
                    apr:
                        | { __typename: 'GqlPoolAprRange'; min: string; max: string }
                        | { __typename: 'GqlPoolAprTotal'; total: string };
                }> | null;
            }>;
        };
    };
    allTokens: Array<{
        __typename: 'GqlPoolTokenExpanded';
        id: string;
        address: string;
        isNested: boolean;
        isPhantomBpt: boolean;
        weight?: string | null;
        symbol: string;
    }>;
    displayTokens: Array<{
        __typename: 'GqlPoolTokenDisplay';
        id: string;
        address: string;
        name: string;
        weight?: string | null;
        symbol: string;
        nestedTokens?: Array<{
            __typename: 'GqlPoolTokenDisplay';
            id: string;
            address: string;
            name: string;
            weight?: string | null;
            symbol: string;
        }> | null;
    }>;
    staking?: {
        __typename: 'GqlPoolStaking';
        id: string;
        type: GqlPoolStakingType;
        address: string;
        farm?: {
            __typename: 'GqlPoolStakingMasterChefFarm';
            id: string;
            beetsPerBlock: string;
            rewarders?: Array<{
                __typename: 'GqlPoolStakingFarmRewarder';
                id: string;
                address: string;
                tokenAddress: string;
                rewardPerSecond: string;
            }> | null;
        } | null;
    } | null;
};

export type GetReliquaryFarmSnapshotsQueryVariables = Exact<{
    id: Scalars['String'];
    range: GqlPoolSnapshotDataRange;
}>;

export type GetReliquaryFarmSnapshotsQuery = {
    __typename: 'Query';
    snapshots: Array<{
        __typename: 'GqlReliquaryFarmSnapshot';
        id: string;
        farmId: string;
        timestamp: number;
        totalBalance: string;
        totalLiquidity: string;
        relicCount: string;
        userCount: string;
        levelBalances: Array<{
            __typename: 'GqlReliquaryFarmLevelSnapshot';
            id: string;
            level: string;
            balance: string;
        }>;
        tokenBalances: Array<{
            __typename: 'GqlReliquaryTokenBalanceSnapshot';
            id: string;
            address: string;
            balance: string;
            symbol: string;
        }>;
    }>;
};

export type SftmxGetStakingDataQueryVariables = Exact<{ [key: string]: never }>;

export type SftmxGetStakingDataQuery = {
    __typename: 'Query';
    sftmxGetStakingData: {
        __typename: 'GqlSftmxStakingData';
        exchangeRate: string;
        maintenancePaused: boolean;
        maxDepositLimit: string;
        minDepositLimit: string;
        numberOfVaults: number;
        stakingApr: string;
        totalFtmAmount: string;
        totalFtmAmountInPool: string;
        totalFtmAmountStaked: string;
        undelegatePaused: boolean;
        withdrawPaused: boolean;
        withdrawalDelay: number;
        vaults: Array<{
            __typename: 'GqlSftmxStakingVault';
            ftmAmountStaked: string;
            isMatured: boolean;
            unlockTimestamp: number;
            validatorAddress: string;
            validatorId: string;
            vaultAddress: string;
            vaultIndex: number;
        }>;
    };
};

export type SftmxGetWithdrawalRequestsQueryVariables = Exact<{
    user: Scalars['String'];
}>;

export type SftmxGetWithdrawalRequestsQuery = {
    __typename: 'Query';
    sftmxGetWithdrawalRequests: Array<{
        __typename: 'GqlSftmxWithdrawalRequests';
        amountSftmx: string;
        id: string;
        isWithdrawn: boolean;
        requestTimestamp: number;
        user: string;
    }>;
};

export type SftmxGetStakingSnapshotsQueryVariables = Exact<{
    range: GqlSftmxStakingSnapshotDataRange;
}>;

export type SftmxGetStakingSnapshotsQuery = {
    __typename: 'Query';
    snapshots: Array<{
        __typename: 'GqlSftmxStakingSnapshot';
        exchangeRate: string;
        id: string;
        timestamp: number;
        totalFtmAmount: string;
        totalFtmAmountInPool: string;
        totalFtmAmountStaked: string;
    }>;
};

export type GetTokenRelativePriceChartDataQueryVariables = Exact<{
    tokenIn: Scalars['String'];
    tokenOut: Scalars['String'];
    range: GqlTokenChartDataRange;
}>;

export type GetTokenRelativePriceChartDataQuery = {
    __typename: 'Query';
    prices: Array<{ __typename: 'GqlTokenPriceChartDataItem'; id: string; price: string; timestamp: number }>;
};

export type GetSorSwapsQueryVariables = Exact<{
    tokenIn: Scalars['String'];
    tokenOut: Scalars['String'];
    swapType: GqlSorSwapType;
    swapAmount: Scalars['BigDecimal'];
    swapOptions: GqlSorSwapOptionsInput;
}>;

export type GetSorSwapsQuery = {
    __typename: 'Query';
    swaps: {
        __typename: 'GqlSorGetSwapsResponse';
        tokenIn: string;
        tokenOut: string;
        swapAmount: string;
        tokenAddresses: Array<string>;
        swapType: GqlSorSwapType;
        marketSp: string;
        returnAmount: string;
        returnAmountScaled: string;
        returnAmountFromSwaps?: string | null;
        returnAmountConsideringFees: string;
        swapAmountScaled: string;
        swapAmountForSwaps?: string | null;
        tokenInAmount: string;
        tokenOutAmount: string;
        effectivePrice: string;
        effectivePriceReversed: string;
        priceImpact: string;
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
                pool: {
                    __typename: 'GqlPoolMinimal';
                    id: string;
                    name: string;
                    type: GqlPoolType;
                    symbol: string;
                    dynamicData: { __typename: 'GqlPoolDynamicData'; totalLiquidity: string };
                    allTokens: Array<{
                        __typename: 'GqlPoolTokenExpanded';
                        address: string;
                        isNested: boolean;
                        isPhantomBpt: boolean;
                        weight?: string | null;
                    }>;
                };
            }>;
        }>;
    };
};

export type GqlSorGetSwapsResponseFragment = {
    __typename: 'GqlSorGetSwapsResponse';
    tokenIn: string;
    tokenOut: string;
    swapAmount: string;
    tokenAddresses: Array<string>;
    swapType: GqlSorSwapType;
    marketSp: string;
    returnAmount: string;
    returnAmountScaled: string;
    returnAmountFromSwaps?: string | null;
    returnAmountConsideringFees: string;
    swapAmountScaled: string;
    swapAmountForSwaps?: string | null;
    tokenInAmount: string;
    tokenOutAmount: string;
    effectivePrice: string;
    effectivePriceReversed: string;
    priceImpact: string;
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
            pool: {
                __typename: 'GqlPoolMinimal';
                id: string;
                name: string;
                type: GqlPoolType;
                symbol: string;
                dynamicData: { __typename: 'GqlPoolDynamicData'; totalLiquidity: string };
                allTokens: Array<{
                    __typename: 'GqlPoolTokenExpanded';
                    address: string;
                    isNested: boolean;
                    isPhantomBpt: boolean;
                    weight?: string | null;
                }>;
            };
        }>;
    }>;
};

export type GqlSorSwapRouteFragment = {
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
        pool: {
            __typename: 'GqlPoolMinimal';
            id: string;
            name: string;
            type: GqlPoolType;
            symbol: string;
            dynamicData: { __typename: 'GqlPoolDynamicData'; totalLiquidity: string };
            allTokens: Array<{
                __typename: 'GqlPoolTokenExpanded';
                address: string;
                isNested: boolean;
                isPhantomBpt: boolean;
                weight?: string | null;
            }>;
        };
    }>;
};

export type GqlSorSwapRouteHopFragment = {
    __typename: 'GqlSorSwapRouteHop';
    poolId: string;
    tokenIn: string;
    tokenOut: string;
    tokenInAmount: string;
    tokenOutAmount: string;
    pool: {
        __typename: 'GqlPoolMinimal';
        id: string;
        name: string;
        type: GqlPoolType;
        symbol: string;
        dynamicData: { __typename: 'GqlPoolDynamicData'; totalLiquidity: string };
        allTokens: Array<{
            __typename: 'GqlPoolTokenExpanded';
            address: string;
            isNested: boolean;
            isPhantomBpt: boolean;
            weight?: string | null;
        }>;
    };
};

export type GetTradeSelectedTokenDataQueryVariables = Exact<{
    tokenIn: Scalars['String'];
    tokenOut: Scalars['String'];
}>;

export type GetTradeSelectedTokenDataQuery = {
    __typename: 'Query';
    tokenInData?: {
        __typename: 'GqlTokenData';
        id: string;
        tokenAddress: string;
        description?: string | null;
        discordUrl?: string | null;
        telegramUrl?: string | null;
        twitterUsername?: string | null;
    } | null;
    tokenOutData?: {
        __typename: 'GqlTokenData';
        id: string;
        tokenAddress: string;
        description?: string | null;
        discordUrl?: string | null;
        telegramUrl?: string | null;
        twitterUsername?: string | null;
    } | null;
    tokenInDynamicData?: {
        __typename: 'GqlTokenDynamicData';
        id: string;
        tokenAddress: string;
        ath: number;
        atl: number;
        marketCap?: string | null;
        fdv?: string | null;
        priceChange24h: number;
        priceChangePercent24h: number;
        priceChangePercent7d?: number | null;
        priceChangePercent14d?: number | null;
        priceChangePercent30d?: number | null;
        high24h: number;
        low24h: number;
        updatedAt: string;
    } | null;
    tokenOutDynamicData?: {
        __typename: 'GqlTokenDynamicData';
        id: string;
        tokenAddress: string;
        ath: number;
        atl: number;
        marketCap?: string | null;
        fdv?: string | null;
        priceChange24h: number;
        priceChangePercent24h: number;
        priceChangePercent7d?: number | null;
        priceChangePercent14d?: number | null;
        priceChangePercent30d?: number | null;
        high24h: number;
        low24h: number;
        updatedAt: string;
    } | null;
};

export type GqlTokenDynamicDataFragment = {
    __typename: 'GqlTokenDynamicData';
    id: string;
    tokenAddress: string;
    ath: number;
    atl: number;
    marketCap?: string | null;
    fdv?: string | null;
    priceChange24h: number;
    priceChangePercent24h: number;
    priceChangePercent7d?: number | null;
    priceChangePercent14d?: number | null;
    priceChangePercent30d?: number | null;
    high24h: number;
    low24h: number;
    updatedAt: string;
};

export const GqlPoolBatchSwapSwapFragmentDoc = gql`
    fragment GqlPoolBatchSwapSwap on GqlPoolBatchSwapSwap {
        id
        timestamp
        tokenAmountIn
        tokenAmountOut
        tokenIn
        tokenOut
        valueUSD
        pool {
            id
            name
            type
            symbol
            allTokens {
                address
                isNested
                isPhantomBpt
                weight
            }
        }
    }
`;
export const GqlPoolBatchSwapFragmentDoc = gql`
    fragment GqlPoolBatchSwap on GqlPoolBatchSwap {
        id
        timestamp
        tokenAmountIn
        tokenAmountOut
        tokenIn
        tokenOut
        tokenInPrice
        tokenOutPrice
        tx
        userAddress
        valueUSD
        swaps {
            ...GqlPoolBatchSwapSwap
        }
    }
    ${GqlPoolBatchSwapSwapFragmentDoc}
`;
export const GqlPoolCardDataFragmentDoc = gql`
    fragment GqlPoolCardData on GqlPoolMinimal {
        id
        address
        name
        dynamicData {
            totalLiquidity
            totalShares
            apr {
                hasRewardApr
                thirdPartyApr {
                    ... on GqlPoolAprTotal {
                        total
                    }
                    ... on GqlPoolAprRange {
                        min
                        max
                    }
                }
                nativeRewardApr {
                    ... on GqlPoolAprTotal {
                        total
                    }
                    ... on GqlPoolAprRange {
                        min
                        max
                    }
                }
                swapApr
                apr {
                    ... on GqlPoolAprTotal {
                        total
                    }
                    ... on GqlPoolAprRange {
                        min
                        max
                    }
                }
                items {
                    id
                    title
                    apr {
                        ... on GqlPoolAprTotal {
                            total
                        }
                        ... on GqlPoolAprRange {
                            min
                            max
                        }
                    }
                    subItems {
                        id
                        title
                        apr {
                            ... on GqlPoolAprTotal {
                                total
                            }
                            ... on GqlPoolAprRange {
                                min
                                max
                            }
                        }
                    }
                }
            }
        }
        allTokens {
            id
            address
            isNested
            isPhantomBpt
            weight
        }
        displayTokens {
            id
            address
            name
            weight
            symbol
            nestedTokens {
                id
                address
                name
                weight
                symbol
            }
        }
    }
`;
export const GqlPoolFeaturedPoolGroupFragmentDoc = gql`
    fragment GqlPoolFeaturedPoolGroup on GqlPoolFeaturedPoolGroup {
        id
        icon
        title
        items {
            ... on GqlFeaturePoolGroupItemExternalLink {
                id
                image
                buttonText
                buttonUrl
            }
            ... on GqlPoolMinimal {
                ...GqlPoolCardData
            }
        }
    }
    ${GqlPoolCardDataFragmentDoc}
`;
export const GqlPoolLinearFragmentDoc = gql`
    fragment GqlPoolLinear on GqlPoolLinear {
        id
        address
        name
        owner
        decimals
        factory
        symbol
        createTime
        dynamicData {
            poolId
            swapEnabled
            totalLiquidity
            totalLiquidity24hAgo
            totalShares
            totalShares24hAgo
            fees24h
            swapFee
            volume24h
            fees48h
            volume48h
            apr {
                hasRewardApr
                thirdPartyApr {
                    ... on GqlPoolAprTotal {
                        total
                    }
                    ... on GqlPoolAprRange {
                        min
                        max
                    }
                }
                nativeRewardApr {
                    ... on GqlPoolAprTotal {
                        total
                    }
                    ... on GqlPoolAprRange {
                        min
                        max
                    }
                }
                swapApr
                apr {
                    ... on GqlPoolAprTotal {
                        total
                    }
                    ... on GqlPoolAprRange {
                        min
                        max
                    }
                }
                items {
                    id
                    title
                    apr {
                        ... on GqlPoolAprTotal {
                            total
                        }
                        ... on GqlPoolAprRange {
                            min
                            max
                        }
                    }
                    subItems {
                        id
                        title
                        apr {
                            ... on GqlPoolAprTotal {
                                total
                            }
                            ... on GqlPoolAprRange {
                                min
                                max
                            }
                        }
                    }
                }
            }
        }
        mainIndex
        wrappedIndex
        lowerTarget
        upperTarget
        tokens {
            id
            index
            name
            symbol
            balance
            address
            priceRate
            decimals
            weight
            totalBalance
        }
    }
`;
export const GqlPoolTokenFragmentDoc = gql`
    fragment GqlPoolToken on GqlPoolToken {
        id
        index
        name
        symbol
        balance
        address
        priceRate
        decimals
        weight
        totalBalance
    }
`;
export const GqlPoolTokenLinearFragmentDoc = gql`
    fragment GqlPoolTokenLinear on GqlPoolTokenLinear {
        id
        index
        name
        symbol
        balance
        address
        priceRate
        decimals
        weight
        mainTokenBalance
        wrappedTokenBalance
        totalMainTokenBalance
        totalBalance
        pool {
            id
            name
            symbol
            address
            owner
            factory
            createTime
            wrappedIndex
            mainIndex
            upperTarget
            lowerTarget
            totalShares
            totalLiquidity
            bptPriceRate
            tokens {
                ... on GqlPoolToken {
                    ...GqlPoolToken
                }
            }
        }
    }
    ${GqlPoolTokenFragmentDoc}
`;
export const GqlPoolTokenComposableStableFragmentDoc = gql`
    fragment GqlPoolTokenComposableStable on GqlPoolTokenComposableStable {
        id
        index
        name
        symbol
        balance
        address
        weight
        priceRate
        decimals
        totalBalance
        pool {
            id
            name
            symbol
            address
            owner
            factory
            createTime
            totalShares
            totalLiquidity
            nestingType
            swapFee
            amp
            tokens {
                ... on GqlPoolToken {
                    ...GqlPoolToken
                }
                ... on GqlPoolTokenLinear {
                    ...GqlPoolTokenLinear
                }
            }
        }
    }
    ${GqlPoolTokenFragmentDoc}
    ${GqlPoolTokenLinearFragmentDoc}
`;
export const GqlPoolMinimalFragmentDoc = gql`
    fragment GqlPoolMinimal on GqlPoolMinimal {
        id
        address
        name
        symbol
        createTime
        version
        dynamicData {
            totalLiquidity
            totalShares
            fees24h
            swapFee
            volume24h
            apr {
                hasRewardApr
                thirdPartyApr {
                    ... on GqlPoolAprTotal {
                        total
                    }
                    ... on GqlPoolAprRange {
                        min
                        max
                    }
                }
                nativeRewardApr {
                    ... on GqlPoolAprTotal {
                        total
                    }
                    ... on GqlPoolAprRange {
                        min
                        max
                    }
                }
                swapApr
                apr {
                    ... on GqlPoolAprTotal {
                        total
                    }
                    ... on GqlPoolAprRange {
                        min
                        max
                    }
                }
                items {
                    id
                    title
                    apr {
                        ... on GqlPoolAprTotal {
                            total
                        }
                        ... on GqlPoolAprRange {
                            min
                            max
                        }
                    }
                    subItems {
                        id
                        title
                        apr {
                            ... on GqlPoolAprTotal {
                                total
                            }
                            ... on GqlPoolAprRange {
                                min
                                max
                            }
                        }
                    }
                }
            }
        }
        allTokens {
            id
            address
            isNested
            isPhantomBpt
            weight
            symbol
        }
        displayTokens {
            id
            address
            name
            weight
            symbol
            nestedTokens {
                id
                address
                name
                weight
                symbol
            }
        }
        staking {
            id
            type
            address
            farm {
                id
                beetsPerBlock
                rewarders {
                    id
                    address
                    tokenAddress
                    rewardPerSecond
                }
            }
        }
    }
`;
export const GqlSorSwapRouteHopFragmentDoc = gql`
    fragment GqlSorSwapRouteHop on GqlSorSwapRouteHop {
        poolId
        pool {
            id
            name
            type
            symbol
            dynamicData {
                totalLiquidity
            }
            allTokens {
                address
                isNested
                isPhantomBpt
                weight
            }
        }
        tokenIn
        tokenOut
        tokenInAmount
        tokenOutAmount
    }
`;
export const GqlSorSwapRouteFragmentDoc = gql`
    fragment GqlSorSwapRoute on GqlSorSwapRoute {
        tokenIn
        tokenOut
        tokenInAmount
        tokenOutAmount
        share
        hops {
            ...GqlSorSwapRouteHop
        }
    }
    ${GqlSorSwapRouteHopFragmentDoc}
`;
export const GqlSorGetSwapsResponseFragmentDoc = gql`
    fragment GqlSorGetSwapsResponse on GqlSorGetSwapsResponse {
        tokenIn
        tokenOut
        swapAmount
        tokenAddresses
        swapType
        marketSp
        swaps {
            poolId
            amount
            userData
            assetInIndex
            assetOutIndex
        }
        returnAmount
        returnAmountScaled
        returnAmountFromSwaps
        returnAmountConsideringFees
        swapAmount
        swapAmountScaled
        swapAmountForSwaps
        tokenInAmount
        tokenOutAmount
        effectivePrice
        effectivePriceReversed
        priceImpact
        routes {
            ...GqlSorSwapRoute
        }
    }
    ${GqlSorSwapRouteFragmentDoc}
`;
export const GqlTokenDynamicDataFragmentDoc = gql`
    fragment GqlTokenDynamicData on GqlTokenDynamicData {
        id
        tokenAddress
        ath
        atl
        marketCap
        fdv
        priceChange24h
        priceChangePercent24h
        priceChangePercent7d
        priceChangePercent14d
        priceChangePercent30d
        high24h
        low24h
        updatedAt
    }
`;
export const GetPoolBatchSwapsDocument = gql`
    query GetPoolBatchSwaps($first: Int, $skip: Int, $where: GqlPoolSwapFilter) {
        batchSwaps: poolGetBatchSwaps(first: $first, skip: $skip, where: $where) {
            ...GqlPoolBatchSwap
        }
    }
    ${GqlPoolBatchSwapFragmentDoc}
`;

/**
 * __useGetPoolBatchSwapsQuery__
 *
 * To run a query within a React component, call `useGetPoolBatchSwapsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPoolBatchSwapsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPoolBatchSwapsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetPoolBatchSwapsQuery(
    baseOptions?: Apollo.QueryHookOptions<GetPoolBatchSwapsQuery, GetPoolBatchSwapsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetPoolBatchSwapsQuery, GetPoolBatchSwapsQueryVariables>(GetPoolBatchSwapsDocument, options);
}
export function useGetPoolBatchSwapsLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetPoolBatchSwapsQuery, GetPoolBatchSwapsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetPoolBatchSwapsQuery, GetPoolBatchSwapsQueryVariables>(
        GetPoolBatchSwapsDocument,
        options,
    );
}
export type GetPoolBatchSwapsQueryHookResult = ReturnType<typeof useGetPoolBatchSwapsQuery>;
export type GetPoolBatchSwapsLazyQueryHookResult = ReturnType<typeof useGetPoolBatchSwapsLazyQuery>;
export type GetPoolBatchSwapsQueryResult = Apollo.QueryResult<GetPoolBatchSwapsQuery, GetPoolBatchSwapsQueryVariables>;
export const GetAppGlobalDataDocument = gql`
    query GetAppGlobalData {
        tokenGetTokens {
            address
            name
            symbol
            decimals
            chainId
            logoURI
            priority
            tradable
        }
        beetsGetFbeetsRatio
        blocksGetBlocksPerDay
        blocksGetAverageBlockTime
        veBALTotalSupply: veBalGetTotalSupply
    }
`;

/**
 * __useGetAppGlobalDataQuery__
 *
 * To run a query within a React component, call `useGetAppGlobalDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppGlobalDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAppGlobalDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAppGlobalDataQuery(
    baseOptions?: Apollo.QueryHookOptions<GetAppGlobalDataQuery, GetAppGlobalDataQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetAppGlobalDataQuery, GetAppGlobalDataQueryVariables>(GetAppGlobalDataDocument, options);
}
export function useGetAppGlobalDataLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetAppGlobalDataQuery, GetAppGlobalDataQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetAppGlobalDataQuery, GetAppGlobalDataQueryVariables>(
        GetAppGlobalDataDocument,
        options,
    );
}
export type GetAppGlobalDataQueryHookResult = ReturnType<typeof useGetAppGlobalDataQuery>;
export type GetAppGlobalDataLazyQueryHookResult = ReturnType<typeof useGetAppGlobalDataLazyQuery>;
export type GetAppGlobalDataQueryResult = Apollo.QueryResult<GetAppGlobalDataQuery, GetAppGlobalDataQueryVariables>;
export const GetAppGlobalPollingDataDocument = gql`
    query GetAppGlobalPollingData {
        tokenGetCurrentPrices {
            price
            address
        }
        protocolMetricsChain {
            totalLiquidity
            totalSwapVolume
            totalSwapFee
            poolCount
            swapFee24h
            swapVolume24h
        }
        blocksGetBlocksPerDay
        blocksGetAverageBlockTime
        tokenGetProtocolTokenPrice
    }
`;

/**
 * __useGetAppGlobalPollingDataQuery__
 *
 * To run a query within a React component, call `useGetAppGlobalPollingDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppGlobalPollingDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAppGlobalPollingDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAppGlobalPollingDataQuery(
    baseOptions?: Apollo.QueryHookOptions<GetAppGlobalPollingDataQuery, GetAppGlobalPollingDataQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetAppGlobalPollingDataQuery, GetAppGlobalPollingDataQueryVariables>(
        GetAppGlobalPollingDataDocument,
        options,
    );
}
export function useGetAppGlobalPollingDataLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetAppGlobalPollingDataQuery, GetAppGlobalPollingDataQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetAppGlobalPollingDataQuery, GetAppGlobalPollingDataQueryVariables>(
        GetAppGlobalPollingDataDocument,
        options,
    );
}
export type GetAppGlobalPollingDataQueryHookResult = ReturnType<typeof useGetAppGlobalPollingDataQuery>;
export type GetAppGlobalPollingDataLazyQueryHookResult = ReturnType<typeof useGetAppGlobalPollingDataLazyQuery>;
export type GetAppGlobalPollingDataQueryResult = Apollo.QueryResult<
    GetAppGlobalPollingDataQuery,
    GetAppGlobalPollingDataQueryVariables
>;
export const GetTokensDocument = gql`
    query GetTokens {
        tokens: tokenGetTokens {
            address
            name
            symbol
            decimals
            chain
            chainId
            logoURI
            priority
            tradable
        }
    }
`;

/**
 * __useGetTokensQuery__
 *
 * To run a query within a React component, call `useGetTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTokensQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTokensQuery(baseOptions?: Apollo.QueryHookOptions<GetTokensQuery, GetTokensQueryVariables>) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetTokensQuery, GetTokensQueryVariables>(GetTokensDocument, options);
}
export function useGetTokensLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetTokensQuery, GetTokensQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetTokensQuery, GetTokensQueryVariables>(GetTokensDocument, options);
}
export type GetTokensQueryHookResult = ReturnType<typeof useGetTokensQuery>;
export type GetTokensLazyQueryHookResult = ReturnType<typeof useGetTokensLazyQuery>;
export type GetTokensQueryResult = Apollo.QueryResult<GetTokensQuery, GetTokensQueryVariables>;
export const GetTokenPricesDocument = gql`
    query GetTokenPrices {
        tokenPrices: tokenGetCurrentPrices {
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
export const GetTokensDynamicDataDocument = gql`
    query GetTokensDynamicData($addresses: [String!]!) {
        dynamicData: tokenGetTokensDynamicData(addresses: $addresses) {
            ath
            atl
            fdv
            high24h
            id
            low24h
            marketCap
            price
            priceChange24h
            priceChangePercent7d
            priceChangePercent14d
            priceChangePercent24h
            priceChangePercent30d
            tokenAddress
            updatedAt
        }
    }
`;

/**
 * __useGetTokensDynamicDataQuery__
 *
 * To run a query within a React component, call `useGetTokensDynamicDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTokensDynamicDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTokensDynamicDataQuery({
 *   variables: {
 *      addresses: // value for 'addresses'
 *   },
 * });
 */
export function useGetTokensDynamicDataQuery(
    baseOptions: Apollo.QueryHookOptions<GetTokensDynamicDataQuery, GetTokensDynamicDataQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetTokensDynamicDataQuery, GetTokensDynamicDataQueryVariables>(
        GetTokensDynamicDataDocument,
        options,
    );
}
export function useGetTokensDynamicDataLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetTokensDynamicDataQuery, GetTokensDynamicDataQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetTokensDynamicDataQuery, GetTokensDynamicDataQueryVariables>(
        GetTokensDynamicDataDocument,
        options,
    );
}
export type GetTokensDynamicDataQueryHookResult = ReturnType<typeof useGetTokensDynamicDataQuery>;
export type GetTokensDynamicDataLazyQueryHookResult = ReturnType<typeof useGetTokensDynamicDataLazyQuery>;
export type GetTokensDynamicDataQueryResult = Apollo.QueryResult<
    GetTokensDynamicDataQuery,
    GetTokensDynamicDataQueryVariables
>;
export const GetFbeetsRatioDocument = gql`
    query GetFbeetsRatio {
        ratio: beetsGetFbeetsRatio
    }
`;

/**
 * __useGetFbeetsRatioQuery__
 *
 * To run a query within a React component, call `useGetFbeetsRatioQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFbeetsRatioQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFbeetsRatioQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetFbeetsRatioQuery(
    baseOptions?: Apollo.QueryHookOptions<GetFbeetsRatioQuery, GetFbeetsRatioQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetFbeetsRatioQuery, GetFbeetsRatioQueryVariables>(GetFbeetsRatioDocument, options);
}
export function useGetFbeetsRatioLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetFbeetsRatioQuery, GetFbeetsRatioQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetFbeetsRatioQuery, GetFbeetsRatioQueryVariables>(GetFbeetsRatioDocument, options);
}
export type GetFbeetsRatioQueryHookResult = ReturnType<typeof useGetFbeetsRatioQuery>;
export type GetFbeetsRatioLazyQueryHookResult = ReturnType<typeof useGetFbeetsRatioLazyQuery>;
export type GetFbeetsRatioQueryResult = Apollo.QueryResult<GetFbeetsRatioQuery, GetFbeetsRatioQueryVariables>;
export const GetProtocolDataDocument = gql`
    query GetProtocolData {
        protocolData: protocolMetricsChain {
            totalLiquidity
            totalSwapVolume
            totalSwapFee
            poolCount
            swapFee24h
            swapVolume24h
        }
        beetsPrice: tokenGetProtocolTokenPrice
    }
`;

/**
 * __useGetProtocolDataQuery__
 *
 * To run a query within a React component, call `useGetProtocolDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProtocolDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProtocolDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProtocolDataQuery(
    baseOptions?: Apollo.QueryHookOptions<GetProtocolDataQuery, GetProtocolDataQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetProtocolDataQuery, GetProtocolDataQueryVariables>(GetProtocolDataDocument, options);
}
export function useGetProtocolDataLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetProtocolDataQuery, GetProtocolDataQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetProtocolDataQuery, GetProtocolDataQueryVariables>(GetProtocolDataDocument, options);
}
export type GetProtocolDataQueryHookResult = ReturnType<typeof useGetProtocolDataQuery>;
export type GetProtocolDataLazyQueryHookResult = ReturnType<typeof useGetProtocolDataLazyQuery>;
export type GetProtocolDataQueryResult = Apollo.QueryResult<GetProtocolDataQuery, GetProtocolDataQueryVariables>;
export const GetBlocksPerDayDocument = gql`
    query GetBlocksPerDay {
        blocksPerDay: blocksGetBlocksPerDay
        avgBlockTime: blocksGetAverageBlockTime
    }
`;

/**
 * __useGetBlocksPerDayQuery__
 *
 * To run a query within a React component, call `useGetBlocksPerDayQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBlocksPerDayQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBlocksPerDayQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBlocksPerDayQuery(
    baseOptions?: Apollo.QueryHookOptions<GetBlocksPerDayQuery, GetBlocksPerDayQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetBlocksPerDayQuery, GetBlocksPerDayQueryVariables>(GetBlocksPerDayDocument, options);
}
export function useGetBlocksPerDayLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetBlocksPerDayQuery, GetBlocksPerDayQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetBlocksPerDayQuery, GetBlocksPerDayQueryVariables>(GetBlocksPerDayDocument, options);
}
export type GetBlocksPerDayQueryHookResult = ReturnType<typeof useGetBlocksPerDayQuery>;
export type GetBlocksPerDayLazyQueryHookResult = ReturnType<typeof useGetBlocksPerDayLazyQuery>;
export type GetBlocksPerDayQueryResult = Apollo.QueryResult<GetBlocksPerDayQuery, GetBlocksPerDayQueryVariables>;
export const GetBeetsPriceDocument = gql`
    query GetBeetsPrice {
        beetsPrice: tokenGetProtocolTokenPrice
    }
`;

/**
 * __useGetBeetsPriceQuery__
 *
 * To run a query within a React component, call `useGetBeetsPriceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBeetsPriceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBeetsPriceQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBeetsPriceQuery(
    baseOptions?: Apollo.QueryHookOptions<GetBeetsPriceQuery, GetBeetsPriceQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetBeetsPriceQuery, GetBeetsPriceQueryVariables>(GetBeetsPriceDocument, options);
}
export function useGetBeetsPriceLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetBeetsPriceQuery, GetBeetsPriceQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetBeetsPriceQuery, GetBeetsPriceQueryVariables>(GetBeetsPriceDocument, options);
}
export type GetBeetsPriceQueryHookResult = ReturnType<typeof useGetBeetsPriceQuery>;
export type GetBeetsPriceLazyQueryHookResult = ReturnType<typeof useGetBeetsPriceLazyQuery>;
export type GetBeetsPriceQueryResult = Apollo.QueryResult<GetBeetsPriceQuery, GetBeetsPriceQueryVariables>;
export const GetUserDataDocument = gql`
    query GetUserData {
        balances: userGetPoolBalances {
            poolId
            tokenAddress
            tokenPrice
            totalBalance
            stakedBalance
            walletBalance
        }
        fbeetsBalance: userGetFbeetsBalance {
            totalBalance
            stakedBalance
            walletBalance
        }
        staking: userGetStaking {
            id
            chain
            type
            address
            chain
            farm {
                id
                beetsPerBlock
                rewarders {
                    id
                    address
                    tokenAddress
                    rewardPerSecond
                }
            }
            gauge {
                id
                gaugeAddress
                version
                status
                otherGauges {
                    gaugeAddress
                    version
                    status
                    id
                    rewards {
                        id
                        tokenAddress
                        rewardPerSecond
                    }
                }
                rewards {
                    id
                    rewardPerSecond
                    tokenAddress
                }
                workingSupply
            }
        }
        veBALUserBalance: veBalGetUserBalance
    }
`;

/**
 * __useGetUserDataQuery__
 *
 * To run a query within a React component, call `useGetUserDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserDataQuery(
    baseOptions?: Apollo.QueryHookOptions<GetUserDataQuery, GetUserDataQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetUserDataQuery, GetUserDataQueryVariables>(GetUserDataDocument, options);
}
export function useGetUserDataLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetUserDataQuery, GetUserDataQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetUserDataQuery, GetUserDataQueryVariables>(GetUserDataDocument, options);
}
export type GetUserDataQueryHookResult = ReturnType<typeof useGetUserDataQuery>;
export type GetUserDataLazyQueryHookResult = ReturnType<typeof useGetUserDataLazyQuery>;
export type GetUserDataQueryResult = Apollo.QueryResult<GetUserDataQuery, GetUserDataQueryVariables>;
export const UserSyncBalanceDocument = gql`
    mutation UserSyncBalance($poolId: String!) {
        userSyncBalance(poolId: $poolId)
    }
`;
export type UserSyncBalanceMutationFn = Apollo.MutationFunction<
    UserSyncBalanceMutation,
    UserSyncBalanceMutationVariables
>;

/**
 * __useUserSyncBalanceMutation__
 *
 * To run a mutation, you first call `useUserSyncBalanceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserSyncBalanceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userSyncBalanceMutation, { data, loading, error }] = useUserSyncBalanceMutation({
 *   variables: {
 *      poolId: // value for 'poolId'
 *   },
 * });
 */
export function useUserSyncBalanceMutation(
    baseOptions?: Apollo.MutationHookOptions<UserSyncBalanceMutation, UserSyncBalanceMutationVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useMutation<UserSyncBalanceMutation, UserSyncBalanceMutationVariables>(
        UserSyncBalanceDocument,
        options,
    );
}
export type UserSyncBalanceMutationHookResult = ReturnType<typeof useUserSyncBalanceMutation>;
export type UserSyncBalanceMutationResult = Apollo.MutationResult<UserSyncBalanceMutation>;
export type UserSyncBalanceMutationOptions = Apollo.BaseMutationOptions<
    UserSyncBalanceMutation,
    UserSyncBalanceMutationVariables
>;
export const GetHomeDataDocument = gql`
    query GetHomeData {
        poolGetFeaturedPoolGroups {
            ...GqlPoolFeaturedPoolGroup
        }
        contentGetNewsItems {
            id
            text
            image
            url
            source
            timestamp
            discussionUrl
        }
    }
    ${GqlPoolFeaturedPoolGroupFragmentDoc}
`;

/**
 * __useGetHomeDataQuery__
 *
 * To run a query within a React component, call `useGetHomeDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHomeDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetHomeDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetHomeDataQuery(
    baseOptions?: Apollo.QueryHookOptions<GetHomeDataQuery, GetHomeDataQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetHomeDataQuery, GetHomeDataQueryVariables>(GetHomeDataDocument, options);
}
export function useGetHomeDataLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetHomeDataQuery, GetHomeDataQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetHomeDataQuery, GetHomeDataQueryVariables>(GetHomeDataDocument, options);
}
export type GetHomeDataQueryHookResult = ReturnType<typeof useGetHomeDataQuery>;
export type GetHomeDataLazyQueryHookResult = ReturnType<typeof useGetHomeDataLazyQuery>;
export type GetHomeDataQueryResult = Apollo.QueryResult<GetHomeDataQuery, GetHomeDataQueryVariables>;
export const GetHomeFeaturedPoolsDocument = gql`
    query GetHomeFeaturedPools {
        featuredPoolGroups: poolGetFeaturedPoolGroups {
            ...GqlPoolFeaturedPoolGroup
        }
    }
    ${GqlPoolFeaturedPoolGroupFragmentDoc}
`;

/**
 * __useGetHomeFeaturedPoolsQuery__
 *
 * To run a query within a React component, call `useGetHomeFeaturedPoolsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHomeFeaturedPoolsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetHomeFeaturedPoolsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetHomeFeaturedPoolsQuery(
    baseOptions?: Apollo.QueryHookOptions<GetHomeFeaturedPoolsQuery, GetHomeFeaturedPoolsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetHomeFeaturedPoolsQuery, GetHomeFeaturedPoolsQueryVariables>(
        GetHomeFeaturedPoolsDocument,
        options,
    );
}
export function useGetHomeFeaturedPoolsLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetHomeFeaturedPoolsQuery, GetHomeFeaturedPoolsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetHomeFeaturedPoolsQuery, GetHomeFeaturedPoolsQueryVariables>(
        GetHomeFeaturedPoolsDocument,
        options,
    );
}
export type GetHomeFeaturedPoolsQueryHookResult = ReturnType<typeof useGetHomeFeaturedPoolsQuery>;
export type GetHomeFeaturedPoolsLazyQueryHookResult = ReturnType<typeof useGetHomeFeaturedPoolsLazyQuery>;
export type GetHomeFeaturedPoolsQueryResult = Apollo.QueryResult<
    GetHomeFeaturedPoolsQuery,
    GetHomeFeaturedPoolsQueryVariables
>;
export const GetHomeNewsItemsDocument = gql`
    query GetHomeNewsItems {
        newsItems: contentGetNewsItems {
            id
            text
            image
            url
            source
            timestamp
            discussionUrl
        }
    }
`;

/**
 * __useGetHomeNewsItemsQuery__
 *
 * To run a query within a React component, call `useGetHomeNewsItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHomeNewsItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetHomeNewsItemsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetHomeNewsItemsQuery(
    baseOptions?: Apollo.QueryHookOptions<GetHomeNewsItemsQuery, GetHomeNewsItemsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetHomeNewsItemsQuery, GetHomeNewsItemsQueryVariables>(GetHomeNewsItemsDocument, options);
}
export function useGetHomeNewsItemsLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetHomeNewsItemsQuery, GetHomeNewsItemsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetHomeNewsItemsQuery, GetHomeNewsItemsQueryVariables>(
        GetHomeNewsItemsDocument,
        options,
    );
}
export type GetHomeNewsItemsQueryHookResult = ReturnType<typeof useGetHomeNewsItemsQuery>;
export type GetHomeNewsItemsLazyQueryHookResult = ReturnType<typeof useGetHomeNewsItemsLazyQuery>;
export type GetHomeNewsItemsQueryResult = Apollo.QueryResult<GetHomeNewsItemsQuery, GetHomeNewsItemsQueryVariables>;
export const GetLinearPoolsDocument = gql`
    query GetLinearPools {
        pools: poolGetLinearPools {
            ...GqlPoolLinear
        }
    }
    ${GqlPoolLinearFragmentDoc}
`;

/**
 * __useGetLinearPoolsQuery__
 *
 * To run a query within a React component, call `useGetLinearPoolsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLinearPoolsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLinearPoolsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLinearPoolsQuery(
    baseOptions?: Apollo.QueryHookOptions<GetLinearPoolsQuery, GetLinearPoolsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetLinearPoolsQuery, GetLinearPoolsQueryVariables>(GetLinearPoolsDocument, options);
}
export function useGetLinearPoolsLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetLinearPoolsQuery, GetLinearPoolsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetLinearPoolsQuery, GetLinearPoolsQueryVariables>(GetLinearPoolsDocument, options);
}
export type GetLinearPoolsQueryHookResult = ReturnType<typeof useGetLinearPoolsQuery>;
export type GetLinearPoolsLazyQueryHookResult = ReturnType<typeof useGetLinearPoolsLazyQuery>;
export type GetLinearPoolsQueryResult = Apollo.QueryResult<GetLinearPoolsQuery, GetLinearPoolsQueryVariables>;
export const GetPoolDocument = gql`
    query GetPool($id: String!) {
        pool: poolGetPool(id: $id) {
            id
            address
            name
            owner
            decimals
            factory
            symbol
            createTime
            version
            dynamicData {
                poolId
                swapEnabled
                totalLiquidity
                totalLiquidity24hAgo
                totalShares
                totalShares24hAgo
                fees24h
                swapFee
                volume24h
                fees48h
                volume48h
                lifetimeVolume
                lifetimeSwapFees
                holdersCount
                swapsCount
                sharePriceAth
                sharePriceAthTimestamp
                sharePriceAtl
                sharePriceAtlTimestamp
                totalLiquidityAth
                totalLiquidityAthTimestamp
                totalLiquidityAtl
                totalLiquidityAtlTimestamp
                volume24hAth
                volume24hAthTimestamp
                volume24hAtl
                volume24hAtlTimestamp
                fees24hAth
                fees24hAthTimestamp
                fees24hAtl
                fees24hAtlTimestamp
                apr {
                    hasRewardApr
                    thirdPartyApr {
                        ... on GqlPoolAprTotal {
                            total
                        }
                        ... on GqlPoolAprRange {
                            min
                            max
                        }
                    }
                    nativeRewardApr {
                        ... on GqlPoolAprTotal {
                            total
                        }
                        ... on GqlPoolAprRange {
                            min
                            max
                        }
                    }
                    swapApr
                    apr {
                        ... on GqlPoolAprTotal {
                            total
                        }
                        ... on GqlPoolAprRange {
                            min
                            max
                        }
                    }
                    items {
                        id
                        title
                        apr {
                            ... on GqlPoolAprTotal {
                                total
                            }
                            ... on GqlPoolAprRange {
                                min
                                max
                            }
                        }
                        subItems {
                            id
                            title
                            apr {
                                ... on GqlPoolAprTotal {
                                    total
                                }
                                ... on GqlPoolAprRange {
                                    min
                                    max
                                }
                            }
                        }
                    }
                }
            }
            allTokens {
                id
                address
                name
                symbol
                decimals
                isNested
                isPhantomBpt
            }
            displayTokens {
                id
                address
                name
                weight
                symbol
                nestedTokens {
                    id
                    address
                    name
                    weight
                    symbol
                }
            }
            staking {
                id
                type
                address
                farm {
                    id
                    beetsPerBlock
                    rewarders {
                        id
                        address
                        tokenAddress
                        rewardPerSecond
                    }
                }
                gauge {
                    id
                    gaugeAddress
                    version
                    status
                    otherGauges {
                        gaugeAddress
                        version
                        status
                        id
                        rewards {
                            id
                            tokenAddress
                            rewardPerSecond
                        }
                    }
                    rewards {
                        id
                        rewardPerSecond
                        tokenAddress
                    }
                    workingSupply
                }
                reliquary {
                    levels {
                        level
                        balance
                        apr
                        allocationPoints
                    }
                    beetsPerSecond
                    totalBalance
                }
            }
            investConfig {
                singleAssetEnabled
                proportionalEnabled
                options {
                    poolTokenIndex
                    poolTokenAddress
                    tokenOptions {
                        ... on GqlPoolToken {
                            ...GqlPoolToken
                        }
                    }
                }
            }
            withdrawConfig {
                singleAssetEnabled
                proportionalEnabled
                options {
                    poolTokenIndex
                    poolTokenAddress
                    tokenOptions {
                        ... on GqlPoolToken {
                            ...GqlPoolToken
                        }
                    }
                }
            }
            ... on GqlPoolWeighted {
                nestingType
                tokens {
                    ... on GqlPoolToken {
                        ...GqlPoolToken
                    }
                    ... on GqlPoolTokenLinear {
                        ...GqlPoolTokenLinear
                    }
                    ... on GqlPoolTokenComposableStable {
                        ...GqlPoolTokenComposableStable
                    }
                }
            }
            ... on GqlPoolStable {
                amp
                tokens {
                    ... on GqlPoolToken {
                        ...GqlPoolToken
                    }
                }
            }
            ... on GqlPoolMetaStable {
                amp
                tokens {
                    ... on GqlPoolToken {
                        ...GqlPoolToken
                    }
                }
            }
            ... on GqlPoolElement {
                unitSeconds
                principalToken
                baseToken
                tokens {
                    ... on GqlPoolToken {
                        ...GqlPoolToken
                    }
                }
            }
            ... on GqlPoolComposableStable {
                amp
                nestingType
                tokens {
                    ... on GqlPoolToken {
                        ...GqlPoolToken
                    }
                    ... on GqlPoolTokenLinear {
                        ...GqlPoolTokenLinear
                    }
                    ... on GqlPoolTokenComposableStable {
                        ...GqlPoolTokenComposableStable
                    }
                }
            }
            ... on GqlPoolLinear {
                mainIndex
                wrappedIndex
                lowerTarget
                upperTarget
                tokens {
                    ... on GqlPoolToken {
                        ...GqlPoolToken
                    }
                }
            }
            ... on GqlPoolLiquidityBootstrapping {
                name
                nestingType
                tokens {
                    ... on GqlPoolToken {
                        ...GqlPoolToken
                    }
                    ... on GqlPoolTokenLinear {
                        ...GqlPoolTokenLinear
                    }
                    ... on GqlPoolTokenComposableStable {
                        ...GqlPoolTokenComposableStable
                    }
                }
            }
            ... on GqlPoolGyro {
                alpha
                beta
                type
                nestingType
                tokens {
                    ... on GqlPoolToken {
                        ...GqlPoolToken
                    }
                }
            }
        }
    }
    ${GqlPoolTokenFragmentDoc}
    ${GqlPoolTokenLinearFragmentDoc}
    ${GqlPoolTokenComposableStableFragmentDoc}
`;

/**
 * __useGetPoolQuery__
 *
 * To run a query within a React component, call `useGetPoolQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPoolQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPoolQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPoolQuery(baseOptions: Apollo.QueryHookOptions<GetPoolQuery, GetPoolQueryVariables>) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetPoolQuery, GetPoolQueryVariables>(GetPoolDocument, options);
}
export function useGetPoolLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPoolQuery, GetPoolQueryVariables>) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetPoolQuery, GetPoolQueryVariables>(GetPoolDocument, options);
}
export type GetPoolQueryHookResult = ReturnType<typeof useGetPoolQuery>;
export type GetPoolLazyQueryHookResult = ReturnType<typeof useGetPoolLazyQuery>;
export type GetPoolQueryResult = Apollo.QueryResult<GetPoolQuery, GetPoolQueryVariables>;
export const GetPoolSwapsDocument = gql`
    query GetPoolSwaps($first: Int, $skip: Int, $where: GqlPoolSwapFilter) {
        swaps: poolGetSwaps(first: $first, skip: $skip, where: $where) {
            id
            poolId
            timestamp
            tokenAmountIn
            tokenAmountOut
            tokenIn
            tokenOut
            tx
            userAddress
            valueUSD
        }
    }
`;

/**
 * __useGetPoolSwapsQuery__
 *
 * To run a query within a React component, call `useGetPoolSwapsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPoolSwapsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPoolSwapsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetPoolSwapsQuery(
    baseOptions?: Apollo.QueryHookOptions<GetPoolSwapsQuery, GetPoolSwapsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetPoolSwapsQuery, GetPoolSwapsQueryVariables>(GetPoolSwapsDocument, options);
}
export function useGetPoolSwapsLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetPoolSwapsQuery, GetPoolSwapsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetPoolSwapsQuery, GetPoolSwapsQueryVariables>(GetPoolSwapsDocument, options);
}
export type GetPoolSwapsQueryHookResult = ReturnType<typeof useGetPoolSwapsQuery>;
export type GetPoolSwapsLazyQueryHookResult = ReturnType<typeof useGetPoolSwapsLazyQuery>;
export type GetPoolSwapsQueryResult = Apollo.QueryResult<GetPoolSwapsQuery, GetPoolSwapsQueryVariables>;
export const GetPoolJoinExitsDocument = gql`
    query GetPoolJoinExits($first: Int, $skip: Int, $poolId: String!) {
        joinExits: poolGetJoinExits(first: $first, skip: $skip, where: { poolIdIn: [$poolId] }) {
            id
            timestamp
            tx
            type
            poolId
            valueUSD
            amounts {
                address
                amount
            }
        }
    }
`;

/**
 * __useGetPoolJoinExitsQuery__
 *
 * To run a query within a React component, call `useGetPoolJoinExitsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPoolJoinExitsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPoolJoinExitsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      poolId: // value for 'poolId'
 *   },
 * });
 */
export function useGetPoolJoinExitsQuery(
    baseOptions: Apollo.QueryHookOptions<GetPoolJoinExitsQuery, GetPoolJoinExitsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetPoolJoinExitsQuery, GetPoolJoinExitsQueryVariables>(GetPoolJoinExitsDocument, options);
}
export function useGetPoolJoinExitsLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetPoolJoinExitsQuery, GetPoolJoinExitsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetPoolJoinExitsQuery, GetPoolJoinExitsQueryVariables>(
        GetPoolJoinExitsDocument,
        options,
    );
}
export type GetPoolJoinExitsQueryHookResult = ReturnType<typeof useGetPoolJoinExitsQuery>;
export type GetPoolJoinExitsLazyQueryHookResult = ReturnType<typeof useGetPoolJoinExitsLazyQuery>;
export type GetPoolJoinExitsQueryResult = Apollo.QueryResult<GetPoolJoinExitsQuery, GetPoolJoinExitsQueryVariables>;
export const GetPoolBptPriceChartDataDocument = gql`
    query GetPoolBptPriceChartData($address: String!, $range: GqlTokenChartDataRange!) {
        prices: tokenGetPriceChartData(address: $address, range: $range) {
            id
            price
            timestamp
        }
    }
`;

/**
 * __useGetPoolBptPriceChartDataQuery__
 *
 * To run a query within a React component, call `useGetPoolBptPriceChartDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPoolBptPriceChartDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPoolBptPriceChartDataQuery({
 *   variables: {
 *      address: // value for 'address'
 *      range: // value for 'range'
 *   },
 * });
 */
export function useGetPoolBptPriceChartDataQuery(
    baseOptions: Apollo.QueryHookOptions<GetPoolBptPriceChartDataQuery, GetPoolBptPriceChartDataQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetPoolBptPriceChartDataQuery, GetPoolBptPriceChartDataQueryVariables>(
        GetPoolBptPriceChartDataDocument,
        options,
    );
}
export function useGetPoolBptPriceChartDataLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetPoolBptPriceChartDataQuery, GetPoolBptPriceChartDataQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetPoolBptPriceChartDataQuery, GetPoolBptPriceChartDataQueryVariables>(
        GetPoolBptPriceChartDataDocument,
        options,
    );
}
export type GetPoolBptPriceChartDataQueryHookResult = ReturnType<typeof useGetPoolBptPriceChartDataQuery>;
export type GetPoolBptPriceChartDataLazyQueryHookResult = ReturnType<typeof useGetPoolBptPriceChartDataLazyQuery>;
export type GetPoolBptPriceChartDataQueryResult = Apollo.QueryResult<
    GetPoolBptPriceChartDataQuery,
    GetPoolBptPriceChartDataQueryVariables
>;
export const GetPoolUserJoinExitsDocument = gql`
    query GetPoolUserJoinExits($first: Int, $skip: Int, $poolId: String!) {
        joinExits: userGetPoolJoinExits(poolId: $poolId, first: $first, skip: $skip) {
            id
            timestamp
            tx
            type
            poolId
            valueUSD
            amounts {
                address
                amount
            }
        }
    }
`;

/**
 * __useGetPoolUserJoinExitsQuery__
 *
 * To run a query within a React component, call `useGetPoolUserJoinExitsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPoolUserJoinExitsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPoolUserJoinExitsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      poolId: // value for 'poolId'
 *   },
 * });
 */
export function useGetPoolUserJoinExitsQuery(
    baseOptions: Apollo.QueryHookOptions<GetPoolUserJoinExitsQuery, GetPoolUserJoinExitsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetPoolUserJoinExitsQuery, GetPoolUserJoinExitsQueryVariables>(
        GetPoolUserJoinExitsDocument,
        options,
    );
}
export function useGetPoolUserJoinExitsLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetPoolUserJoinExitsQuery, GetPoolUserJoinExitsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetPoolUserJoinExitsQuery, GetPoolUserJoinExitsQueryVariables>(
        GetPoolUserJoinExitsDocument,
        options,
    );
}
export type GetPoolUserJoinExitsQueryHookResult = ReturnType<typeof useGetPoolUserJoinExitsQuery>;
export type GetPoolUserJoinExitsLazyQueryHookResult = ReturnType<typeof useGetPoolUserJoinExitsLazyQuery>;
export type GetPoolUserJoinExitsQueryResult = Apollo.QueryResult<
    GetPoolUserJoinExitsQuery,
    GetPoolUserJoinExitsQueryVariables
>;
export const GetUserSwapsDocument = gql`
    query GetUserSwaps($first: Int, $skip: Int, $poolId: String!) {
        swaps: userGetSwaps(first: $first, skip: $skip, poolId: $poolId) {
            id
            poolId
            timestamp
            tokenAmountIn
            tokenAmountOut
            tokenIn
            tokenOut
            tx
            valueUSD
        }
    }
`;

/**
 * __useGetUserSwapsQuery__
 *
 * To run a query within a React component, call `useGetUserSwapsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserSwapsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserSwapsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      poolId: // value for 'poolId'
 *   },
 * });
 */
export function useGetUserSwapsQuery(
    baseOptions: Apollo.QueryHookOptions<GetUserSwapsQuery, GetUserSwapsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetUserSwapsQuery, GetUserSwapsQueryVariables>(GetUserSwapsDocument, options);
}
export function useGetUserSwapsLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetUserSwapsQuery, GetUserSwapsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetUserSwapsQuery, GetUserSwapsQueryVariables>(GetUserSwapsDocument, options);
}
export type GetUserSwapsQueryHookResult = ReturnType<typeof useGetUserSwapsQuery>;
export type GetUserSwapsLazyQueryHookResult = ReturnType<typeof useGetUserSwapsLazyQuery>;
export type GetUserSwapsQueryResult = Apollo.QueryResult<GetUserSwapsQuery, GetUserSwapsQueryVariables>;
export const GetPoolSnapshotsDocument = gql`
    query GetPoolSnapshots($poolId: String!, $range: GqlPoolSnapshotDataRange!) {
        snapshots: poolGetSnapshots(id: $poolId, range: $range) {
            id
            timestamp
            totalLiquidity
            volume24h
            fees24h
            sharePrice
        }
    }
`;

/**
 * __useGetPoolSnapshotsQuery__
 *
 * To run a query within a React component, call `useGetPoolSnapshotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPoolSnapshotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPoolSnapshotsQuery({
 *   variables: {
 *      poolId: // value for 'poolId'
 *      range: // value for 'range'
 *   },
 * });
 */
export function useGetPoolSnapshotsQuery(
    baseOptions: Apollo.QueryHookOptions<GetPoolSnapshotsQuery, GetPoolSnapshotsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetPoolSnapshotsQuery, GetPoolSnapshotsQueryVariables>(GetPoolSnapshotsDocument, options);
}
export function useGetPoolSnapshotsLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetPoolSnapshotsQuery, GetPoolSnapshotsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetPoolSnapshotsQuery, GetPoolSnapshotsQueryVariables>(
        GetPoolSnapshotsDocument,
        options,
    );
}
export type GetPoolSnapshotsQueryHookResult = ReturnType<typeof useGetPoolSnapshotsQuery>;
export type GetPoolSnapshotsLazyQueryHookResult = ReturnType<typeof useGetPoolSnapshotsLazyQuery>;
export type GetPoolSnapshotsQueryResult = Apollo.QueryResult<GetPoolSnapshotsQuery, GetPoolSnapshotsQueryVariables>;
export const GetPoolTokensDynamicDataDocument = gql`
    query GetPoolTokensDynamicData($addresses: [String!]!) {
        staticData: tokenGetTokensData(addresses: $addresses) {
            id
            tokenAddress
            description
            discordUrl
            telegramUrl
            twitterUsername
            websiteUrl
        }
        dynamicData: tokenGetTokensDynamicData(addresses: $addresses) {
            ...GqlTokenDynamicData
        }
    }
    ${GqlTokenDynamicDataFragmentDoc}
`;

/**
 * __useGetPoolTokensDynamicDataQuery__
 *
 * To run a query within a React component, call `useGetPoolTokensDynamicDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPoolTokensDynamicDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPoolTokensDynamicDataQuery({
 *   variables: {
 *      addresses: // value for 'addresses'
 *   },
 * });
 */
export function useGetPoolTokensDynamicDataQuery(
    baseOptions: Apollo.QueryHookOptions<GetPoolTokensDynamicDataQuery, GetPoolTokensDynamicDataQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetPoolTokensDynamicDataQuery, GetPoolTokensDynamicDataQueryVariables>(
        GetPoolTokensDynamicDataDocument,
        options,
    );
}
export function useGetPoolTokensDynamicDataLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetPoolTokensDynamicDataQuery, GetPoolTokensDynamicDataQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetPoolTokensDynamicDataQuery, GetPoolTokensDynamicDataQueryVariables>(
        GetPoolTokensDynamicDataDocument,
        options,
    );
}
export type GetPoolTokensDynamicDataQueryHookResult = ReturnType<typeof useGetPoolTokensDynamicDataQuery>;
export type GetPoolTokensDynamicDataLazyQueryHookResult = ReturnType<typeof useGetPoolTokensDynamicDataLazyQuery>;
export type GetPoolTokensDynamicDataQueryResult = Apollo.QueryResult<
    GetPoolTokensDynamicDataQuery,
    GetPoolTokensDynamicDataQueryVariables
>;
export const GetPoolsDocument = gql`
    query GetPools(
        $first: Int
        $skip: Int
        $orderBy: GqlPoolOrderBy
        $orderDirection: GqlPoolOrderDirection
        $where: GqlPoolFilter
        $textSearch: String
    ) {
        poolGetPools(
            first: $first
            skip: $skip
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: $where
            textSearch: $textSearch
        ) {
            ...GqlPoolMinimal
        }
        count: poolGetPoolsCount(
            first: $first
            skip: $skip
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: $where
            textSearch: $textSearch
        )
    }
    ${GqlPoolMinimalFragmentDoc}
`;

/**
 * __useGetPoolsQuery__
 *
 * To run a query within a React component, call `useGetPoolsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPoolsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPoolsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *      where: // value for 'where'
 *      textSearch: // value for 'textSearch'
 *   },
 * });
 */
export function useGetPoolsQuery(baseOptions?: Apollo.QueryHookOptions<GetPoolsQuery, GetPoolsQueryVariables>) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetPoolsQuery, GetPoolsQueryVariables>(GetPoolsDocument, options);
}
export function useGetPoolsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPoolsQuery, GetPoolsQueryVariables>) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetPoolsQuery, GetPoolsQueryVariables>(GetPoolsDocument, options);
}
export type GetPoolsQueryHookResult = ReturnType<typeof useGetPoolsQuery>;
export type GetPoolsLazyQueryHookResult = ReturnType<typeof useGetPoolsLazyQuery>;
export type GetPoolsQueryResult = Apollo.QueryResult<GetPoolsQuery, GetPoolsQueryVariables>;
export const GetReliquaryFarmSnapshotsDocument = gql`
    query GetReliquaryFarmSnapshots($id: String!, $range: GqlPoolSnapshotDataRange!) {
        snapshots: beetsPoolGetReliquaryFarmSnapshots(id: $id, range: $range) {
            id
            farmId
            timestamp
            totalBalance
            totalLiquidity
            levelBalances {
                id
                level
                balance
            }
            relicCount
            totalBalance
            userCount
            tokenBalances {
                id
                address
                balance
                symbol
            }
        }
    }
`;

/**
 * __useGetReliquaryFarmSnapshotsQuery__
 *
 * To run a query within a React component, call `useGetReliquaryFarmSnapshotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReliquaryFarmSnapshotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReliquaryFarmSnapshotsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      range: // value for 'range'
 *   },
 * });
 */
export function useGetReliquaryFarmSnapshotsQuery(
    baseOptions: Apollo.QueryHookOptions<GetReliquaryFarmSnapshotsQuery, GetReliquaryFarmSnapshotsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetReliquaryFarmSnapshotsQuery, GetReliquaryFarmSnapshotsQueryVariables>(
        GetReliquaryFarmSnapshotsDocument,
        options,
    );
}
export function useGetReliquaryFarmSnapshotsLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetReliquaryFarmSnapshotsQuery, GetReliquaryFarmSnapshotsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetReliquaryFarmSnapshotsQuery, GetReliquaryFarmSnapshotsQueryVariables>(
        GetReliquaryFarmSnapshotsDocument,
        options,
    );
}
export type GetReliquaryFarmSnapshotsQueryHookResult = ReturnType<typeof useGetReliquaryFarmSnapshotsQuery>;
export type GetReliquaryFarmSnapshotsLazyQueryHookResult = ReturnType<typeof useGetReliquaryFarmSnapshotsLazyQuery>;
export type GetReliquaryFarmSnapshotsQueryResult = Apollo.QueryResult<
    GetReliquaryFarmSnapshotsQuery,
    GetReliquaryFarmSnapshotsQueryVariables
>;
export const SftmxGetStakingDataDocument = gql`
    query SftmxGetStakingData {
        sftmxGetStakingData {
            exchangeRate
            maintenancePaused
            maxDepositLimit
            minDepositLimit
            numberOfVaults
            stakingApr
            totalFtmAmount
            totalFtmAmountInPool
            totalFtmAmountStaked
            undelegatePaused
            withdrawPaused
            withdrawalDelay
            numberOfVaults
            vaults {
                ftmAmountStaked
                isMatured
                unlockTimestamp
                validatorAddress
                validatorId
                vaultAddress
                vaultIndex
            }
        }
    }
`;

/**
 * __useSftmxGetStakingDataQuery__
 *
 * To run a query within a React component, call `useSftmxGetStakingDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useSftmxGetStakingDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSftmxGetStakingDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useSftmxGetStakingDataQuery(
    baseOptions?: Apollo.QueryHookOptions<SftmxGetStakingDataQuery, SftmxGetStakingDataQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<SftmxGetStakingDataQuery, SftmxGetStakingDataQueryVariables>(
        SftmxGetStakingDataDocument,
        options,
    );
}
export function useSftmxGetStakingDataLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<SftmxGetStakingDataQuery, SftmxGetStakingDataQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<SftmxGetStakingDataQuery, SftmxGetStakingDataQueryVariables>(
        SftmxGetStakingDataDocument,
        options,
    );
}
export type SftmxGetStakingDataQueryHookResult = ReturnType<typeof useSftmxGetStakingDataQuery>;
export type SftmxGetStakingDataLazyQueryHookResult = ReturnType<typeof useSftmxGetStakingDataLazyQuery>;
export type SftmxGetStakingDataQueryResult = Apollo.QueryResult<
    SftmxGetStakingDataQuery,
    SftmxGetStakingDataQueryVariables
>;
export const SftmxGetWithdrawalRequestsDocument = gql`
    query SftmxGetWithdrawalRequests($user: String!) {
        sftmxGetWithdrawalRequests(user: $user) {
            amountSftmx
            id
            isWithdrawn
            requestTimestamp
            user
        }
    }
`;

/**
 * __useSftmxGetWithdrawalRequestsQuery__
 *
 * To run a query within a React component, call `useSftmxGetWithdrawalRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSftmxGetWithdrawalRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSftmxGetWithdrawalRequestsQuery({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useSftmxGetWithdrawalRequestsQuery(
    baseOptions: Apollo.QueryHookOptions<SftmxGetWithdrawalRequestsQuery, SftmxGetWithdrawalRequestsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<SftmxGetWithdrawalRequestsQuery, SftmxGetWithdrawalRequestsQueryVariables>(
        SftmxGetWithdrawalRequestsDocument,
        options,
    );
}
export function useSftmxGetWithdrawalRequestsLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<
        SftmxGetWithdrawalRequestsQuery,
        SftmxGetWithdrawalRequestsQueryVariables
    >,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<SftmxGetWithdrawalRequestsQuery, SftmxGetWithdrawalRequestsQueryVariables>(
        SftmxGetWithdrawalRequestsDocument,
        options,
    );
}
export type SftmxGetWithdrawalRequestsQueryHookResult = ReturnType<typeof useSftmxGetWithdrawalRequestsQuery>;
export type SftmxGetWithdrawalRequestsLazyQueryHookResult = ReturnType<typeof useSftmxGetWithdrawalRequestsLazyQuery>;
export type SftmxGetWithdrawalRequestsQueryResult = Apollo.QueryResult<
    SftmxGetWithdrawalRequestsQuery,
    SftmxGetWithdrawalRequestsQueryVariables
>;
export const SftmxGetStakingSnapshotsDocument = gql`
    query SftmxGetStakingSnapshots($range: GqlSftmxStakingSnapshotDataRange!) {
        snapshots: sftmxGetStakingSnapshots(range: $range) {
            exchangeRate
            id
            timestamp
            totalFtmAmount
            totalFtmAmountInPool
            totalFtmAmountStaked
        }
    }
`;

/**
 * __useSftmxGetStakingSnapshotsQuery__
 *
 * To run a query within a React component, call `useSftmxGetStakingSnapshotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSftmxGetStakingSnapshotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSftmxGetStakingSnapshotsQuery({
 *   variables: {
 *      range: // value for 'range'
 *   },
 * });
 */
export function useSftmxGetStakingSnapshotsQuery(
    baseOptions: Apollo.QueryHookOptions<SftmxGetStakingSnapshotsQuery, SftmxGetStakingSnapshotsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<SftmxGetStakingSnapshotsQuery, SftmxGetStakingSnapshotsQueryVariables>(
        SftmxGetStakingSnapshotsDocument,
        options,
    );
}
export function useSftmxGetStakingSnapshotsLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<SftmxGetStakingSnapshotsQuery, SftmxGetStakingSnapshotsQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<SftmxGetStakingSnapshotsQuery, SftmxGetStakingSnapshotsQueryVariables>(
        SftmxGetStakingSnapshotsDocument,
        options,
    );
}
export type SftmxGetStakingSnapshotsQueryHookResult = ReturnType<typeof useSftmxGetStakingSnapshotsQuery>;
export type SftmxGetStakingSnapshotsLazyQueryHookResult = ReturnType<typeof useSftmxGetStakingSnapshotsLazyQuery>;
export type SftmxGetStakingSnapshotsQueryResult = Apollo.QueryResult<
    SftmxGetStakingSnapshotsQuery,
    SftmxGetStakingSnapshotsQueryVariables
>;
export const GetTokenRelativePriceChartDataDocument = gql`
    query GetTokenRelativePriceChartData($tokenIn: String!, $tokenOut: String!, $range: GqlTokenChartDataRange!) {
        prices: tokenGetRelativePriceChartData(tokenIn: $tokenIn, tokenOut: $tokenOut, range: $range) {
            id
            price
            timestamp
        }
    }
`;

/**
 * __useGetTokenRelativePriceChartDataQuery__
 *
 * To run a query within a React component, call `useGetTokenRelativePriceChartDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTokenRelativePriceChartDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTokenRelativePriceChartDataQuery({
 *   variables: {
 *      tokenIn: // value for 'tokenIn'
 *      tokenOut: // value for 'tokenOut'
 *      range: // value for 'range'
 *   },
 * });
 */
export function useGetTokenRelativePriceChartDataQuery(
    baseOptions: Apollo.QueryHookOptions<
        GetTokenRelativePriceChartDataQuery,
        GetTokenRelativePriceChartDataQueryVariables
    >,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetTokenRelativePriceChartDataQuery, GetTokenRelativePriceChartDataQueryVariables>(
        GetTokenRelativePriceChartDataDocument,
        options,
    );
}
export function useGetTokenRelativePriceChartDataLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<
        GetTokenRelativePriceChartDataQuery,
        GetTokenRelativePriceChartDataQueryVariables
    >,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetTokenRelativePriceChartDataQuery, GetTokenRelativePriceChartDataQueryVariables>(
        GetTokenRelativePriceChartDataDocument,
        options,
    );
}
export type GetTokenRelativePriceChartDataQueryHookResult = ReturnType<typeof useGetTokenRelativePriceChartDataQuery>;
export type GetTokenRelativePriceChartDataLazyQueryHookResult = ReturnType<
    typeof useGetTokenRelativePriceChartDataLazyQuery
>;
export type GetTokenRelativePriceChartDataQueryResult = Apollo.QueryResult<
    GetTokenRelativePriceChartDataQuery,
    GetTokenRelativePriceChartDataQueryVariables
>;
export const GetSorSwapsDocument = gql`
    query GetSorSwaps(
        $tokenIn: String!
        $tokenOut: String!
        $swapType: GqlSorSwapType!
        $swapAmount: BigDecimal!
        $swapOptions: GqlSorSwapOptionsInput!
    ) {
        swaps: sorGetSwaps(
            tokenIn: $tokenIn
            tokenOut: $tokenOut
            swapType: $swapType
            swapAmount: $swapAmount
            swapOptions: $swapOptions
        ) {
            ...GqlSorGetSwapsResponse
        }
    }
    ${GqlSorGetSwapsResponseFragmentDoc}
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
 *      tokenIn: // value for 'tokenIn'
 *      tokenOut: // value for 'tokenOut'
 *      swapType: // value for 'swapType'
 *      swapAmount: // value for 'swapAmount'
 *      swapOptions: // value for 'swapOptions'
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
export const GetTradeSelectedTokenDataDocument = gql`
    query GetTradeSelectedTokenData($tokenIn: String!, $tokenOut: String!) {
        tokenInData: tokenGetTokenData(address: $tokenIn) {
            id
            tokenAddress
            description
            discordUrl
            telegramUrl
            twitterUsername
        }
        tokenOutData: tokenGetTokenData(address: $tokenOut) {
            id
            tokenAddress
            description
            discordUrl
            telegramUrl
            twitterUsername
        }
        tokenInDynamicData: tokenGetTokenDynamicData(address: $tokenIn) {
            ...GqlTokenDynamicData
        }
        tokenOutDynamicData: tokenGetTokenDynamicData(address: $tokenOut) {
            ...GqlTokenDynamicData
        }
    }
    ${GqlTokenDynamicDataFragmentDoc}
`;

/**
 * __useGetTradeSelectedTokenDataQuery__
 *
 * To run a query within a React component, call `useGetTradeSelectedTokenDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTradeSelectedTokenDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTradeSelectedTokenDataQuery({
 *   variables: {
 *      tokenIn: // value for 'tokenIn'
 *      tokenOut: // value for 'tokenOut'
 *   },
 * });
 */
export function useGetTradeSelectedTokenDataQuery(
    baseOptions: Apollo.QueryHookOptions<GetTradeSelectedTokenDataQuery, GetTradeSelectedTokenDataQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<GetTradeSelectedTokenDataQuery, GetTradeSelectedTokenDataQueryVariables>(
        GetTradeSelectedTokenDataDocument,
        options,
    );
}
export function useGetTradeSelectedTokenDataLazyQuery(
    baseOptions?: Apollo.LazyQueryHookOptions<GetTradeSelectedTokenDataQuery, GetTradeSelectedTokenDataQueryVariables>,
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<GetTradeSelectedTokenDataQuery, GetTradeSelectedTokenDataQueryVariables>(
        GetTradeSelectedTokenDataDocument,
        options,
    );
}
export type GetTradeSelectedTokenDataQueryHookResult = ReturnType<typeof useGetTradeSelectedTokenDataQuery>;
export type GetTradeSelectedTokenDataLazyQueryHookResult = ReturnType<typeof useGetTradeSelectedTokenDataLazyQuery>;
export type GetTradeSelectedTokenDataQueryResult = Apollo.QueryResult<
    GetTradeSelectedTokenDataQuery,
    GetTradeSelectedTokenDataQueryVariables
>;
