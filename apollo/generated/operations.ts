import gql from 'graphql-tag';
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
        totalBalance
    }
`;
export const GqlPoolTokenComposableStable = gql`
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
    ${GqlPoolToken}
`;
export const GqlPoolMinimal = gql`
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
            isErc4626
        }
        beetsGetFbeetsRatio
        blocksGetBlocksPerDay
        blocksGetAverageBlockTime
        veBALTotalSupply: veBalGetTotalSupply
    }
`;
export const GetAppGlobalPollingData = gql`
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
export const GetTokens = gql`
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
export const GetBlocksPerDay = gql`
    query GetBlocksPerDay {
        blocksPerDay: blocksGetBlocksPerDay
        avgBlockTime: blocksGetAverageBlockTime
    }
`;
export const GetBeetsPrice = gql`
    query GetBeetsPrice {
        beetsPrice: tokenGetProtocolTokenPrice
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
export const UserSyncBalance = gql`
    mutation UserSyncBalance($poolId: String!) {
        userSyncBalance(poolId: $poolId)
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
    ${GqlPoolToken}
    ${GqlPoolTokenComposableStable}
`;
export const GetPoolBptPriceChartData = gql`
    query GetPoolBptPriceChartData($address: String!, $range: GqlTokenChartDataRange!) {
        prices: tokenGetPriceChartData(address: $address, range: $range) {
            id
            price
            timestamp
        }
    }
`;
export const GetPoolSnapshots = gql`
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
export const GetPoolTokensDynamicData = gql`
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
    ${GqlTokenDynamicData}
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
export const GetReliquaryFarmSnapshots = gql`
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
export const SftmxGetStakingData = gql`
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
export const SftmxGetWithdrawalRequests = gql`
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
export const SftmxGetStakingSnapshots = gql`
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
