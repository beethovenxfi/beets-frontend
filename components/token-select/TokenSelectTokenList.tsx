import { tokenFindTokenAmountForAddress } from '~/lib/services/token/token-util';
import { TokenRow } from '~/components/token-select/TokenRow';
import VirtualList from 'react-tiny-virtual-list';
import { useGetTokens, useTokens } from '~/lib/global/useToken';
import { useUserTokenBalances } from '~/lib/user/useUserTokenBalances';
import { orderBy } from 'lodash';
import useCVirtual from 'react-cool-virtual';
import { useUserBalances } from '~/lib/user/useUserBalances';

interface Props {
    listHeight: number;
    searchTerm: string;
    onTokenRowClick: (address: string) => void;
}

export function TokenSelectTokenList({ listHeight, searchTerm, onTokenRowClick }: Props) {
    const { tokens, priceForAmount } = useGetTokens();
    const { userBalances, isLoading: userBalancesLoading } = useUserBalances();

    const filteredTokens = searchTerm
        ? tokens.filter((token) => {
              return (
                  token.address.toLowerCase() === searchTerm.toLowerCase() ||
                  token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
              );
          })
        : tokens;

    const filteredTokensByPrice = orderBy(
        filteredTokens,
        [
            (token) => {
                const userBalance = tokenFindTokenAmountForAddress(token.address, userBalances);
                return priceForAmount(userBalance);
            },
            'priority',
        ],
        ['desc', 'desc'],
    );

    const { outerRef, innerRef, items } = useCVirtual({
        itemCount: filteredTokensByPrice.length, // Provide the total number for the list items
        itemSize: 80, // The size of each item (default = 50)
    });
    return null;
    return (
        <VirtualList
            className="token-select-list"
            width="100%"
            height={listHeight}
            itemCount={filteredTokens.length}
            itemSize={56}
            renderItem={({ index, style }) => {
                const token = filteredTokensByPrice[index];
                const userBalance = tokenFindTokenAmountForAddress(token.address, userBalances);
                return (
                    <div style={style} key={index}>
                        <TokenRow
                            {...token}
                            onClick={() => onTokenRowClick(token.address)}
                            key={token.address}
                            userBalance={userBalance.amount}
                            userBalanceUSD={priceForAmount(userBalance)}
                            loading={userBalancesLoading}
                        />
                    </div>
                );
            }}
        />
    );
}
