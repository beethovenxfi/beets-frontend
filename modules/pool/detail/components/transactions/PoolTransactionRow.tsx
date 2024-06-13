import { GqlPoolAddRemoveEventV3, GqlPoolSwapEventV3 } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Flex, Text, Link, Grid, GridItem, Stack, useBreakpointValue } from '@chakra-ui/react';
import { BoxProps, HStack } from '@chakra-ui/layout';
import { ArrowDown, ArrowRight, ExternalLink, Minus, Plus, Zap } from 'react-feather';
import { TokenAmountPill } from '~/components/token/TokenAmountPill';
import { formatDistanceToNow } from 'date-fns';
import { etherscanGetTxUrl } from '~/lib/util/etherscan';
import { numberFormatUSDValue } from '~/lib/util/number-formats';

export enum PoolTransactionType {
    Swap = 'SWAP',
    Join = 'ADD',
    Exit = 'REMOVE',
}

export type PoolTransaction = {
    transaction: GqlPoolAddRemoveEventV3 | GqlPoolSwapEventV3;
    type: PoolTransactionType;
    isPhantomStable?: boolean;
};

interface Props extends BoxProps {
    transaction: PoolTransaction;
}

const TxToReadableMap: Record<PoolTransactionType, string> = {
    [PoolTransactionType.Join]: 'Invest',
    [PoolTransactionType.Exit]: 'Withdraw',
    [PoolTransactionType.Swap]: 'Swap',
};

function PoolTransactionAction(props: PoolTransaction) {
    const getIcon = () => {
        if (props.type === PoolTransactionType.Join) {
            return <Plus size="20" />;
        }
        if (props.type === PoolTransactionType.Exit) {
            return <Minus size="20" />;
        }
        if (props.type === PoolTransactionType.Swap) {
            return <Zap size="20" />;
        }
    };

    const getColor = () => {
        if (props.type === PoolTransactionType.Join) {
            return 'beets.green';
        }
        if (props.type === PoolTransactionType.Exit) {
            return 'beets.red';
        }
        if (props.type === PoolTransactionType.Swap) {
            return 'beets.green';
        }
    };
    return (
        <HStack>
            <Box color={getColor()}>{getIcon()}</Box>
            <Text textStyle="" fontSize="md">
                {TxToReadableMap[props.type]}
            </Text>
        </HStack>
    );
}

function Pool(props: PoolTransaction) {
    const isInvestAction = [PoolTransactionType.Join, PoolTransactionType.Exit].includes(props.type);
    const isJoinAction = props.type === PoolTransactionType.Join;
    const isExitAction = props.type === PoolTransactionType.Exit;
    const isSwapAction = props.type === PoolTransactionType.Swap;

    const isMobile = useBreakpointValue({ base: true, lg: false });

    return (
        <Stack spacing="2" alignItems={{ base: 'flex-start', lg: 'center' }} direction={{ base: 'column', lg: 'row' }}>
            {!props.isPhantomStable && (
                <>
                    {isInvestAction &&
                        (props.transaction as GqlPoolAddRemoveEventV3).tokens
                            .filter((token) => token.amount !== '0')
                            .map((token, index) => (
                                <TokenAmountPill
                                    fontSize="md"
                                    key={index}
                                    amount={token.amount}
                                    address={token.address}
                                />
                            ))}
                    {!isInvestAction && (
                        <>
                            <TokenAmountPill
                                fontSize="md"
                                amount={(props.transaction as GqlPoolSwapEventV3).tokenIn.amount}
                                address={(props.transaction as GqlPoolSwapEventV3).tokenIn.address}
                            />
                            <Box mx={{ base: 0, lg: 2 }} pl={{ base: 10, lg: 0 }}>
                                {isMobile ? <ArrowDown /> : <ArrowRight />}
                            </Box>
                            <TokenAmountPill
                                fontSize="md"
                                amount={(props.transaction as GqlPoolSwapEventV3).tokenOut.amount}
                                address={(props.transaction as GqlPoolSwapEventV3).tokenOut.address}
                            />
                        </>
                    )}
                </>
            )}
            {props.isPhantomStable && (
                <>
                    {(isSwapAction || isJoinAction) && (
                        <TokenAmountPill
                            fontSize="md"
                            amount={(props.transaction as GqlPoolSwapEventV3).tokenIn.amount}
                            address={(props.transaction as GqlPoolSwapEventV3).tokenIn.address}
                        />
                    )}
                    {isSwapAction && (
                        <Box mx={2}>
                            <ArrowRight />
                        </Box>
                    )}
                    {(isSwapAction || isExitAction) && (
                        <TokenAmountPill
                            fontSize="md"
                            amount={(props.transaction as GqlPoolSwapEventV3).tokenOut.amount}
                            address={(props.transaction as GqlPoolSwapEventV3).tokenOut.address}
                        />
                    )}
                </>
            )}
        </Stack>
    );
}

export default function PoolTransactionItem({ transaction, ...rest }: Props) {
    const flexAlign = { base: 'flex-start', lg: 'center' };
    const gridItemMb = { base: '4', lg: '0' };
    const justifyContent = { base: 'flex-start', lg: 'flex-end' };

    return (
        <Grid
            px="4"
            py={{ base: '4', lg: '2' }}
            templateColumns={{
                base: '1fr 1fr',
                lg: '200px 1fr 200px 200px',
            }}
            gap="0"
            templateAreas={{
                base: `"action time"
                             "details value"`,
                lg: `"action details value time"`,
            }}
            bgColor="rgba(255,255,255,0.05)"
            _hover={{ bg: 'beets.base.800' }}
        >
            <Flex align={flexAlign}>
                <GridItem area="action">
                    <MobileLabel text="Action" />
                    <PoolTransactionAction {...transaction} />
                </GridItem>
            </Flex>
            <GridItem area="details" mb={gridItemMb}>
                <MobileLabel text="Details" />
                <Pool {...transaction} />
            </GridItem>
            <Flex align={flexAlign}>
                <GridItem area="value" mb={gridItemMb}>
                    <MobileLabel text="Value" />
                    <Text fontSize="md">{numberFormatUSDValue(transaction.transaction.valueUSD || '')}</Text>
                </GridItem>
            </Flex>
            <Flex align={flexAlign} justify={justifyContent}>
                <GridItem area="time" mb={gridItemMb}>
                    <MobileLabel text="Time" />
                    <HStack width="full" justify={justifyContent}>
                        <Text fontSize="md">
                            {formatDistanceToNow(new Date(transaction.transaction.timestamp * 1000), {
                                addSuffix: true,
                            })}
                        </Text>
                        <Link href={etherscanGetTxUrl(transaction.transaction.tx)} isExternal>
                            <ExternalLink size={14} />
                        </Link>
                    </HStack>
                </GridItem>
            </Flex>
        </Grid>
    );

    function MobileLabel({ text }: { text: string }) {
        return (
            <Text fontSize="xs" color="gray.200" display={{ base: 'block', lg: 'none' }}>
                {text}
            </Text>
        );
    }
}
