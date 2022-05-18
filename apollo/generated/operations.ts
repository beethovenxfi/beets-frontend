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
export const GqlPoolBase = gql`
    fragment GqlPoolBase on GqlPoolBase {
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
export const GetTokenNames = gql`
    query GetTokenNames {
        tokens: tokenGetTokens {
            name
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
                address
                isNested
                isPhantomBpt
            }
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
