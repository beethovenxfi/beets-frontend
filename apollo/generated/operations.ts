import gql from 'graphql-tag';
export const GqlPoolCardData = gql`
    fragment GqlPoolCardData on GqlPoolMinimal {
        id
        address
        name
        dynamicData {
            totalLiquidity
            totalShares
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
            weight
        }
    }
`;
export const GqlPoolFeaturedPoolGroup = gql`
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
    ${GqlPoolCardData}
`;
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
            weight
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
export const GqlSorSwapRouteHop = gql`
    fragment GqlSorSwapRouteHop on GqlSorSwapRouteHop {
        poolId
        pool {
            id
            name
            symbol
            dynamicData {
                totalLiquidity
            }
            allTokens {
                address
                isNested
                isPhantomBpt
            }
        }
        tokenIn
        tokenOut
        tokenInAmount
        tokenOutAmount
    }
`;
export const GqlSorSwapRoute = gql`
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
    ${GqlSorSwapRouteHop}
`;
export const GqlSorGetSwapsResponse = gql`
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
    ${GqlSorSwapRoute}
`;
export const GqlTokenDynamicData = gql`
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
export const GetPoolBatchSwaps = gql`
    query GetPoolBatchSwaps($first: Int, $skip: Int, $where: GqlPoolSwapFilter) {
        batchSwaps: poolGetBatchSwaps(first: $first, skip: $skip, where: $where) {
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
                id
                timestamp
                tokenAmountIn
                tokenAmountOut
                tokenIn
                tokenOut
                valueUSD
                poolTokens
                poolId
            }
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
        beetsGetProtocolData {
            totalLiquidity
            swapFee24h
            swapVolume24h
            marketCap
            circulatingSupply
            poolCount
            beetsPrice
            fbeetsPrice
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
export const GetProtocolData = gql`
    query GetProtocolData {
        protocolData: beetsGetProtocolData {
            totalLiquidity
            swapFee24h
            swapVolume24h
            marketCap
            circulatingSupply
            poolCount
            beetsPrice
            fbeetsPrice
        }
    }
`;
export const GetUserData = gql`
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
export const GetHomeData = gql`
    query GetHomeData {
        poolGetFeaturedPoolGroups {
            ...GqlPoolFeaturedPoolGroup
        }
        configGetNewsItems {
            id
            text
            image
            url
            source
            timestamp
        }
    }
    ${GqlPoolFeaturedPoolGroup}
`;
export const GetHomeFeaturedPools = gql`
    query GetHomeFeaturedPools {
        featuredPoolGroups: poolGetFeaturedPoolGroups {
            ...GqlPoolFeaturedPoolGroup
        }
    }
    ${GqlPoolFeaturedPoolGroup}
`;
export const GetHomeNewsItems = gql`
    query GetHomeNewsItems {
        newsItems: configGetNewsItems {
            id
            text
            image
            url
            source
            timestamp
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
                totalLiquidity24hAgo
                totalShares
                fees24h
                swapFee
                volume24h
                fees48h
                volume48h
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
export const GetPoolUserJoinExits = gql`
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
export const GetTokenRelativePriceChartData = gql`
    query GetTokenRelativePriceChartData($tokenIn: String!, $tokenOut: String!, $range: GqlTokenChartDataRange!) {
        prices: tokenGetRelativePriceChartData(tokenIn: $tokenIn, tokenOut: $tokenOut, range: $range) {
            id
            price
            timestamp
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
            ...GqlSorGetSwapsResponse
        }
    }
    ${GqlSorGetSwapsResponse}
`;
export const GetTradeSelectedTokenData = gql`
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
    ${GqlTokenDynamicData}
`;
