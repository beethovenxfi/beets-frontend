import { useMultiCall } from '~/lib/util/useMultiCall';
import { TokenAmountHumanReadable, TokenBase } from '~/lib/services/token/token-types';
import ERC20Abi from '../abi/ERC20.json';
import { AddressZero } from '@ethersproject/constants';
import { networkConfig } from '~/lib/config/network-config';
import { useBalance } from 'wagmi';
import { formatFixed } from '@ethersproject/bignumber';

const BALANCE_CACHE_TIME_MS = 15_000;

export function useBalances(account: string | null, tokens: TokenBase[]) {
    const containsEth = !!tokens.find((token) => token.address !== networkConfig.eth.address.toLowerCase());
    const filteredTokens = tokens.filter((token) => token.address !== networkConfig.eth.address.toLowerCase());

    const ethBalance = useBalance({
        addressOrName: account || '',
        enabled: account !== null && containsEth,
        cacheTime: BALANCE_CACHE_TIME_MS,
    });

    const multicall = useMultiCall({
        abi: ERC20Abi,
        calls: filteredTokens.map((token) => ({
            address: token.address,
            functionName: 'balanceOf',
            args: [account || AddressZero],
        })),
        enabled: account !== null,
        cacheTimeMs: BALANCE_CACHE_TIME_MS,
    });

    async function refetch() {
        return {
            ethBalanceResponse: await ethBalance.refetch(),
            multicallResponse: await multicall.refetch(),
        };
    }

    const balances: TokenAmountHumanReadable[] = multicall.data
        ? filteredTokens.map((token, index) => {
              return {
                  address: token.address,
                  amount:
                      multicall.data && multicall.data[index]
                          ? formatFixed(multicall.data[index], token.decimals)
                          : '0',
              };
          })
        : [];

    if (containsEth) {
        balances.push({ address: networkConfig.eth.address.toLowerCase(), amount: ethBalance.data?.formatted || '0' });
    }

    return {
        data: balances,
        isLoading: ethBalance.isLoading || multicall.isLoading,
        isError: ethBalance.isError || multicall.isError,
        error: ethBalance.error || multicall.error,
        isRefetching: ethBalance.isRefetching || multicall.isRefetching,
        refetch,
    };
}
