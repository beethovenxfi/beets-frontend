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
    JSON: any;
}

/** The review data for the ERC4626 token */
export interface Erc4626ReviewData {
    __typename: 'Erc4626ReviewData';
    /** The filename of the review of the ERC4626 */
    reviewFile: Scalars['String'];
    /** A summary of the ERC4626 review, usually just says safe or unsafe */
    summary: Scalars['String'];
    /** Warnings associated with the ERC4626 */
    warnings: Array<Scalars['String']>;
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
    | 'FRAXTAL'
    | 'GNOSIS'
    | 'MAINNET'
    | 'MODE'
    | 'OPTIMISM'
    | 'POLYGON'
    | 'SEPOLIA'
    | 'SONIC'
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
    updatedAt: Scalars['Int'];
    updatedBy?: Maybe<Scalars['String']>;
}

/** Hook data */
export interface GqlHook {
    __typename: 'GqlHook';
    address: Scalars['String'];
    /** Data points changing over time */
    dynamicData?: Maybe<GqlHookData>;
    /** True when hook can change the amounts send to the vault. Necessary to deduct the fees. */
    enableHookAdjustedAmounts: Scalars['Boolean'];
    /** The review for this hook if applicable. */
    reviewData?: Maybe<GqlHookReviewData>;
    shouldCallAfterAddLiquidity: Scalars['Boolean'];
    shouldCallAfterInitialize: Scalars['Boolean'];
    shouldCallAfterRemoveLiquidity: Scalars['Boolean'];
    shouldCallAfterSwap: Scalars['Boolean'];
    shouldCallBeforeAddLiquidity: Scalars['Boolean'];
    shouldCallBeforeInitialize: Scalars['Boolean'];
    shouldCallBeforeRemoveLiquidity: Scalars['Boolean'];
    shouldCallBeforeSwap: Scalars['Boolean'];
    shouldCallComputeDynamicSwapFee: Scalars['Boolean'];
}

/** Collection of hook specific data. Percentage format is 0.01 -> 0.01%. */
export interface GqlHookData {
    __typename: 'GqlHookData';
    addLiquidityFeePercentage?: Maybe<Scalars['String']>;
    maxSurgeFeePercentage?: Maybe<Scalars['String']>;
    removeLiquidityFeePercentage?: Maybe<Scalars['String']>;
    surgeThresholdPercentage?: Maybe<Scalars['String']>;
    swapFeePercentage?: Maybe<Scalars['String']>;
}

/** Represents the review data for the hook */
export interface GqlHookReviewData {
    __typename: 'GqlHookReviewData';
    /** The filename of the review of the hook */
    reviewFile: Scalars['String'];
    /** A summary of the hook review, usually just says safe or unsafe */
    summary: Scalars['String'];
    /** Warnings associated with the hook */
    warnings: Array<Scalars['String']>;
}

export interface GqlLatestSyncedBlocks {
    __typename: 'GqlLatestSyncedBlocks';
    poolSyncBlock: Scalars['BigInt'];
    userStakeSyncBlock: Scalars['BigInt'];
    userWalletSyncBlock: Scalars['BigInt'];
}

/** All info on the nested pool if the token is a BPT. It will only support 1 level of nesting. */
export interface GqlNestedPool {
    __typename: 'GqlNestedPool';
    /** Address of the pool. */
    address: Scalars['Bytes'];
    /** Price rate of this pool or the Balancer Pool Token (BPT). */
    bptPriceRate: Scalars['BigDecimal'];
    /** Timestamp of when the pool was created. */
    createTime: Scalars['Int'];
    /** Address of the factory contract that created the pool, if applicable. */
    factory?: Maybe<Scalars['Bytes']>;
    /** Hook assigned to a pool */
    hook?: Maybe<GqlHook>;
    /** Unique identifier of the pool. */
    id: Scalars['ID'];
    /** Liquidity management settings for v3 pools. */
    liquidityManagement?: Maybe<LiquidityManagement>;
    /** Name of the pool. */
    name: Scalars['String'];
    /** Total liquidity of the parent pool in the nested pool in USD. */
    nestedLiquidity: Scalars['BigDecimal'];
    /** Percentage of the parents pool shares inside the nested pool. */
    nestedPercentage: Scalars['BigDecimal'];
    /** Number of shares of the parent pool in the nested pool. */
    nestedShares: Scalars['BigDecimal'];
    /**
     * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
     * @deprecated Use swapFeeManager instead
     */
    owner?: Maybe<Scalars['Bytes']>;
    /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
    pauseManager?: Maybe<Scalars['Bytes']>;
    /** Account empowered to set the pool creator fee percentage */
    poolCreator?: Maybe<Scalars['Bytes']>;
    /** Fee charged for swapping tokens in the pool as %. 0.01 -> 0.01% */
    swapFee: Scalars['BigDecimal'];
    /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
    swapFeeManager?: Maybe<Scalars['Bytes']>;
    /** Symbol of the pool. */
    symbol: Scalars['String'];
    /** List of all tokens in the pool. */
    tokens: Array<GqlPoolTokenDetail>;
    /** Total liquidity in the pool in USD. */
    totalLiquidity: Scalars['BigDecimal'];
    /** Total number of shares in the pool. */
    totalShares: Scalars['BigDecimal'];
    /** Type of the pool. */
    type: GqlPoolType;
    /** Version of the pool. */
    version: Scalars['Int'];
}

/** Represents an event that occurs when liquidity is added or removed from a pool. */
export interface GqlPoolAddRemoveEventV3 extends GqlPoolEvent {
    __typename: 'GqlPoolAddRemoveEventV3';
    /** The block number of the event. */
    blockNumber: Scalars['Int'];
    /** The block timestamp of the event. */
    blockTimestamp: Scalars['Int'];
    /** The chain on which the event occurred. */
    chain: GqlChain;
    /** The unique identifier of the event. */
    id: Scalars['ID'];
    /** The log index of the event. */
    logIndex: Scalars['Int'];
    /** The pool ID associated with the event. */
    poolId: Scalars['String'];
    /** The sender of the event. */
    sender: Scalars['String'];
    /** The timestamp of the event. */
    timestamp: Scalars['Int'];
    /** The tokens involved in the event. Ordered by poolToken index. */
    tokens: Array<GqlPoolEventAmount>;
    /** The transaction hash of the event. */
    tx: Scalars['String'];
    /** The type of the event. */
    type: GqlPoolEventType;
    /** The user address associated with the event. */
    userAddress: Scalars['String'];
    /** The value of the event in USD. */
    valueUSD: Scalars['Float'];
}

