import { PoolCreateTokenRow } from './PoolCreateTokenRow';
import VirtualList from 'react-tiny-virtual-list';
import { useGetTokens } from '~/lib/global/useToken';

interface Props {
    listHeight: number;
    searchTerm: string;
    onTokenRowClick: (address: string) => void;
}

export function PoolCreateTokenSelectTokenList({ listHeight, searchTerm, onTokenRowClick }: Props) {
    const { tokens } = useGetTokens();

    const filteredTokens = searchTerm
        ? tokens.filter((token) => {
              return (
                  token.address.toLowerCase() === searchTerm.toLowerCase() ||
                  token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
              );
          })
        : tokens;

    return (
        <VirtualList
            className="token-select-list"
            width="100%"
            height={listHeight}
            itemCount={filteredTokens.length}
            itemSize={56}
            renderItem={({ index, style }) => {
                const token = filteredTokens[index];
                return (
                    <div style={style} key={index}>
                        <PoolCreateTokenRow
                            {...token}
                            onClick={() => onTokenRowClick(token.address)}
                            key={token.address}
                        />
                    </div>
                );
            }}
        />
    );
}
