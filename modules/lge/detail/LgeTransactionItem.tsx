import { GqlPoolSwap } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Text, Link, Grid, GridItem } from '@chakra-ui/react';
import { BoxProps, HStack } from '@chakra-ui/layout';
import { ExternalLink } from 'react-feather';
import { etherscanGetAddressUrl } from '~/lib/util/etherscan';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { format } from 'date-fns';
import { addressShortDisplayName } from '~/lib/util/address';
import { useGetTokens } from '~/lib/global/useToken';

export enum LgeTransactionType {
    Buy = 'BUY',
    Sell = 'SELL',
}

export type LgeTransaction = {
    transaction: GqlPoolSwap;
    type: LgeTransactionType;
};

interface Props extends BoxProps {
    transaction: LgeTransaction;
    launchTokenSymbol: string;
    launchTokenAddress: string;
}

const TxToReadableMap: Record<LgeTransactionType, string> = {
    [LgeTransactionType.Sell]: 'Sell',
    [LgeTransactionType.Buy]: 'Buy',
};

function LgeTransactionAction(props: LgeTransaction) {
    const getColor = () => {
        if (props.type === LgeTransactionType.Buy) {
            return 'beets.green';
        }
        if (props.type === LgeTransactionType.Sell) {
            return 'beets.red';
        }
    };

    return (
        <HStack>
            <Text color={getColor()} textStyle="" fontSize="md">
                {TxToReadableMap[props.type]}
            </Text>
        </HStack>
    );
}

export default function LgeTransactionItem({ transaction, launchTokenSymbol, launchTokenAddress, ...rest }: Props) {
    const { getToken, priceFor } = useGetTokens();

    const time = format(new Date(transaction.transaction.timestamp * 1000), "MMM d 'at' H:mm");
    const tokenIn = getToken(transaction.transaction.tokenIn)?.symbol ?? launchTokenSymbol;
    const tokenOut = getToken(transaction.transaction.tokenOut)?.symbol ?? launchTokenSymbol;
    const price =
        transaction.transaction.tokenOut === launchTokenAddress
            ? (parseFloat(transaction.transaction.tokenAmountIn) / parseFloat(transaction.transaction.tokenAmountOut)) *
              priceFor(transaction.transaction.tokenIn)
            : (parseFloat(transaction.transaction.tokenAmountOut) / parseFloat(transaction.transaction.tokenAmountIn)) *
              priceFor(transaction.transaction.tokenOut);

    return (
        <Grid
            px="4"
            py={{ base: '4', lg: '2' }}
            templateColumns={{
                base: '1fr 1fr',
                lg: 'repeat(6, 1fr)',
            }}
            gap="0"
            templateAreas={{
                base: `"time type"
                        "input output"
                        "price wallet"`,
                lg: `"time type input output price wallet"`,
            }}
            bgColor="rgba(255,255,255,0.05)"
            _hover={{ bg: 'beets.base.800' }}
        >
            <GridItem area="time">
                <Text fontSize="md">{time}</Text>
            </GridItem>
            <GridItem area="type">
                <Text fontSize="md">
                    <LgeTransactionAction {...transaction} />
                </Text>
            </GridItem>
            <GridItem area="input">
                <Text fontSize="md">{`${numberFormatUSDValue(
                    transaction.transaction.tokenAmountIn,
                    false,
                )} ${tokenIn}`}</Text>
            </GridItem>
            <GridItem area="output">
                <Text fontSize="md">{`${numberFormatUSDValue(
                    transaction.transaction.tokenAmountOut,
                    false,
                )} ${tokenOut}`}</Text>
            </GridItem>
            <GridItem area="price">
                <Text fontSize="md">{numberFormatUSDValue(price)}</Text>
            </GridItem>
            <GridItem area="wallet">
                <Text fontSize="md">
                    <Link href={etherscanGetAddressUrl(transaction.transaction.userAddress)} target="_blank">
                        <HStack spacing="1">
                            <Box>{addressShortDisplayName(transaction.transaction.userAddress)}</Box>
                            <ExternalLink size={16} />
                        </HStack>
                    </Link>
                </Text>
            </GridItem>
        </Grid>
    );
}
