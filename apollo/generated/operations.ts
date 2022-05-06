import gql from 'graphql-tag';

export const GetSorSwaps = gql`
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
export const GetTokenPrices = gql`
    query GetTokenPrices {
        tokenPriceGetCurrentPrices {
            price
            address
        }
    }
`;
