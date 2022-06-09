import {
    GqlPoolJoinExit,
    GqlPoolJoinExitType,
    GqlPoolMinimalFragment,
    GqlPoolSwap,
} from '~/apollo/generated/graphql-codegen-generated';
import { Box, Flex, Text } from '@chakra-ui/react';
import TokenAvatarSet from '~/components/token/TokenAvatarSet';
import Link from 'next/link';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { BoxProps, HStack } from '@chakra-ui/layout';
import { ArrowRight, ExternalLink, Minus, Plus, Zap } from 'react-feather';
import { TokenAmountPill } from '~/components/token/TokenAmountPill';
import { formatDistanceToNow } from 'date-fns';

export enum PoolTransactionType {
    Swap = 'SWAP',
    Join = 'JOIN',
    Exit = 'EXIT',
}

export type PoolTransaction = {
    transaction: GqlPoolJoinExit | GqlPoolSwap;
    type: PoolTransactionType;
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
            return 'beets.green.400';
        }
        if (props.type === PoolTransactionType.Exit) {
            return 'beets.red.300';
        }
        if (props.type === PoolTransactionType.Swap) {
            return 'beets.green.400';
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
    return (
        <HStack spacing="2" alignItems="center">
            {isInvestAction &&
                (props.transaction as GqlPoolJoinExit).amounts
                    .filter((tokenAmount) => tokenAmount.amount !== '0')
                    .map((tokenAmount, index) => (
                        <TokenAmountPill
                            fontSize="md"
                            key={index}
                            amount={tokenAmount.amount}
                            address={tokenAmount.address}
                        />
                    ))}
            {!isInvestAction && (
                <>
                    <TokenAmountPill
                        fontSize="md"
                        amount={(props.transaction as GqlPoolSwap).tokenAmountIn}
                        address={(props.transaction as GqlPoolSwap).tokenIn}
                    />
                    <Box mx={2}>
                        <ArrowRight />
                    </Box>
                    <TokenAmountPill
                        fontSize="md"
                        amount={(props.transaction as GqlPoolSwap).tokenAmountOut}
                        address={(props.transaction as GqlPoolSwap).tokenOut}
                    />
                </>
            )}
        </HStack>
    );
}

export default function PoolTransactionItem({ transaction, ...rest }: Props) {
    const getFormattedValue = () => {
        return numeral(transaction.transaction.valueUSD).format('$0,0.000');
    };
    return (
        <Box bg='rgba(255,255,255,0.05)' {...rest}>
            <Flex px="4" py="4" cursor="pointer" alignItems={'center'} fontSize="lg" _hover={{ bg: '#100C3A' }}>
                <Box width="200px">
                    <PoolTransactionAction {...transaction} />
                </Box>
                <Box flex={1} textAlign="left">
                    <Pool {...transaction} />
                </Box>
                <Box w="200px" textAlign="right">
                    <Text fontSize="md">{getFormattedValue()}</Text>
                </Box>
                <Box w="200px" textAlign="right">
                    <HStack width='full' justifyContent='flex-end'>
                        <Text fontSize="md">
                            {formatDistanceToNow(new Date(transaction.transaction.timestamp * 1000), {
                                addSuffix: true,
                            })}
                        </Text>
                        <ExternalLink size={14} />
                    </HStack>
                </Box>
            </Flex>
        </Box>
    );
}
