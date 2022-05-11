import gql from 'graphql-tag';
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
export const GetTokens = gql`
    query GetTokens {
        tokens: tokenGetTokens {
            address
            name
            symbol
            decimals
            chainId
            logoURI
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
    ) {
        poolGetPools(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
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
