import { tokenFindTokenAmountForAddress } from '~/lib/services/token/token-util';
import { TokenRow } from '~/components/token-select/TokenRow';
import VirtualList from 'react-tiny-virtual-list';
import { useGetTokens } from '~/lib/global/useToken';
import { useUserTokenBalances } from '~/lib/user/useUserTokenBalances';
import { orderBy } from 'lodash';
import { networkConfig } from '~/lib/config/network-config';

interface Props {
    listHeight: number;
    searchTerm: string;
    onTokenRowClick: (address: string) => void;
    excludeNativeToken?: boolean;
}

export function TokenSelectTokenList({ listHeight, searchTerm, onTokenRowClick, excludeNativeToken = false }: Props) {
    const { tokens, priceForAmount } = useGetTokens();
    const { userBalances, isLoading: userBalancesLoading } = useUserTokenBalances();

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

    const propFilteredTokens = filteredTokensByPrice.filter(
        (token) => token.address.toLowerCase() !== networkConfig.eth.address.toLowerCase(),
    );

    return (
        <VirtualList
            className="token-select-list"
            width="100%"
            height={listHeight}
            itemCount={filteredTokens.length}
            itemSize={56}
            renderItem={({ index, style }) => {
                const token = excludeNativeToken ? propFilteredTokens[index] : filteredTokensByPrice[index];
                const userBalance = tokenFindTokenAmountForAddress(token?.address || '', userBalances);
                return (
                    <div style={style} key={index}>
                        {token && (
                            <TokenRow
                                {...token}
                                onClick={() => onTokenRowClick(token.address)}
                                key={token.address}
                                userBalance={userBalance.amount}
                                userBalanceUSD={priceForAmount(userBalance)}
                                loading={userBalancesLoading}
                            />
                        )}
                    </div>
                );
            }}
        />
    );
}
