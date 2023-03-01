/* eslint-disable react/jsx-key */
// https://github.com/TanStack/table/discussions/2647
import {
    Box,
    Flex,
    FormLabel,
    HStack,
    Link,
    Progress,
    Spacer,
    Switch,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react';
import { CornerDownRight, ExternalLink } from 'react-feather';
import { Cell, Column, TableOptions, useExpanded, useTable } from 'react-table';

import Card from '~/components/card/Card';
import React from 'react';
import TokenAvatar from '~/components/token/TokenAvatar';
import numeral from 'numeral';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { useGetTokens } from '~/lib/global/useToken';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { usePoolUserInvestedTokenBalances } from '~/modules/pool/lib/usePoolUserInvestedTokenBalances';
import { usePool } from '~/modules/pool/lib/usePool';
import {
    GqlPoolLinearNested,
    GqlPoolPhantomStableNested,
    GqlPoolTokenUnion,
    GqlPoolUnion,
} from '~/apollo/generated/graphql-codegen-generated';
import { etherscanGetTokenUrl } from '~/lib/util/etherscan';
import { usePoolUserDepositBalance } from '~/modules/pool/lib/usePoolUserDepositBalance';
import { usePoolComposableUserPoolTokenBalances } from '~/modules/pool/lib/usePoolComposableUserPoolTokenBalances';
import {
    getLinearPoolMainToken,
    hasSmallWrappedBalancedIn18Decimals,
    poolIsComposablePool,
} from '~/lib/services/pool/pool-util';
import { oldBnumScale } from '~/lib/services/pool/lib/old-big-number';

interface PoolCompositionTableProps {
    columns: Column<TableDataTemplate>[];
    data: TableData[];
    hasNestedTokens: boolean;
}

interface TableDataTemplate {
    symbol: string;
    name: string;
    weight: string | number;
    myBalance: string;
    myValue: string;
    balance: string;
    value: string;
}

interface TableData extends TableDataTemplate {
    subRows?: TableDataTemplate[];
}

enum Columns {
    Expander = 'expander',
    Symbol = 'symbol',
    Name = 'name',
    Weight = 'weight',
    MyBalance = 'myBalance',
    MyValue = 'myValue',
    Balance = 'balance',
    Value = 'value',
}

function PoolCompositionTable({ columns, data, hasNestedTokens }: PoolCompositionTableProps) {
    const options: TableOptions<TableDataTemplate> = {
        columns,
        data,
        autoResetExpanded: false,
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        toggleAllRowsExpanded,
        setHiddenColumns,
        state: { expanded },
    } = useTable(options, useExpanded);

    const { hasBpt } = usePoolUserBptBalance();

    // always show all columns after an update of 'data' , if neccessary a column is hidden by the parseCell function
    React.useEffect(() => {
        setHiddenColumns([]);
    }, [data]);

    function parseCell(cell: Cell<TableDataTemplate>) {
        // hide the 'collapse all' button when there are NO tokens in the pool have nested tokens
        if (cell.column.id === Columns.Expander && !hasNestedTokens) {
            cell.column.toggleHidden(true);
        } else if (cell.column.id === Columns.Symbol) {
            const [symbol, address] = cell.value.split('--');
            return (
                <HStack>
                    {cell.row.depth > 0 ? (
                        <Box color="whiteAlpha.400" paddingLeft={cell.row.depth === 1 ? '2' : '12'}>
                            <CornerDownRight />
                        </Box>
                    ) : null}
                    <TokenAvatar size="xs" address={address} />
                    <HStack spacing="1">
                        <Text fontSize="sm" color="beets.base.50">
                            {symbol}
                        </Text>
                        <Link href={etherscanGetTokenUrl(address)} target="_blank">
                            <ExternalLink size={14} />
                        </Link>
                    </HStack>
                </HStack>
            );
        } else if (cell.column.id === Columns.Weight) {
            // only show the progress bar for the pool tokenWithAmount and not for any nested tokens
            if (cell.row.depth === 0) {
                return <Progress width="80%" rounded="lg" value={parseFloat(cell.value || '0') * 100} />;
            } else {
                return null;
            }
        } else if (cell.column.id === Columns.MyBalance || cell.column.id === Columns.MyValue) {
            // hide the 'My Balance' & 'My Value' columns when the user has no BPT
            if (!hasBpt) {
                cell.column.toggleHidden(true);
                // or else don't display anything for nested tokens
            } else if (cell.row.depth > 0) {
                return null;
                // or else just display the value
            } else {
                return cell.render('Cell');
            }
            // else just display the value
        } else {
            return cell.render('Cell');
        }
    }

    return (
        <>
            {hasNestedTokens && (
                <Flex justifyContent="flex-end">
                    <Spacer />
                    <Flex>
                        <FormLabel htmlFor="nested-tokens" mb="0">
                            Show nested tokens?
                        </FormLabel>
                        <Switch id="nested-tokens" onChange={() => toggleAllRowsExpanded()} />
                    </Flex>
                </Flex>
            )}
            <TableContainer>
                <Table {...getTableProps()} style={{ borderCollapse: 'separate', borderSpacing: '0 3px' }}>
                    <Thead width="full" paddingX="2">
                        {headerGroups.map((headerGroup) => (
                            <Tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <Th
                                        {...column.getHeaderProps()}
                                        border="none"
                                        padding={column.id === Columns.Expander ? '0' : '2'}
                                    >
                                        {column.id === Columns.Expander ? (
                                            <Box color="beets.base.50">{column.render('Header')}</Box>
                                        ) : (
                                            <Text fontSize="xs" color="beets.base.50">
                                                {column.render('Header')}
                                            </Text>
                                        )}
                                    </Th>
                                ))}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <Tr {...row.getRowProps()} padding="2" width="full" background="whiteAlpha.100">
                                    {row.cells.map((cell, i) => {
                                        return (
                                            <Td
                                                {...cell.getCellProps()}
                                                borderBottom="0"
                                                p="2"
                                                marginBottom="4"
                                                borderTopLeftRadius={i == 0 ? 'lg' : undefined}
                                                borderBottomLeftRadius={i == 0 ? 'lg' : undefined}
                                                borderTopRightRadius={i == row.cells.length - 1 ? 'lg' : undefined}
                                                borderBottomRightRadius={i == row.cells.length - 1 ? 'lg' : undefined}
                                                width={hasBpt ? '14%' : '20%'}
                                            >
                                                {parseCell(cell)}
                                            </Td>
                                        );
                                    })}
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    );
}

export function PoolComposition() {
    const { pool, isComposablePool } = usePool();
    const { getUserInvestedBalance, data: userInvestedBalances } = usePoolUserInvestedTokenBalances();
    const { prices, priceFor } = useGetTokens();
    const { userPoolBalanceUSD } = usePoolUserDepositBalance();
    const { getUserPoolTokenBalance } = usePoolComposableUserPoolTokenBalances();
    const hasNestedTokens = pool.tokens.some((token) =>
        ['GqlPoolTokenLinear', 'GqlPoolTokenPhantomStable'].includes(token.__typename),
    );

    const columns: Column<TableDataTemplate>[] = React.useMemo(
        () => [
            {
                Header: 'Symbol',
                accessor: Columns.Symbol,
            },
            {
                Header: 'Name',
                accessor: Columns.Name,
            },
            {
                Header: 'Weight',
                accessor: Columns.Weight,
            },
            {
                Header: 'My balance',
                accessor: Columns.MyBalance,
            },
            {
                Header: 'My value',
                accessor: Columns.MyValue,
            },
            {
                Header: 'Balance',
                accessor: Columns.Balance,
            },
            {
                Header: 'Value',
                accessor: Columns.Value,
            },
        ],
        [],
    );

    function getTokenData(
        tokens: GqlPoolTokenUnion[],
        containingPool: GqlPoolUnion | GqlPoolLinearNested | GqlPoolPhantomStableNested,
    ): TableData[] {
        return tokens.map((token) => {
            const tokenPrice = priceFor(token.address);
            const totalTokenValue = parseFloat(token.balance) * tokenPrice;
            const calculatedWeight = totalTokenValue / parseFloat(pool.dynamicData.totalLiquidity);
            const userBalance = isComposablePool
                ? getUserPoolTokenBalance(token.address)
                : hasNestedTokens && 'pool' in token
                ? (((calculatedWeight * userPoolBalanceUSD) / totalTokenValue) * parseFloat(token.balance)).toString()
                : getUserInvestedBalance(token.address);

            const smallWrappedBalanceIn18Decimals = hasSmallWrappedBalancedIn18Decimals(containingPool);
            const linearPoolMainToken = getLinearPoolMainToken(containingPool);
            const decimalDiff = 18 - (linearPoolMainToken?.decimals || 18);

            return {
                symbol: `${token.symbol}--${token.address}`,
                name: token.name,
                weight: token.weight ?? calculatedWeight,
                myBalance: `${hasNestedTokens && 'pool' in token && !isComposablePool ? '~' : ''}${tokenFormatAmount(
                    userBalance,
                )}`,
                myValue: numeral(parseFloat(userBalance) * tokenPrice).format('$0,0.00a'),
                balance:
                    smallWrappedBalanceIn18Decimals &&
                    linearPoolMainToken &&
                    token.address !== linearPoolMainToken.address
                        ? `${tokenFormatAmount(oldBnumScale(token.balance, decimalDiff).toString())}e-${decimalDiff}`
                        : tokenFormatAmount(token.balance),
                value: numeral(totalTokenValue).format('$0,0.00a'),
                ...(hasNestedTokens && 'pool' in token && { subRows: getTokenData(token.pool.tokens, token.pool) }),
            };
        });
    }

    const data = React.useMemo(
        (): TableDataTemplate[] => getTokenData(pool.tokens, pool),
        [JSON.stringify(pool.tokens), JSON.stringify(userInvestedBalances), JSON.stringify(prices)],
    );

    return (
        <Card px="2" py="2" mt={4} width="full">
            <PoolCompositionTable columns={columns} data={data} hasNestedTokens={hasNestedTokens} />
        </Card>
    );
}
