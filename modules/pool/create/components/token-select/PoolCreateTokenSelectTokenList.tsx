import { PoolCreateTokenRow } from './PoolCreateTokenRow';
import VirtualList from 'react-tiny-virtual-list';
import { TokenWithImportedFlag, useGetTokens } from '~/lib/global/useToken';
import { usePoolCreate } from '../../../lib/usePoolCreate';

interface Props {
    listHeight: number;
    searchTerm?: string;
    isForSelectedTokens?: boolean;
    onTokenRowClick: (address: string) => void;
}

export function PoolCreateTokenSelectTokenList({
    listHeight,
    searchTerm,
    isForSelectedTokens = false,
    onTokenRowClick,
}: Props) {
    const { tokens } = useGetTokens();
    const { tokensSelected } = usePoolCreate();

    let filteredTokens: TokenWithImportedFlag[];

    if (isForSelectedTokens) {
        filteredTokens = tokensSelected.length
            ? tokens.filter((token) => tokensSelected.includes(token.address.toLowerCase()))
            : [];
    } else {
        filteredTokens = searchTerm
            ? tokens.filter(
                  (token) =>
                      !tokensSelected.includes(token.address.toLowerCase()) ||
                      token.address.toLowerCase() === searchTerm.toLowerCase() ||
                      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
              )
            : tokens.filter((token) => !tokensSelected.includes(token.address.toLowerCase()));
    }

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
