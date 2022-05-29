import gql from 'graphql-tag';
export const GqlPoolToken = gql`
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
    }
`;
export const GqlPoolTokenLinear = gql`
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
            tokens {
                ... on GqlPoolToken {
                    ...GqlPoolToken
                }
            }
        }
    }
    ${GqlPoolToken}
`;
export const GqlPoolTokenPhantomStable = gql`
    fragment GqlPoolTokenPhantomStable on GqlPoolTokenPhantomStable {
        id
        index
        name
        symbol
        balance
        address
        weight
        priceRate
        decimals
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
    ${GqlPoolToken}
    ${GqlPoolTokenLinear}
`;
export const GqlPoolMinimal = gql`
    fragment GqlPoolMinimal on GqlPoolMinimal {
        id
        address
        name
        symbol
        createTime
        dynamicData {
            totalLiquidity
            totalShares
            fees24h
            swapFee
            volume24h
            apr {
                hasRewardApr
                thirdPartyApr
                nativeRewardApr
                swapApr
                total
                items {
                    title
                    apr
                    subItems {
                        title
                        apr
                    }
                }
            }
        }
        allTokens {
            id
            address
            isNested
            isPhantomBpt
        }
    }
`;
export const GetAppGlobalData = gql`
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
        tokenGetCurrentPrices {
            price
            address
        }
        beetsGetFbeetsRatio
    }
`;
export const GetTokens = gql`
    query GetTokens {
        tokens: tokenGetTokens {
            address
            name
            symbol
            decimals
            chainId
            logoURI
            priority
            tradable
        }
    }
`;
export const GetTokenPrices = gql`
    query GetTokenPrices {
        tokenPrices: tokenGetCurrentPrices {
            price
            address
        }
    }
`;
export const GetTokensDynamicData = gql`
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
export const GetFbeetsRatio = gql`
    query GetFbeetsRatio {
        ratio: beetsGetFbeetsRatio
    }
`;
export const GetPool = gql`
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
            dynamicData {
                poolId
                swapEnabled
                totalLiquidity
                totalShares
                fees24h
                swapFee
                volume24h
                apr {
                    hasRewardApr
                    thirdPartyApr
                    nativeRewardApr
                    swapApr
                    total
                    items {
                        title
                        apr
                        subItems {
                            title
                            apr
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
                    ... on GqlPoolTokenPhantomStable {
                        ...GqlPoolTokenPhantomStable
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
            ... on GqlPoolPhantomStable {
                amp
                nestingType
                tokens {
                    ... on GqlPoolToken {
                        ...GqlPoolToken
                    }
                    ... on GqlPoolTokenLinear {
                        ...GqlPoolTokenLinear
                    }
                    ... on GqlPoolTokenPhantomStable {
                        ...GqlPoolTokenPhantomStable
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
                    ... on GqlPoolTokenPhantomStable {
                        ...GqlPoolTokenPhantomStable
                    }
                }
            }
        }
    }
    ${GqlPoolToken}
    ${GqlPoolTokenLinear}
    ${GqlPoolTokenPhantomStable}
`;
export const GetPoolSwaps = gql`
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
export const GetPoolJoinExits = gql`
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
export const GetPools = gql`
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
    ${GqlPoolMinimal}
`;
export const GetPoolFilters = gql`
    query GetPoolFilters {
        filters: poolGetPoolFilters {
            id
            title
        }
    }
`;
export const GetSorSwaps = gql`
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
            tokenIn
            tokenOut
            swapAmount
            tokenAddresses
            marketSp
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