export interface GqlPoolAggregator {
    __typename: 'GqlPoolAggregator';
    /** The contract address of the pool. */
    address: Scalars['Bytes'];
    /** Data specific to gyro/fx pools */
    alpha?: Maybe<Scalars['String']>;
    /** Data specific to stable pools */
    amp?: Maybe<Scalars['BigInt']>;
    /** Data specific to gyro/fx pools */
    beta?: Maybe<Scalars['String']>;
    /** Data specific to gyro pools */
    c?: Maybe<Scalars['String']>;
    /** The chain on which the pool is deployed */
    chain: GqlChain;
    /** The timestamp the pool was created. */
    createTime: Scalars['Int'];
    /** Data specific to gyro pools */
    dSq?: Maybe<Scalars['String']>;
    /** The decimals of the BPT, usually 18 */
    decimals: Scalars['Int'];
    /** Data specific to fx pools */
    delta?: Maybe<Scalars['String']>;
    /** Dynamic data such as token balances, swap fees or volume */
    dynamicData: GqlPoolDynamicData;
    /** Data specific to fx pools */
    epsilon?: Maybe<Scalars['String']>;
    /** The factory contract address from which the pool was created. */
    factory?: Maybe<Scalars['Bytes']>;
    /** Hook assigned to a pool */
    hook?: Maybe<GqlHook>;
    /** The pool id. This is equal to the address for protocolVersion 3 pools */
    id: Scalars['ID'];
    /** Data specific to gyro/fx pools */
    lambda?: Maybe<Scalars['String']>;
    /** Liquidity management settings for v3 pools. */
    liquidityManagement?: Maybe<LiquidityManagement>;
    /** The name of the pool as per contract */
    name: Scalars['String'];
    /**
     * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
     * @deprecated Use swapFeeManager instead
     */
    owner?: Maybe<Scalars['Bytes']>;
    /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
    pauseManager?: Maybe<Scalars['Bytes']>;
    /** Account empowered to set the pool creator fee percentage */
    poolCreator?: Maybe<Scalars['Bytes']>;
    /** Returns all pool tokens, including BPTs and nested pools if there are any. Only one nested level deep. */
    poolTokens: Array<GqlPoolTokenDetail>;
    /** The protocol version on which the pool is deployed, 1, 2 or 3 */
    protocolVersion: Scalars['Int'];
    /** Data specific to gyro pools */
    root3Alpha?: Maybe<Scalars['String']>;
    /** Data specific to gyro pools */
    s?: Maybe<Scalars['String']>;
    /** Data specific to gyro pools */
    sqrtAlpha?: Maybe<Scalars['String']>;
    /** Data specific to gyro pools */
    sqrtBeta?: Maybe<Scalars['String']>;
    /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
    swapFeeManager?: Maybe<Scalars['Bytes']>;
    /** The token symbol of the pool as per contract */
    symbol: Scalars['String'];
    /** Data specific to gyro pools */
    tauAlphaX?: Maybe<Scalars['String']>;
    /** Data specific to gyro pools */
    tauAlphaY?: Maybe<Scalars['String']>;
    /** Data specific to gyro pools */
    tauBetaX?: Maybe<Scalars['String']>;
    /** Data specific to gyro pools */
    tauBetaY?: Maybe<Scalars['String']>;
    /** The pool type, such as weighted, stable, etc. */
    type: GqlPoolType;
    /** Data specific to gyro pools */
    u?: Maybe<Scalars['String']>;
    /** Data specific to gyro pools */
    v?: Maybe<Scalars['String']>;
    /** The version of the pool type. */
    version: Scalars['Int'];
    /** Data specific to gyro pools */
    w?: Maybe<Scalars['String']>;
    /** Data specific to gyro pools */
    z?: Maybe<Scalars['String']>;
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

/** All APRs for a pool */
export interface GqlPoolAprItem {
    __typename: 'GqlPoolAprItem';
    /** The APR value in % -> 0.2 = 0.2% */
    apr: Scalars['Float'];
    /** The id of the APR item */
    id: Scalars['ID'];
    /** The reward token address, if the APR originates from token emissions */
    rewardTokenAddress?: Maybe<Scalars['String']>;
    /** The reward token symbol, if the APR originates from token emissions */
    rewardTokenSymbol?: Maybe<Scalars['String']>;
    /**
     * The title of the APR item, a human readable form
     * @deprecated No replacement, should be built client side
     */
    title: Scalars['String'];
    /** Specific type of this APR */
    type: GqlPoolAprItemType;
}

/** Enum representing the different types of the APR in a pool. */
export type GqlPoolAprItemType =
    /** APR that pools earns when BPT is staked on AURA. */
    | 'AURA'
    /** Represents the yield from an IB (Interest-Bearing) asset APR in a pool. */
    | 'IB_YIELD'
    /** APR in a pool that can be earned through locking, i.e. veBAL */
    | 'LOCKING'
    /** Reward APR in a pool from maBEETS emissions allocated by gauge votes. Emitted in BEETS. */
    | 'MABEETS_EMISSIONS'
    /** Rewards distributed by merkl.xyz */
    | 'MERKL'
    /** Represents if the APR items comes from a nested pool. */
    | 'NESTED'
    /** Staking reward APR in a pool from a reward token. */
    | 'STAKING'
    /** APR boost that can be earned, i.e. via veBAL or maBEETS. */
    | 'STAKING_BOOST'
    /** Cow AMM specific APR */
    | 'SURPLUS'
    /** Surplus APR based on data from the last 7d */
    | 'SURPLUS_7D'
    /** Surplus APR based on data from the last 24h */
    | 'SURPLUS_24H'
    /** Surplus APR based on data from the last 30d */
    | 'SURPLUS_30D'
    /** Represents the swap fee APR in a pool. */
    | 'SWAP_FEE'
    /** Swap fee APR based on data from the last 7d */
    | 'SWAP_FEE_7D'
    /** Swap fee APR based on data from the last 24h */
    | 'SWAP_FEE_24H'
    /** Swap fee APR based on data from the last 30d */
    | 'SWAP_FEE_30D'
    /** Reward APR in a pool from veBAL emissions allocated by gauge votes. Emitted in BAL. */
    | 'VEBAL_EMISSIONS'
    /** APR that can be earned thourgh voting, i.e. gauge votes */
    | 'VOTING';

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

/** The base type as returned by poolGetPool (specific pool query) */
export interface GqlPoolBase {
    /** The contract address of the pool. */
    address: Scalars['Bytes'];
    /**
     * Returns all pool tokens, including any nested tokens and phantom BPTs as a flattened array.
     * @deprecated Use poolTokens instead
     */
    allTokens: Array<GqlPoolTokenExpanded>;
    /** List of categories assigned by the team based on external factors */
    categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
    /** The chain on which the pool is deployed */
    chain: GqlChain;
    /** The timestamp the pool was created. */
    createTime: Scalars['Int'];
    /** The decimals of the BPT, usually 18 */
    decimals: Scalars['Int'];
    /**
     * Only returns main tokens, also known as leave tokens. Wont return any nested BPTs. Used for displaying the tokens that the pool consists of.
     * @deprecated Use poolTokens instead
     */
    displayTokens: Array<GqlPoolTokenDisplay>;
    /** Dynamic data such as token balances, swap fees or volume */
    dynamicData: GqlPoolDynamicData;
    /** The factory contract address from which the pool was created. */
    factory?: Maybe<Scalars['Bytes']>;
    /** Whether at least one token in this pool is considered an ERC4626 token and the buffer is allowed. */
    hasAnyAllowedBuffer: Scalars['Boolean'];
    /** Whether at least one token in this pool is considered an ERC4626 token. */
    hasErc4626: Scalars['Boolean'];
    /** Whether at least one token in a nested pool is considered an ERC4626 token. */
    hasNestedErc4626: Scalars['Boolean'];
    /** Hook assigned to a pool */
    hook?: Maybe<GqlHook>;
    /** The pool id. This is equal to the address for protocolVersion 3 pools */
    id: Scalars['ID'];
    /**
     * Deprecated
     * @deprecated Removed without replacement
     */
    investConfig: GqlPoolInvestConfig;
    /** Liquidity management settings for v3 pools. */
    liquidityManagement?: Maybe<LiquidityManagement>;
    /** The name of the pool as per contract */
    name: Scalars['String'];
    /**
     * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
     * @deprecated Use swapFeeManager instead
     */
    owner?: Maybe<Scalars['Bytes']>;
    /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
    pauseManager?: Maybe<Scalars['Bytes']>;
    /** Account empowered to set the pool creator fee percentage */
    poolCreator?: Maybe<Scalars['Bytes']>;
    /** Returns pool tokens, including BPTs and nested pools and their pool tokens if there are any. Only one nested level deep. */
    poolTokens: Array<GqlPoolTokenDetail>;
    /** The protocol version on which the pool is deployed, 1, 2 or 3 */
    protocolVersion: Scalars['Int'];
    /** Staking options of this pool which emit additional rewards */
    staking?: Maybe<GqlPoolStaking>;
    /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
    swapFeeManager?: Maybe<Scalars['Bytes']>;
    /** The token symbol of the pool as per contract */
    symbol: Scalars['String'];
    /** List of tags assigned by the team based on external factors */
    tags?: Maybe<Array<Maybe<Scalars['String']>>>;
    /** The pool type, such as weighted, stable, etc. */
    type: GqlPoolType;
    /** If a user address was provided in the query, the user balance is populated here */
    userBalance?: Maybe<GqlPoolUserBalance>;
    /**
     * The vault version on which the pool is deployed, 2 or 3
     * @deprecated use protocolVersion instead
     */
    vaultVersion: Scalars['Int'];
    /** The version of the pool type. */
    version: Scalars['Int'];
    /**
     * Deprecated
     * @deprecated Removed without replacement
     */
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
    pool: PoolForBatchSwap;
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
    /** @deprecated Use poolTokens instead */
    allTokens: Array<GqlPoolTokenExpanded>;
    amp: Scalars['BigInt'];
    bptPriceRate: Scalars['BigDecimal'];
    categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
    chain: GqlChain;
    createTime: Scalars['Int'];
    decimals: Scalars['Int'];
    /** @deprecated Use poolTokens instead */
    displayTokens: Array<GqlPoolTokenDisplay>;
    dynamicData: GqlPoolDynamicData;
    factory?: Maybe<Scalars['Bytes']>;
    hasAnyAllowedBuffer: Scalars['Boolean'];
    hasErc4626: Scalars['Boolean'];
    hasNestedErc4626: Scalars['Boolean'];
    hook?: Maybe<GqlHook>;
    id: Scalars['ID'];
    /** @deprecated Removed without replacement */
    investConfig: GqlPoolInvestConfig;
    liquidityManagement?: Maybe<LiquidityManagement>;
    name: Scalars['String'];
    /** @deprecated Removed without replacement */
    nestingType: GqlPoolNestingType;
    /**
     * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
     * @deprecated Use swapFeeManager instead
     */
    owner?: Maybe<Scalars['Bytes']>;
    /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
    pauseManager?: Maybe<Scalars['Bytes']>;
    /** Account empowered to set the pool creator fee percentage */
    poolCreator?: Maybe<Scalars['Bytes']>;
    poolTokens: Array<GqlPoolTokenDetail>;
    protocolVersion: Scalars['Int'];
    staking?: Maybe<GqlPoolStaking>;
    /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
    swapFeeManager?: Maybe<Scalars['Bytes']>;
    symbol: Scalars['String'];
    tags?: Maybe<Array<Maybe<Scalars['String']>>>;
    /**
     * All tokens of the pool. If it is a nested pool, the nested pool is expanded with its own tokens again.
     * @deprecated Use poolTokens instead
     */
    tokens: Array<GqlPoolTokenUnion>;
    type: GqlPoolType;
    userBalance?: Maybe<GqlPoolUserBalance>;
    /** @deprecated use protocolVersion instead */
    vaultVersion: Scalars['Int'];
    version: Scalars['Int'];
    /** @deprecated Removed without replacement */
    withdrawConfig: GqlPoolWithdrawConfig;
}

export interface GqlPoolComposableStableNested {
    __typename: 'GqlPoolComposableStableNested';
    address: Scalars['Bytes'];
    amp: Scalars['BigInt'];
    bptPriceRate: Scalars['BigDecimal'];
    categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
    createTime: Scalars['Int'];
    factory?: Maybe<Scalars['Bytes']>;
    id: Scalars['ID'];
    name: Scalars['String'];
    /** @deprecated Removed without replacement */
    nestingType: GqlPoolNestingType;
    /**
     * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
     * @deprecated Use swapFeeManager instead
     */
    owner?: Maybe<Scalars['Bytes']>;
    /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
    pauseManager?: Maybe<Scalars['Bytes']>;
    /** Account empowered to set the pool creator fee percentage */
    poolCreator?: Maybe<Scalars['Bytes']>;
    swapFee: Scalars['BigDecimal'];
    /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
    swapFeeManager?: Maybe<Scalars['Bytes']>;
    symbol: Scalars['String'];
    tags?: Maybe<Array<Maybe<Scalars['String']>>>;
    /** @deprecated Use poolTokens instead */
    tokens: Array<GqlPoolTokenComposableStableNestedUnion>;
    totalLiquidity: Scalars['BigDecimal'];
    totalShares: Scalars['BigDecimal'];
    type: GqlPoolType;
    version: Scalars['Int'];
}

export interface GqlPoolDynamicData {
    __typename: 'GqlPoolDynamicData';
    /** Protocol and pool creator fees combined */
    aggregateSwapFee: Scalars['BigDecimal'];
    /** Protocol and pool creator fees combined */
    aggregateYieldFee: Scalars['BigDecimal'];
    /** @deprecated Use aprItems instead */
    apr: GqlPoolApr;
    aprItems: Array<GqlPoolAprItem>;
    fees24h: Scalars['BigDecimal'];
    fees24hAth: Scalars['BigDecimal'];
    fees24hAthTimestamp: Scalars['Int'];
    fees24hAtl: Scalars['BigDecimal'];
    fees24hAtlTimestamp: Scalars['Int'];
    fees48h: Scalars['BigDecimal'];
    holdersCount: Scalars['BigInt'];
    /** True for bricked pools */
    isInRecoveryMode: Scalars['Boolean'];
    isPaused: Scalars['Boolean'];
    lifetimeSwapFees: Scalars['BigDecimal'];
    lifetimeVolume: Scalars['BigDecimal'];
    poolId: Scalars['ID'];
    sharePriceAth: Scalars['BigDecimal'];
    sharePriceAthTimestamp: Scalars['Int'];
    sharePriceAtl: Scalars['BigDecimal'];
    sharePriceAtlTimestamp: Scalars['Int'];
    /** CowAmm specific, equivalent of swap fees */
    surplus24h: Scalars['BigDecimal'];
    /** CowAmm specific, equivalent of swap fees */
    surplus48h: Scalars['BigDecimal'];
    /** Disabled for bricked pools */
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
    totalSupply: Scalars['BigDecimal'];
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
    /** @deprecated Use poolTokens instead */
    allTokens: Array<GqlPoolTokenExpanded>;
    baseToken: Scalars['Bytes'];
    categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
    chain: GqlChain;
    createTime: Scalars['Int'];
    decimals: Scalars['Int'];
    /** @deprecated Use poolTokens instead */
    displayTokens: Array<GqlPoolTokenDisplay>;
    dynamicData: GqlPoolDynamicData;
    factory?: Maybe<Scalars['Bytes']>;
    hasAnyAllowedBuffer: Scalars['Boolean'];
    hasErc4626: Scalars['Boolean'];
    hasNestedErc4626: Scalars['Boolean'];
    hook?: Maybe<GqlHook>;
    id: Scalars['ID'];
    /** @deprecated Removed without replacement */
    investConfig: GqlPoolInvestConfig;
    liquidityManagement?: Maybe<LiquidityManagement>;
    name: Scalars['String'];
    /**
     * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
     * @deprecated Use swapFeeManager instead
     */
    owner?: Maybe<Scalars['Bytes']>;
    /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
    pauseManager?: Maybe<Scalars['Bytes']>;
    /** Account empowered to set the pool creator fee percentage */
    poolCreator?: Maybe<Scalars['Bytes']>;
    poolTokens: Array<GqlPoolTokenDetail>;
    principalToken: Scalars['Bytes'];
    protocolVersion: Scalars['Int'];
    staking?: Maybe<GqlPoolStaking>;
    /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
    swapFeeManager?: Maybe<Scalars['Bytes']>;
    symbol: Scalars['String'];
    tags?: Maybe<Array<Maybe<Scalars['String']>>>;
    /** @deprecated Use poolTokens instead */
    tokens: Array<GqlPoolToken>;
    type: GqlPoolType;
    unitSeconds: Scalars['BigInt'];
    userBalance?: Maybe<GqlPoolUserBalance>;
    /** @deprecated use protocolVersion instead */
    vaultVersion: Scalars['Int'];
    version: Scalars['Int'];
    /** @deprecated Removed without replacement */
    withdrawConfig: GqlPoolWithdrawConfig;
}

/** Represents an event that occurs in a pool. */
export interface GqlPoolEvent {
    /** The block number of the event. */
    blockNumber: Scalars['Int'];
    /** The block timestamp of the event. */
    blockTimestamp: Scalars['Int'];
    /** The chain on which the event occurred. */
    chain: GqlChain;
    /** The unique identifier of the event. */
    id: Scalars['ID'];
    /** The log index of the event. */
    logIndex: Scalars['Int'];
    /** The pool ID associated with the event. */
    poolId: Scalars['String'];
    /** The sender of the event. */
    sender: Scalars['String'];
    /** The timestamp of the event. */
    timestamp: Scalars['Int'];
    /** The transaction hash of the event. */
    tx: Scalars['String'];
    /** The type of the event. */
    type: GqlPoolEventType;
    /** The user address associated with the event. */
    userAddress: Scalars['String'];
    /** The USD value of this event. */
    valueUSD: Scalars['Float'];
}

export interface GqlPoolEventAmount {
    __typename: 'GqlPoolEventAmount';
    address: Scalars['String'];
    amount: Scalars['String'];
    valueUSD: Scalars['Float'];
}

export type GqlPoolEventType = 'ADD' | 'REMOVE' | 'SWAP';

export type GqlPoolEventsDataRange = 'NINETY_DAYS' | 'SEVEN_DAYS' | 'THIRTY_DAYS';

export interface GqlPoolEventsFilter {
    chainIn?: InputMaybe<Array<InputMaybe<GqlChain>>>;
    poolIdIn?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
    range?: InputMaybe<GqlPoolEventsDataRange>;
    typeIn?: InputMaybe<Array<InputMaybe<GqlPoolEventType>>>;
    userAddress?: InputMaybe<Scalars['String']>;
    /** USD value of the event */
    valueUSD_gt?: InputMaybe<Scalars['Float']>;
    /** USD value of the event */
    valueUSD_gte?: InputMaybe<Scalars['Float']>;
}

export interface GqlPoolFeaturedPool {
    __typename: 'GqlPoolFeaturedPool';
    description: Scalars['String'];
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
    chainIn?: InputMaybe<Array<GqlChain>>;
    chainNotIn?: InputMaybe<Array<GqlChain>>;
    createTime?: InputMaybe<GqlPoolTimePeriod>;
    filterIn?: InputMaybe<Array<Scalars['String']>>;
    filterNotIn?: InputMaybe<Array<Scalars['String']>>;
    hasHook?: InputMaybe<Scalars['Boolean']>;
    idIn?: InputMaybe<Array<Scalars['String']>>;
    idNotIn?: InputMaybe<Array<Scalars['String']>>;
    minTvl?: InputMaybe<Scalars['Float']>;
    poolTypeIn?: InputMaybe<Array<GqlPoolType>>;
    poolTypeNotIn?: InputMaybe<Array<GqlPoolType>>;
    protocolVersionIn?: InputMaybe<Array<Scalars['Int']>>;
    /**
     * For list of tags see: https://github.com/balancer/metadata/blob/main/pools/index.json
     * Use uppercase
     */
    tagIn?: InputMaybe<Array<Scalars['String']>>;
    /**
     * For list of tags see: https://github.com/balancer/metadata/blob/main/pools/index.json
     * Use uppercase
     */
    tagNotIn?: InputMaybe<Array<Scalars['String']>>;
    tokensIn?: InputMaybe<Array<Scalars['String']>>;
    tokensNotIn?: InputMaybe<Array<Scalars['String']>>;
    userAddress?: InputMaybe<Scalars['String']>;
}

export type GqlPoolFilterCategory =
    | 'BLACK_LISTED'
    | 'INCENTIVIZED'
    | 'LRT'
    | 'POINTS'
    | 'POINTS_EIGENLAYER'
    | 'POINTS_GYRO'
    | 'POINTS_KELP'
    | 'POINTS_RENZO'
    | 'POINTS_SWELL'
    | 'SUPERFEST';

export interface GqlPoolFx extends GqlPoolBase {
    __typename: 'GqlPoolFx';
    address: Scalars['Bytes'];
    /** @deprecated Use poolTokens instead */
    allTokens: Array<GqlPoolTokenExpanded>;
    alpha: Scalars['String'];
    beta: Scalars['String'];
    categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
    chain: GqlChain;
    createTime: Scalars['Int'];
    decimals: Scalars['Int'];
    delta: Scalars['String'];
    /** @deprecated Use poolTokens instead */
    displayTokens: Array<GqlPoolTokenDisplay>;
    dynamicData: GqlPoolDynamicData;
    epsilon: Scalars['String'];
    factory?: Maybe<Scalars['Bytes']>;
    hasAnyAllowedBuffer: Scalars['Boolean'];
    hasErc4626: Scalars['Boolean'];
    hasNestedErc4626: Scalars['Boolean'];
    hook?: Maybe<GqlHook>;
    id: Scalars['ID'];
    /** @deprecated Removed without replacement */
    investConfig: GqlPoolInvestConfig;
    lambda: Scalars['String'];
    liquidityManagement?: Maybe<LiquidityManagement>;
    name: Scalars['String'];
    /**
     * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
     * @deprecated Use swapFeeManager instead
     */
    owner?: Maybe<Scalars['Bytes']>;
    /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
    pauseManager?: Maybe<Scalars['Bytes']>;
    /** Account empowered to set the pool creator fee percentage */
    poolCreator?: Maybe<Scalars['Bytes']>;
    poolTokens: Array<GqlPoolTokenDetail>;
    protocolVersion: Scalars['Int'];
    staking?: Maybe<GqlPoolStaking>;
    /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
    swapFeeManager?: Maybe<Scalars['Bytes']>;
    symbol: Scalars['String'];
    tags?: Maybe<Array<Maybe<Scalars['String']>>>;
    /**
     * All tokens of the pool. If it is a nested pool, the nested pool is expanded with its own tokens again.
     * @deprecated Use poolTokens instead
     */
    tokens: Array<GqlPoolTokenUnion>;
    type: GqlPoolType;
    userBalance?: Maybe<GqlPoolUserBalance>;
    /** @deprecated use protocolVersion instead */
    vaultVersion: Scalars['Int'];
    version: Scalars['Int'];
    /** @deprecated Removed without replacement */
    withdrawConfig: GqlPoolWithdrawConfig;
}

export interface GqlPoolGyro extends GqlPoolBase {
    __typename: 'GqlPoolGyro';
    address: Scalars['Bytes'];
    /** @deprecated Use poolTokens instead */
    allTokens: Array<GqlPoolTokenExpanded>;
    alpha: Scalars['String'];
    beta: Scalars['String'];
    c: Scalars['String'];
    categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
    chain: GqlChain;
    createTime: Scalars['Int'];
    dSq: Scalars['String'];
    decimals: Scalars['Int'];
    /** @deprecated Use poolTokens instead */
    displayTokens: Array<GqlPoolTokenDisplay>;
    dynamicData: GqlPoolDynamicData;
    factory?: Maybe<Scalars['Bytes']>;
    hasAnyAllowedBuffer: Scalars['Boolean'];
    hasErc4626: Scalars['Boolean'];
    hasNestedErc4626: Scalars['Boolean'];
    hook?: Maybe<GqlHook>;
    id: Scalars['ID'];
    /** @deprecated Removed without replacement */
    investConfig: GqlPoolInvestConfig;
    lambda: Scalars['String'];
    liquidityManagement?: Maybe<LiquidityManagement>;
    name: Scalars['String'];
    /** @deprecated Removed without replacement */
    nestingType: GqlPoolNestingType;
    /**
     * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
     * @deprecated Use swapFeeManager instead
     */
    owner?: Maybe<Scalars['Bytes']>;
    /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
    pauseManager?: Maybe<Scalars['Bytes']>;
    /** Account empowered to set the pool creator fee percentage */
    poolCreator?: Maybe<Scalars['Bytes']>;
    poolTokens: Array<GqlPoolTokenDetail>;
    protocolVersion: Scalars['Int'];
    root3Alpha: Scalars['String'];
    s: Scalars['String'];
    sqrtAlpha: Scalars['String'];
    sqrtBeta: Scalars['String'];
    staking?: Maybe<GqlPoolStaking>;
    /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
    swapFeeManager?: Maybe<Scalars['Bytes']>;
    symbol: Scalars['String'];
    tags?: Maybe<Array<Maybe<Scalars['String']>>>;
    tauAlphaX: Scalars['String'];
    tauAlphaY: Scalars['String'];
    tauBetaX: Scalars['String'];
    tauBetaY: Scalars['String'];
    /**
     * All tokens of the pool. If it is a nested pool, the nested pool is expanded with its own tokens again.
     * @deprecated Use poolTokens instead
     */
    tokens: Array<GqlPoolTokenUnion>;
    type: GqlPoolType;
    u: Scalars['String'];
    userBalance?: Maybe<GqlPoolUserBalance>;
    v: Scalars['String'];
    /** @deprecated use protocolVersion instead */
    vaultVersion: Scalars['Int'];
    version: Scalars['Int'];
    w: Scalars['String'];
    /** @deprecated Removed without replacement */
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

export interface GqlPoolJoinExitFilter {
    chainIn?: InputMaybe<Array<GqlChain>>;
    poolIdIn?: InputMaybe<Array<Scalars['String']>>;
}

export type GqlPoolJoinExitType = 'Exit' | 'Join';

export interface GqlPoolLiquidityBootstrapping extends GqlPoolBase {
    __typename: 'GqlPoolLiquidityBootstrapping';
    address: Scalars['Bytes'];
    /** @deprecated Use poolTokens instead */
    allTokens: Array<GqlPoolTokenExpanded>;
    categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
    chain: GqlChain;
    createTime: Scalars['Int'];
    decimals: Scalars['Int'];
    /** @deprecated Use poolTokens instead */
    displayTokens: Array<GqlPoolTokenDisplay>;
    dynamicData: GqlPoolDynamicData;
    factory?: Maybe<Scalars['Bytes']>;
    hasAnyAllowedBuffer: Scalars['Boolean'];
    hasErc4626: Scalars['Boolean'];
    hasNestedErc4626: Scalars['Boolean'];
    hook?: Maybe<GqlHook>;
    id: Scalars['ID'];
    /** @deprecated Removed without replacement */
    investConfig: GqlPoolInvestConfig;
    liquidityManagement?: Maybe<LiquidityManagement>;
    name: Scalars['String'];
    /** @deprecated Removed without replacement */
    nestingType: GqlPoolNestingType;
    /**
     * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
     * @deprecated Use swapFeeManager instead
     */
    owner?: Maybe<Scalars['Bytes']>;
    /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
    pauseManager?: Maybe<Scalars['Bytes']>;
    /** Account empowered to set the pool creator fee percentage */
    poolCreator?: Maybe<Scalars['Bytes']>;
    poolTokens: Array<GqlPoolTokenDetail>;
    protocolVersion: Scalars['Int'];
    staking?: Maybe<GqlPoolStaking>;
    /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
    swapFeeManager?: Maybe<Scalars['Bytes']>;
    symbol: Scalars['String'];
    tags?: Maybe<Array<Maybe<Scalars['String']>>>;
    /**
     * All tokens of the pool. If it is a nested pool, the nested pool is expanded with its own tokens again.
     * @deprecated Use poolTokens instead
     */
    tokens: Array<GqlPoolTokenUnion>;
    type: GqlPoolType;
    userBalance?: Maybe<GqlPoolUserBalance>;
    /** @deprecated use protocolVersion instead */
    vaultVersion: Scalars['Int'];
    version: Scalars['Int'];
    /** @deprecated Removed without replacement */
    withdrawConfig: GqlPoolWithdrawConfig;
}

export interface GqlPoolMetaStable extends GqlPoolBase {
    __typename: 'GqlPoolMetaStable';
    address: Scalars['Bytes'];
    /** @deprecated Use poolTokens instead */
    allTokens: Array<GqlPoolTokenExpanded>;
    amp: Scalars['BigInt'];
    categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
    chain: GqlChain;
    createTime: Scalars['Int'];
    decimals: Scalars['Int'];
    /** @deprecated Use poolTokens instead */
    displayTokens: Array<GqlPoolTokenDisplay>;
    dynamicData: GqlPoolDynamicData;
    factory?: Maybe<Scalars['Bytes']>;
    hasAnyAllowedBuffer: Scalars['Boolean'];
    hasErc4626: Scalars['Boolean'];
    hasNestedErc4626: Scalars['Boolean'];
    hook?: Maybe<GqlHook>;
    id: Scalars['ID'];
    /** @deprecated Removed without replacement */
    investConfig: GqlPoolInvestConfig;
    liquidityManagement?: Maybe<LiquidityManagement>;
    name: Scalars['String'];
    /**
     * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
     * @deprecated Use swapFeeManager instead
     */
    owner?: Maybe<Scalars['Bytes']>;
    /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
    pauseManager?: Maybe<Scalars['Bytes']>;
    /** Account empowered to set the pool creator fee percentage */
    poolCreator?: Maybe<Scalars['Bytes']>;
    poolTokens: Array<GqlPoolTokenDetail>;
    protocolVersion: Scalars['Int'];
    staking?: Maybe<GqlPoolStaking>;
    /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
    swapFeeManager?: Maybe<Scalars['Bytes']>;
    symbol: Scalars['String'];
    tags?: Maybe<Array<Maybe<Scalars['String']>>>;
    /** @deprecated Use poolTokens instead */
    tokens: Array<GqlPoolToken>;
    type: GqlPoolType;
    userBalance?: Maybe<GqlPoolUserBalance>;
    /** @deprecated use protocolVersion instead */
    vaultVersion: Scalars['Int'];
    version: Scalars['Int'];
    /** @deprecated Removed without replacement */
    withdrawConfig: GqlPoolWithdrawConfig;
}

/** The pool schema returned for poolGetPools (pool list query) */
export interface GqlPoolMinimal {
    __typename: 'GqlPoolMinimal';
    /** The contract address of the pool. */
    address: Scalars['Bytes'];
    /**
     * Returns all pool tokens, including any nested tokens and phantom BPTs
     * @deprecated Use poolTokens instead
     */
    allTokens: Array<GqlPoolTokenExpanded>;
    /** List of categories assigned by the team based on external factors */
    categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
    /** The chain on which the pool is deployed */
    chain: GqlChain;
    /** The timestamp the pool was created. */
    createTime: Scalars['Int'];
    /** The decimals of the BPT, usually 18 */
    decimals: Scalars['Int'];
    /**
     * Only returns main or underlying tokens, also known as leave tokens. Wont return any nested BPTs. Used for displaying the tokens that the pool consists of.
     * @deprecated Use poolTokens instead
     */
    displayTokens: Array<GqlPoolTokenDisplay>;
    /** Dynamic data such as token balances, swap fees or volume */
    dynamicData: GqlPoolDynamicData;
    /** The factory contract address from which the pool was created. */
    factory?: Maybe<Scalars['Bytes']>;
    /** Whether at least one token in this pool is considered an ERC4626 token and the buffer is allowed. */
    hasAnyAllowedBuffer: Scalars['Boolean'];
    /** Whether at least one token in this pool is considered an ERC4626 token. */
    hasErc4626: Scalars['Boolean'];
    /** Whether at least one token in a nested pool is considered an ERC4626 token. */
    hasNestedErc4626: Scalars['Boolean'];
    /** Hook assigned to a pool */
    hook?: Maybe<GqlHook>;
    /** The pool id. This is equal to the address for protocolVersion 3 pools */
    id: Scalars['ID'];
    /** Pool is receiving rewards when liquidity tokens are staked */
    incentivized: Scalars['Boolean'];
    /** Liquidity management settings for v3 pools. */
    liquidityManagement?: Maybe<LiquidityManagement>;
    /** The name of the pool as per contract */
    name: Scalars['String'];
    /**
     * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
     * @deprecated Use swapFeeManager instead
     */
    owner?: Maybe<Scalars['Bytes']>;
    /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
    pauseManager?: Maybe<Scalars['Bytes']>;
    /** Account empowered to set the pool creator fee percentage */
    poolCreator?: Maybe<Scalars['Bytes']>;
    /** Returns all pool tokens, including BPTs and nested pools if there are any. Only one nested level deep. */
    poolTokens: Array<GqlPoolTokenDetail>;
    /** The protocol version on which the pool is deployed, 1, 2 or 3 */
    protocolVersion: Scalars['Int'];
    /** Staking options of this pool which emit additional rewards */
    staking?: Maybe<GqlPoolStaking>;
    /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
    swapFeeManager?: Maybe<Scalars['Bytes']>;
    /** The token symbol of the pool as per contract */
    symbol: Scalars['String'];
    /** List of tags assigned by the team based on external factors */
    tags?: Maybe<Array<Maybe<Scalars['String']>>>;
    /** The pool type, such as weighted, stable, etc. */
    type: GqlPoolType;
    /** If a user address was provided in the query, the user balance is populated here */
    userBalance?: Maybe<GqlPoolUserBalance>;
    /**
     * The vault version on which the pool is deployed, 2 or 3
     * @deprecated use protocolVersion instead
     */
    vaultVersion: Scalars['Int'];
    /** The version of the pool type. */
    version: Scalars['Int'];
}

/** Result of the poolReloadPools mutation */
export interface GqlPoolMutationResult {
    __typename: 'GqlPoolMutationResult';
    /** The chain that was reloaded. */
    chain: GqlChain;
    /** The error message */
    error?: Maybe<Scalars['String']>;
    /** Whether it was successful or not. */
    success: Scalars['Boolean'];
    /** The type of pools that were reloaded. */
    type: Scalars['String'];
}

export type GqlPoolNestedUnion = GqlPoolComposableStableNested;

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
    surplus24h: Scalars['String'];
    swapsCount: Scalars['String'];
    timestamp: Scalars['Int'];
    totalLiquidity: Scalars['String'];
    totalShares: Scalars['String'];
    totalSurplus: Scalars['String'];
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
    /** @deprecated Use poolTokens instead */
    allTokens: Array<GqlPoolTokenExpanded>;
    amp: Scalars['BigInt'];
    bptPriceRate: Scalars['BigDecimal'];
    categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
    chain: GqlChain;
    createTime: Scalars['Int'];
    decimals: Scalars['Int'];
    /** @deprecated Use poolTokens instead */
    displayTokens: Array<GqlPoolTokenDisplay>;
    dynamicData: GqlPoolDynamicData;
    factory?: Maybe<Scalars['Bytes']>;
    hasAnyAllowedBuffer: Scalars['Boolean'];
    hasErc4626: Scalars['Boolean'];
    hasNestedErc4626: Scalars['Boolean'];
    hook?: Maybe<GqlHook>;
    id: Scalars['ID'];
    /** @deprecated Removed without replacement */
    investConfig: GqlPoolInvestConfig;
    liquidityManagement?: Maybe<LiquidityManagement>;
    name: Scalars['String'];
    /**
     * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
     * @deprecated Use swapFeeManager instead
     */
    owner?: Maybe<Scalars['Bytes']>;
    /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
    pauseManager?: Maybe<Scalars['Bytes']>;
    /** Account empowered to set the pool creator fee percentage */
    poolCreator?: Maybe<Scalars['Bytes']>;
    poolTokens: Array<GqlPoolTokenDetail>;
    protocolVersion: Scalars['Int'];
    staking?: Maybe<GqlPoolStaking>;
    /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
    swapFeeManager?: Maybe<Scalars['Bytes']>;
    symbol: Scalars['String'];
    tags?: Maybe<Array<Maybe<Scalars['String']>>>;
    /** @deprecated Use poolTokens instead */
    tokens: Array<GqlPoolToken>;
    type: GqlPoolType;
    userBalance?: Maybe<GqlPoolUserBalance>;
    /** @deprecated use protocolVersion instead */
    vaultVersion: Scalars['Int'];
    version: Scalars['Int'];
    /** @deprecated Removed without replacement */
    withdrawConfig: GqlPoolWithdrawConfig;
}

export interface GqlPoolStaking {
    __typename: 'GqlPoolStaking';
    address: Scalars['String'];
    aura?: Maybe<GqlPoolStakingAura>;
    chain: GqlChain;
    farm?: Maybe<GqlPoolStakingMasterChefFarm>;
    gauge?: Maybe<GqlPoolStakingGauge>;
    id: Scalars['ID'];
    reliquary?: Maybe<GqlPoolStakingReliquaryFarm>;
    type: GqlPoolStakingType;
    vebal?: Maybe<GqlPoolStakingVebal>;
}

export interface GqlPoolStakingAura {
    __typename: 'GqlPoolStakingAura';
    apr: Scalars['Float'];
    auraPoolAddress: Scalars['String'];
    auraPoolId: Scalars['String'];
    id: Scalars['ID'];
    isShutdown: Scalars['Boolean'];
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

export type GqlPoolStakingType = 'AURA' | 'FRESH_BEETS' | 'GAUGE' | 'MASTER_CHEF' | 'RELIQUARY' | 'VEBAL';

export interface GqlPoolStakingVebal {
    __typename: 'GqlPoolStakingVebal';
    id: Scalars['ID'];
    vebalAddress: Scalars['String'];
}

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

/** Represents an event that occurs when a swap is made in a pool using the CowAmm protocol. */
export interface GqlPoolSwapEventCowAmm extends GqlPoolEvent {
    __typename: 'GqlPoolSwapEventCowAmm';
    /** The block number of the event. */
    blockNumber: Scalars['Int'];
    /** The block timestamp of the event. */
    blockTimestamp: Scalars['Int'];
    /** The chain on which the event occurred. */
    chain: GqlChain;
    /** The fee that this swap generated. */
    fee: GqlPoolEventAmount;
    /** The unique identifier of the event. */
    id: Scalars['ID'];
    /** The log index of the event. */
    logIndex: Scalars['Int'];
    /** The pool ID associated with the event. */
    poolId: Scalars['String'];
    /** The sender of the event. */
    sender: Scalars['String'];
    /** The surplus generated by the swap. */
    surplus: GqlPoolEventAmount;
    /** The timestamp of the event. */
    timestamp: Scalars['Int'];
    /** The token that was swapped in the event. */
    tokenIn: GqlPoolEventAmount;
    /** The token that was swapped out in the event. */
    tokenOut: GqlPoolEventAmount;
    /** The transaction hash of the event. */
    tx: Scalars['String'];
    /** The type of the event. */
    type: GqlPoolEventType;
    /** The user address associated with the event. */
    userAddress: Scalars['String'];
    /** The value of the event in USD. */
    valueUSD: Scalars['Float'];
}

/** Represents an event that occurs when a swap is made in a pool. */
export interface GqlPoolSwapEventV3 extends GqlPoolEvent {
    __typename: 'GqlPoolSwapEventV3';
    /** The block number of the event. */
    blockNumber: Scalars['Int'];
    /** The block timestamp of the event. */
    blockTimestamp: Scalars['Int'];
    /** The chain on which the event occurred. */
    chain: GqlChain;
    /** The fee that this swap generated. */
    fee: GqlPoolEventAmount;
    /** The unique identifier of the event. */
    id: Scalars['ID'];
    /** The log index of the event. */
    logIndex: Scalars['Int'];
    /** The pool ID associated with the event. */
    poolId: Scalars['String'];
    /** The sender of the event. */
    sender: Scalars['String'];
    /** The timestamp of the event. */
    timestamp: Scalars['Int'];
    /** The token that was swapped in the event. */
    tokenIn: GqlPoolEventAmount;
    /** The token that was swapped out in the event. */
    tokenOut: GqlPoolEventAmount;
    /** The transaction hash of the event. */
    tx: Scalars['String'];
    /** The type of the event. */
    type: GqlPoolEventType;
    /** The user address associated with the event. */
    userAddress: Scalars['String'];
    /** The value of the event in USD. */
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

export type GqlPoolTokenComposableStableNestedUnion = GqlPoolToken;

/**
 * All info on the pool token. It will also include the nested pool if the token is a BPT. It will only support 1 level of nesting.
 * A second (unsupported) level of nesting is shown by having hasNestedPool = true but nestedPool = null.
 */
export interface GqlPoolTokenDetail {
    __typename: 'GqlPoolTokenDetail';
    /** Address of the pool token. */
    address: Scalars['String'];
    /** Balance of the pool token inside the pool. */
    balance: Scalars['BigDecimal'];
    /** USD Balance of the pool token. */
    balanceUSD: Scalars['BigDecimal'];
    chain?: Maybe<GqlChain>;
    chainId?: Maybe<Scalars['Int']>;
    /** Coingecko ID */
    coingeckoId?: Maybe<Scalars['String']>;
    /** Decimals of the pool token. */
    decimals: Scalars['Int'];
    /** The ERC4626 review data for the token */
    erc4626ReviewData?: Maybe<Erc4626ReviewData>;
    /** Indicates whether this token is a BPT and therefor has a nested pool. */
    hasNestedPool: Scalars['Boolean'];
    /** Id of the token. A combination of pool id and token address. */
    id: Scalars['ID'];
    /** Index of the pool token in the pool as returned by the vault. */
    index: Scalars['Int'];
    /** Whether the token is in the allow list. */
    isAllowed: Scalars['Boolean'];
    /** If it is an ERC4626 token, this defines whether we allow it to use the buffer for pool operations. */
    isBufferAllowed: Scalars['Boolean'];
    /** Whether the token is considered an ERC4626 token. */
    isErc4626: Scalars['Boolean'];
    /** Token logo */
    logoURI?: Maybe<Scalars['String']>;
    /** Name of the pool token. */
    name: Scalars['String'];
    /** Additional data for the nested pool if the token is a BPT. Null otherwise. */
    nestedPool?: Maybe<GqlNestedPool>;
    /** If it is an appreciating token, it shows the current price rate. 1 otherwise. */
    priceRate: Scalars['BigDecimal'];
    /** The address of the price rate provider. */
    priceRateProvider?: Maybe<Scalars['String']>;
    /** Additional data for the price rate provider, such as reviews or warnings. */
    priceRateProviderData?: Maybe<GqlPriceRateProviderData>;
    /** The priority of the token, can be used for sorting. */
    priority?: Maybe<Scalars['Int']>;
    /** Conversion factor used to adjust for token decimals for uniform precision in calculations. V3 only. */
    scalingFactor?: Maybe<Scalars['BigDecimal']>;
    /** Symbol of the pool token. */
    symbol: Scalars['String'];
    /** Is the token tradable */
    tradable?: Maybe<Scalars['Boolean']>;
    /** If it is an ERC4626, this will be the underlying token if present in the API. */
    underlyingToken?: Maybe<GqlToken>;
    /** The weight of the token in the pool if it is a weighted pool, null otherwise */
    weight?: Maybe<Scalars['BigDecimal']>;
}

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
    isErc4626: Scalars['Boolean'];
    isMainToken: Scalars['Boolean'];
    isNested: Scalars['Boolean'];
    isPhantomBpt: Scalars['Boolean'];
    name: Scalars['String'];
    symbol: Scalars['String'];
    weight?: Maybe<Scalars['String']>;
}

export type GqlPoolTokenUnion = GqlPoolToken | GqlPoolTokenComposableStable;

/** Supported pool types */
export type GqlPoolType =
    | 'COMPOSABLE_STABLE'
    | 'COW_AMM'
    | 'ELEMENT'
    | 'FX'
    | 'GYRO'
    | 'GYRO3'
    | 'GYROE'
    | 'INVESTMENT'
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
    | GqlPoolLiquidityBootstrapping
    | GqlPoolMetaStable
    | GqlPoolStable
    | GqlPoolWeighted;

/** If a user address was provided in the query, the user balance is populated here */
export interface GqlPoolUserBalance {
    __typename: 'GqlPoolUserBalance';
    /** The staked BPT balances of the user. */
    stakedBalances: Array<GqlUserStakedBalance>;
    /** Total balance (wallet + staked) as float */
    totalBalance: Scalars['AmountHumanReadable'];
    /** Total balance (wallet + staked) in USD as float */
    totalBalanceUsd: Scalars['Float'];
    /** The wallet balance (BPT in wallet) as float. */
    walletBalance: Scalars['AmountHumanReadable'];
    /** The wallet balance (BPT in wallet) in USD as float. */
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
    /** @deprecated Use poolTokens instead */
    allTokens: Array<GqlPoolTokenExpanded>;
    categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
    chain: GqlChain;
    createTime: Scalars['Int'];
    decimals: Scalars['Int'];
    /** @deprecated Use poolTokens instead */
    displayTokens: Array<GqlPoolTokenDisplay>;
    dynamicData: GqlPoolDynamicData;
    factory?: Maybe<Scalars['Bytes']>;
    hasAnyAllowedBuffer: Scalars['Boolean'];
    hasErc4626: Scalars['Boolean'];
    hasNestedErc4626: Scalars['Boolean'];
    hook?: Maybe<GqlHook>;
    id: Scalars['ID'];
    /** @deprecated Removed without replacement */
    investConfig: GqlPoolInvestConfig;
    liquidityManagement?: Maybe<LiquidityManagement>;
    name: Scalars['String'];
    /** @deprecated Removed without replacement */
    nestingType: GqlPoolNestingType;
    /**
     * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
     * @deprecated Use swapFeeManager instead
     */
    owner?: Maybe<Scalars['Bytes']>;
    /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
    pauseManager?: Maybe<Scalars['Bytes']>;
    /** Account empowered to set the pool creator fee percentage */
    poolCreator?: Maybe<Scalars['Bytes']>;
    poolTokens: Array<GqlPoolTokenDetail>;
    protocolVersion: Scalars['Int'];
    staking?: Maybe<GqlPoolStaking>;
    /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
    swapFeeManager?: Maybe<Scalars['Bytes']>;
    symbol: Scalars['String'];
    tags?: Maybe<Array<Maybe<Scalars['String']>>>;
    /**
     * All tokens of the pool. If it is a nested pool, the nested pool is expanded with its own tokens again.
     * @deprecated Use poolTokens instead
     */
    tokens: Array<GqlPoolTokenUnion>;
    type: GqlPoolType;
    userBalance?: Maybe<GqlPoolUserBalance>;
    /** @deprecated use protocolVersion instead */
    vaultVersion: Scalars['Int'];
    version: Scalars['Int'];
    /** @deprecated Removed without replacement */
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

/** Represents the data of a price rate provider */
export interface GqlPriceRateProviderData {
    __typename: 'GqlPriceRateProviderData';
    /** The address of the price rate provider */
    address: Scalars['String'];
    /** The factory used to create the price rate provider, if applicable */
    factory?: Maybe<Scalars['String']>;
    /** The name of the price rate provider */
    name?: Maybe<Scalars['String']>;
    /** The filename of the review of the price rate provider */
    reviewFile?: Maybe<Scalars['String']>;
    /** Indicates if the price rate provider has been reviewed */
    reviewed: Scalars['Boolean'];
    /** A summary of the price rate provider, usually just says safe or unsafe */
    summary?: Maybe<Scalars['String']>;
    /** Upgradeable components of the price rate provider */
    upgradeableComponents?: Maybe<Array<Maybe<GqlPriceRateProviderUpgradeableComponent>>>;
    /** Warnings associated with the price rate provider */
    warnings?: Maybe<Array<Scalars['String']>>;
}

/** Represents an upgradeable component of a price rate provider */
export interface GqlPriceRateProviderUpgradeableComponent {
    __typename: 'GqlPriceRateProviderUpgradeableComponent';
    /** The entry point / proxy of the upgradeable component */
    entryPoint: Scalars['String'];
    /** Indicates if the implementation of the component has been reviewed */
    implementationReviewed: Scalars['String'];
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
    /**
     * Transaction data that can be posted to an RPC to execute the swap.
     * @deprecated Use Balancer SDK to build swap callData from SOR response
     */
    callData?: Maybe<GqlSorCallData>;
    /** The price of tokenOut in tokenIn. */
    effectivePrice: Scalars['AmountHumanReadable'];
    /** The price of tokenIn in tokenOut. */
    effectivePriceReversed: Scalars['AmountHumanReadable'];
    /** The found paths as needed as input for the b-sdk to execute the swap */
    paths: Array<GqlSorPath>;
    /** Price impact of the path */
    priceImpact: GqlPriceImpact;
    /** The version of the protocol these paths are from */
    protocolVersion: Scalars['Int'];
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
    /**
     * The version of the vault these paths are from
     * @deprecated Use protocolVersion instead
     */
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
    /** A sorted list of booleans that indicate if the respective pool is a buffer */
    isBuffer: Array<Scalars['Boolean']>;
    /** Output amount of this path in scaled form */
    outputAmountRaw: Scalars['String'];
    /** A sorted list of pool ids that are used in this path */
    pools: Array<Scalars['String']>;
    /** The version of the protocol these paths are from */
    protocolVersion: Scalars['Int'];
    /** A sorted list of tokens that are ussed in this path */
    tokens: Array<Token>;
    /**
     * Vault version of this path.
     * @deprecated Use protocolVersion instead
     */
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

export interface GqlStakedSonicData {
    __typename: 'GqlStakedSonicData';
    /** A list of all the delegated validators. */
    delegatedValidators: Array<GqlStakedSonicDelegatedValidator>;
    /** Current exchange rate for stS -> S */
    exchangeRate: Scalars['String'];
    /** The current rebasing APR for stS. */
    stakingApr: Scalars['String'];
    /** Total amount of S in custody of stS. Delegated S plus pool S. */
    totalAssets: Scalars['AmountHumanReadable'];
    /** Total amount of S elegated to validators. */
    totalAssetsDelegated: Scalars['AmountHumanReadable'];
    /** Total amount of S in the pool to be delegated. */
    totalAssetsPool: Scalars['AmountHumanReadable'];
}

export interface GqlStakedSonicDelegatedValidator {
    __typename: 'GqlStakedSonicDelegatedValidator';
    /** The amount of S that has been delegated to this validator. */
    assetsDelegated: Scalars['AmountHumanReadable'];
    /** The id of the validator. */
    validatorId: Scalars['String'];
}

export interface GqlStakedSonicSnapshot {
    __typename: 'GqlStakedSonicSnapshot';
    /** Current exchange rate for stS -> S */
    exchangeRate: Scalars['String'];
    id: Scalars['ID'];
    /** The timestamp of the snapshot. Timestamp is end of day midnight. */
    timestamp: Scalars['Int'];
    /** Total amount of S in custody of stS. Delegated S plus pool S. */
    totalAssets: Scalars['AmountHumanReadable'];
    /** Total amount of S delegated to validators. */
    totalAssetsDelegated: Scalars['AmountHumanReadable'];
    /** Total amount of S in the pool. */
    totalAssetsPool: Scalars['AmountHumanReadable'];
}

export type GqlStakedSonicSnapshotDataRange =
    | 'ALL_TIME'
    | 'NINETY_DAYS'
    | 'ONE_HUNDRED_EIGHTY_DAYS'
    | 'ONE_YEAR'
    | 'THIRTY_DAYS';

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

/** Represents a token in the system */
export interface GqlToken {
    __typename: 'GqlToken';
    /** The address of the token */
    address: Scalars['String'];
    /** The chain of the token */
    chain: GqlChain;
    /** The chain ID of the token */
    chainId: Scalars['Int'];
    /** The coingecko ID for this token, if present */
    coingeckoId?: Maybe<Scalars['String']>;
    /** The number of decimal places for the token */
    decimals: Scalars['Int'];
    /** The description of the token */
    description?: Maybe<Scalars['String']>;
    /** The Discord URL of the token */
    discordUrl?: Maybe<Scalars['String']>;
    /** The ERC4626 review data for the token */
    erc4626ReviewData?: Maybe<Erc4626ReviewData>;
    /** If it is an ERC4626 token, this defines whether we allow it to use the buffer for pool operations. */
    isBufferAllowed: Scalars['Boolean'];
    /** Whether the token is considered an ERC4626 token. */
    isErc4626: Scalars['Boolean'];
    /** The logo URI of the token */
    logoURI?: Maybe<Scalars['String']>;
    /** The name of the token */
    name: Scalars['String'];
    /** The rate provider data for the token */
    priceRateProviderData?: Maybe<GqlPriceRateProviderData>;
    /** The priority of the token, can be used for sorting. */
    priority: Scalars['Int'];
    /**
     * The rate provider data for the token
     * @deprecated Use priceRateProviderData instead
     */
    rateProviderData?: Maybe<GqlPriceRateProviderData>;
    /** The symbol of the token */
    symbol: Scalars['String'];
    /** The Telegram URL of the token */
    telegramUrl?: Maybe<Scalars['String']>;
    /** Indicates if the token is tradable */
    tradable: Scalars['Boolean'];
    /** The Twitter username of the token */
    twitterUsername?: Maybe<Scalars['String']>;
    /** The ERC4626 underlying token address, if applicable. */
    underlyingTokenAddress?: Maybe<Scalars['String']>;
    /** The website URL of the token */
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

/** Represents additional data for a token */
export interface GqlTokenDynamicData {
    __typename: 'GqlTokenDynamicData';
    /** The all-time high price of the token */
    ath: Scalars['Float'];
    /** The all-time low price of the token */
    atl: Scalars['Float'];
    /** The fully diluted valuation of the token */
    fdv?: Maybe<Scalars['String']>;
    /** The highest price in the last 24 hours */
    high24h: Scalars['Float'];
    /** The unique identifier of the dynamic data */
    id: Scalars['String'];
    /** The lowest price in the last 24 hours */
    low24h: Scalars['Float'];
    /** The market capitalization of the token */
    marketCap?: Maybe<Scalars['String']>;
    /** The current price of the token */
    price: Scalars['Float'];
    /** The price change in the last 24 hours */
    priceChange24h: Scalars['Float'];
    /** The percentage price change in the last 7 days */
    priceChangePercent7d?: Maybe<Scalars['Float']>;
    /** The percentage price change in the last 14 days */
    priceChangePercent14d?: Maybe<Scalars['Float']>;
    /** The percentage price change in the last 24 hours */
    priceChangePercent24h: Scalars['Float'];
    /** The percentage price change in the last 30 days */
    priceChangePercent30d?: Maybe<Scalars['Float']>;
    /** The address of the token */
    tokenAddress: Scalars['String'];
    /** The timestamp when the data was last updated */
    updatedAt: Scalars['String'];
}

/** Provide filters for tokens */
export interface GqlTokenFilter {
    /** Only return tokens with these addresses */
    tokensIn?: InputMaybe<Array<Scalars['String']>>;
}

/** Result of the poolReloadPools mutation */
export interface GqlTokenMutationResult {
    __typename: 'GqlTokenMutationResult';
    /** The chain that was reloaded. */
    chain: GqlChain;
    /** The error message */
    error?: Maybe<Scalars['String']>;
    /** Whether it was successful or not. */
    success: Scalars['Boolean'];
}

export interface GqlTokenPrice {
    __typename: 'GqlTokenPrice';
    address: Scalars['String'];
    chain: GqlChain;
    price: Scalars['Float'];
    updatedAt: Scalars['Int'];
    updatedBy?: Maybe<Scalars['String']>;
}

export interface GqlTokenPriceChartDataItem {
    __typename: 'GqlTokenPriceChartDataItem';
    id: Scalars['ID'];
    price: Scalars['AmountHumanReadable'];
    timestamp: Scalars['Int'];
}

export type GqlTokenType = 'BPT' | 'PHANTOM_BPT' | 'WHITE_LISTED';

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

export interface GqlUserStakedBalance {
    __typename: 'GqlUserStakedBalance';
    /** The staked BPT balance as float. */
    balance: Scalars['AmountHumanReadable'];
    /** The steaked BPT balance in USD as float. */
    balanceUsd: Scalars['Float'];
    /** The id of the staking to match with GqlPoolStaking.id. */
    stakingId: Scalars['String'];
    /** The staking type (Gauge, farm, aura, etc.) in which this balance is staked. */
    stakingType: GqlPoolStakingType;
}

export interface GqlUserSwapVolumeFilter {
    poolIdIn?: InputMaybe<Array<Scalars['String']>>;
    tokenInIn?: InputMaybe<Array<Scalars['String']>>;
    tokenOutIn?: InputMaybe<Array<Scalars['String']>>;
}

export interface GqlVeBalBalance {
    __typename: 'GqlVeBalBalance';
    balance: Scalars['AmountHumanReadable'];
    chain: GqlChain;
    locked: Scalars['AmountHumanReadable'];
    lockedUsd: Scalars['AmountHumanReadable'];
}

/** Represents a snapshot of a VeBal lock at a specific point in time. */
export interface GqlVeBalLockSnapshot {
    __typename: 'GqlVeBalLockSnapshot';
    /** The locked balance at that time. */
    balance: Scalars['AmountHumanReadable'];
    bias: Scalars['String'];
    slope: Scalars['String'];
    /** The timestamp of the snapshot, snapshots are taking at lock events. */
    timestamp: Scalars['Int'];
}

export interface GqlVeBalUserData {
    __typename: 'GqlVeBalUserData';
    balance: Scalars['AmountHumanReadable'];
    lockSnapshots: Array<GqlVeBalLockSnapshot>;
    locked: Scalars['AmountHumanReadable'];
    lockedUsd: Scalars['AmountHumanReadable'];
    rank?: Maybe<Scalars['Int']>;
}

/** The Gauge that can be voted on through veBAL and that will ultimately receive the rewards. */
export interface GqlVotingGauge {
    __typename: 'GqlVotingGauge';
    /** The timestamp the gauge was added. */
    addedTimestamp?: Maybe<Scalars['Int']>;
    /** The address of the root gauge on Ethereum mainnet. */
    address: Scalars['Bytes'];
    /** The address of the child gauge on the specific chain. */
    childGaugeAddress?: Maybe<Scalars['Bytes']>;
    /** Whether the gauge is killed or not. */
    isKilled: Scalars['Boolean'];
    /** The relative weight the gauge received this epoch (not more than 1.0). */
    relativeWeight: Scalars['String'];
    /** The relative weight cap. 1.0 for uncapped. */
    relativeWeightCap?: Maybe<Scalars['String']>;
}

/** A token inside of a pool with a voting gauge. */
export interface GqlVotingGaugeToken {
    __typename: 'GqlVotingGaugeToken';
    /** The address of the token. */
    address: Scalars['String'];
    /** The URL to the token logo. */
    logoURI: Scalars['String'];
    /** The symbol of the token. */
    symbol: Scalars['String'];
    /** If it is a weighted pool, the weigh of the token is shown here in %. 0.5 = 50%. */
    weight?: Maybe<Scalars['String']>;
}

/** The pool that can be voted on through veBAL */
export interface GqlVotingPool {
    __typename: 'GqlVotingPool';
    /** The address of the pool. */
    address: Scalars['Bytes'];
    /** The chain this pool is on. */
    chain: GqlChain;
    /** The gauge that is connected to the pool and that will receive the rewards. */
    gauge: GqlVotingGauge;
    /** Pool ID */
    id: Scalars['ID'];
    /** The symbol of the pool. */
    symbol: Scalars['String'];
    /** The tokens inside the pool. */
    tokens: Array<GqlVotingGaugeToken>;
    /** The type of the pool. */
    type: GqlPoolType;
}

/** Liquidity management settings for v3 pools. */
export interface LiquidityManagement {
    __typename: 'LiquidityManagement';
    /** Indicates whether this pool has disabled add and removes of unbalanced/non-proportional liquidity. Meaning it will only support proportional add and remove liquidity. */
    disableUnbalancedLiquidity?: Maybe<Scalars['Boolean']>;
    /** Whether this pool support additional, custom add liquditiy operations apart from proportional, unbalanced and single asset. */
    enableAddLiquidityCustom?: Maybe<Scalars['Boolean']>;
    /** Indicates whether donation is enabled. Meaning you can send funds to the pool without receiving a BPT. */
    enableDonation?: Maybe<Scalars['Boolean']>;
    /** Whether this pool support additional, custom remove liquditiy operations apart from proportional, unbalanced and single asset. */
    enableRemoveLiquidityCustom?: Maybe<Scalars['Boolean']>;
}

export interface Mutation {
    __typename: 'Mutation';
    beetsPoolLoadReliquarySnapshotsForAllFarms: Scalars['String'];
    beetsSyncFbeetsRatio: Scalars['String'];
    cacheAverageBlockTime: Scalars['String'];
    poolLoadOnChainDataForAllPools: Array<GqlPoolMutationResult>;
    poolLoadSnapshotsForPools: Scalars['String'];
    poolReloadAllPoolAprs: Scalars['String'];
    poolReloadPools: Array<GqlPoolMutationResult>;
    poolReloadStakingForAllPools: Scalars['String'];
    poolSyncAllCowSnapshots: Array<GqlPoolMutationResult>;
    poolSyncAllPoolsFromSubgraph: Array<Scalars['String']>;
    poolSyncFxQuoteTokens: Array<GqlPoolMutationResult>;
    poolUpdateLifetimeValuesForAllPools: Scalars['String'];
    poolUpdateLiquidityValuesForAllPools: Scalars['String'];
    protocolCacheMetrics: Scalars['String'];
    sftmxSyncStakingData: Scalars['String'];
    sftmxSyncWithdrawalRequests: Scalars['String'];
    tokenDeleteTokenType: Scalars['String'];
    tokenReloadAllTokenTypes: Scalars['String'];
    tokenReloadErc4626Tokens: Array<GqlTokenMutationResult>;
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

export interface MutationPoolLoadOnChainDataForAllPoolsArgs {
    chains: Array<GqlChain>;
}

export interface MutationPoolLoadSnapshotsForPoolsArgs {
    poolIds: Array<Scalars['String']>;
    reload?: InputMaybe<Scalars['Boolean']>;
}

export interface MutationPoolReloadAllPoolAprsArgs {
    chain: GqlChain;
}

export interface MutationPoolReloadPoolsArgs {
    chains: Array<GqlChain>;
}

export interface MutationPoolReloadStakingForAllPoolsArgs {
    stakingTypes: Array<GqlPoolStakingType>;
}

export interface MutationPoolSyncAllCowSnapshotsArgs {
    chains: Array<GqlChain>;
}

export interface MutationPoolSyncFxQuoteTokensArgs {
    chains: Array<GqlChain>;
}

export interface MutationTokenDeleteTokenTypeArgs {
    tokenAddress: Scalars['String'];
    type: GqlTokenType;
}

export interface MutationTokenReloadErc4626TokensArgs {
    chains: Array<GqlChain>;
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

export interface PoolForBatchSwap {
    __typename: 'PoolForBatchSwap';
    allTokens?: Maybe<Array<TokenForBatchSwapPool>>;
    id: Scalars['String'];
    name: Scalars['String'];
    symbol: Scalars['String'];
    type: GqlPoolType;
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
    /** Getting swap, add and remove events with paging */
    poolEvents: Array<GqlPoolEvent>;
    /** Returns all pools for a given filter, specific for aggregators */
    poolGetAggregatorPools: Array<GqlPoolAggregator>;
    /**
     * Will de deprecated in favor of poolEvents
     * @deprecated Use poolEvents instead
     */
    poolGetBatchSwaps: Array<GqlPoolBatchSwap>;
    /** Getting swap, add and remove events with range */
    poolGetEvents: Array<GqlPoolEvent>;
    /**
     * Will de deprecated in favor of poolGetFeaturedPools
     * @deprecated Use poolGetFeaturedPools instead
     */
    poolGetFeaturedPoolGroups: Array<GqlPoolFeaturedPoolGroup>;
    /** Returns the list of featured pools for chains */
    poolGetFeaturedPools: Array<GqlPoolFeaturedPool>;
    /**
     * Will de deprecated in favor of poolEvents
     * @deprecated Use poolEvents instead
     */
    poolGetJoinExits: Array<GqlPoolJoinExit>;
    /** Returns one pool. If a user address is provided, the user balances for the given pool will also be returned. */
    poolGetPool: GqlPoolBase;
    /** Returns all pools for a given filter */
    poolGetPools: Array<GqlPoolMinimal>;
    /** Returns the number of pools for a given filter. */
    poolGetPoolsCount: Scalars['Int'];
    /** Gets all the snapshots for a given pool on a chain for a certain range */
    poolGetSnapshots: Array<GqlPoolSnapshot>;
    /**
     * Will de deprecated in favor of poolEvents
     * @deprecated Use poolEvents instead
     */
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
    /** Get the staking data and status for stS */
    stsGetGqlStakedSonicData: GqlStakedSonicData;
    /** Get snapshots for sftmx staking for a specific range */
    stsGetStakedSonicSnapshots: Array<GqlStakedSonicSnapshot>;
    /**
     * Returns the candlestick chart data for a token for a given range.
     * @deprecated Use tokenGetHistoricalPrices instead
     */
    tokenGetCandlestickChartData: Array<GqlTokenCandlestickChartDataItem>;
    /** Returns all current prices for allowed tokens for a given chain or chains */
    tokenGetCurrentPrices: Array<GqlTokenPrice>;
    /** Returns the historical prices for a given set of tokens for a given chain and range */
    tokenGetHistoricalPrices: Array<GqlHistoricalTokenPrice>;
    /**
     * DEPRECATED: Returns pricing data for a given token for a given range
     * @deprecated Use tokenGetHistoricalPrices instead
     */
    tokenGetPriceChartData: Array<GqlTokenPriceChartDataItem>;
    /**
     * Returns the price of either BAL or BEETS depending on chain
     * @deprecated Use tokenGetTokensDynamicData instead
     */
    tokenGetProtocolTokenPrice: Scalars['AmountHumanReadable'];
    /** Returns the price of a token priced in another token for a given range. */
    tokenGetRelativePriceChartData: Array<GqlTokenPriceChartDataItem>;
    /**
     * Returns meta data for a given token such as description, website, etc.
     * @deprecated Use tokenGetTokens instead
     */
    tokenGetTokenData?: Maybe<GqlTokenData>;
    /** Returns dynamic data of a token such as price, market cap, etc. */
    tokenGetTokenDynamicData?: Maybe<GqlTokenDynamicData>;
    /** Returns all allowed tokens for a given chain or chains */
    tokenGetTokens: Array<GqlToken>;
    /**
     * Returns meta data for a given set of tokens such as description, website, etc.
     * @deprecated Use tokenGetTokens instead
     */
    tokenGetTokensData: Array<GqlTokenData>;
    /** Returns dynamic data of a set of tokens such as price, market cap, etc. */
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
    veBalGetUserBalances: Array<GqlVeBalBalance>;
    /** Returns all pools with veBAL gauges that can be voted on. */
    veBalGetVotingList: Array<GqlVotingPool>;
}

export interface QueryBeetsPoolGetReliquaryFarmSnapshotsArgs {
    id: Scalars['String'];
    range: GqlPoolSnapshotDataRange;
}

export interface QueryContentGetNewsItemsArgs {
    chain?: InputMaybe<GqlChain>;
}

export interface QueryPoolEventsArgs {
    first?: InputMaybe<Scalars['Int']>;
    skip?: InputMaybe<Scalars['Int']>;
    where?: InputMaybe<GqlPoolEventsFilter>;
}

export interface QueryPoolGetAggregatorPoolsArgs {
    first?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<GqlPoolOrderBy>;
    orderDirection?: InputMaybe<GqlPoolOrderDirection>;
    skip?: InputMaybe<Scalars['Int']>;
    where?: InputMaybe<GqlPoolFilter>;
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

export interface QueryPoolGetJoinExitsArgs {
    first?: InputMaybe<Scalars['Int']>;
    skip?: InputMaybe<Scalars['Int']>;
    where?: InputMaybe<GqlPoolJoinExitFilter>;
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
    chain: GqlChain;
    considerPoolsWithHooks?: InputMaybe<Scalars['Boolean']>;
    poolIds?: InputMaybe<Array<Scalars['String']>>;
    swapAmount: Scalars['AmountHumanReadable'];
    swapType: GqlSorSwapType;
    tokenIn: Scalars['String'];
    tokenOut: Scalars['String'];
    useProtocolVersion?: InputMaybe<Scalars['Int']>;
}

export interface QuerySorGetSwapsArgs {
    chain?: InputMaybe<GqlChain>;
    swapAmount: Scalars['BigDecimal'];
    swapOptions: GqlSorSwapOptionsInput;
    swapType: GqlSorSwapType;
    tokenIn: Scalars['String'];
    tokenOut: Scalars['String'];
}

export interface QueryStsGetStakedSonicSnapshotsArgs {
    range: GqlStakedSonicSnapshotDataRange;
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
    where?: InputMaybe<GqlTokenFilter>;
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

export interface QueryVeBalGetTotalSupplyArgs {
    chain?: InputMaybe<GqlChain>;
}

export interface QueryVeBalGetUserArgs {
    address: Scalars['String'];
    chain?: InputMaybe<GqlChain>;
}

export interface QueryVeBalGetUserBalanceArgs {
    address?: InputMaybe<Scalars['String']>;
    chain?: InputMaybe<GqlChain>;
}

export interface QueryVeBalGetUserBalancesArgs {
    address: Scalars['String'];
    chains?: InputMaybe<Array<GqlChain>>;
}

export interface Token {
    __typename: 'Token';
    address: Scalars['String'];
    decimals: Scalars['Int'];
}

export interface TokenForBatchSwapPool {
    __typename: 'TokenForBatchSwapPool';
    address: Scalars['String'];
    isNested: Scalars['Boolean'];
    isPhantomBpt: Scalars['Boolean'];
    weight?: Maybe<Scalars['BigDecimal']>;
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
                __typename: 'PoolForBatchSwap';
                id: string;
                name: string;
                type: GqlPoolType;
                symbol: string;
                allTokens?: Array<{
                    __typename: 'TokenForBatchSwapPool';
                    address: string;
                    isNested: boolean;
                    isPhantomBpt: boolean;
                    weight?: string | null;
                }> | null;
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
            __typename: 'PoolForBatchSwap';
            id: string;
            name: string;
            type: GqlPoolType;
            symbol: string;
            allTokens?: Array<{
                __typename: 'TokenForBatchSwapPool';
                address: string;
                isNested: boolean;
                isPhantomBpt: boolean;
                weight?: string | null;
            }> | null;
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
        __typename: 'PoolForBatchSwap';
        id: string;
        name: string;
        type: GqlPoolType;
        symbol: string;
        allTokens?: Array<{
            __typename: 'TokenForBatchSwapPool';
            address: string;
            isNested: boolean;
            isPhantomBpt: boolean;
            weight?: string | null;
        }> | null;
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
        isErc4626: boolean;
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
        isErc4626: boolean;
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
              owner?: string | null;
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
                            owner?: string | null;
                            factory?: string | null;
                            createTime: number;
                            totalShares: string;
                            totalLiquidity: string;
                            nestingType: GqlPoolNestingType;
                            swapFee: string;
                            amp: string;
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
              owner?: string | null;
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
              owner?: string | null;
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
              __typename: 'GqlPoolLiquidityBootstrapping';
              name: string;
              nestingType: GqlPoolNestingType;
              id: string;
              address: string;
              owner?: string | null;
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
                            owner?: string | null;
                            factory?: string | null;
                            createTime: number;
                            totalShares: string;
                            totalLiquidity: string;
                            nestingType: GqlPoolNestingType;
                            swapFee: string;
                            amp: string;
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
              owner?: string | null;
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
              owner?: string | null;
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
              owner?: string | null;
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
                            owner?: string | null;
                            factory?: string | null;
                            createTime: number;
                            totalShares: string;
                            totalLiquidity: string;
                            nestingType: GqlPoolNestingType;
                            swapFee: string;
                            amp: string;
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
        owner?: string | null;
        factory?: string | null;
        createTime: number;
        totalShares: string;
        totalLiquidity: string;
        nestingType: GqlPoolNestingType;
        swapFee: string;
        amp: string;
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
            }
        }
    }
    ${GqlPoolTokenFragmentDoc}
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
            isErc4626
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
            isErc4626
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
                    ... on GqlPoolTokenComposableStable {
                        ...GqlPoolTokenComposableStable
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
