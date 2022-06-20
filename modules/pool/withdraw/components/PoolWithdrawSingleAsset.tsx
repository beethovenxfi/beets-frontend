import {
    Box,
    Container,
    ContainerProps,
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    Link,
    Text,
} from '@chakra-ui/react';
import TokenAvatar from '~/components/token/TokenAvatar';
import { useWithdrawState } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { usePool } from '~/modules/pool/lib/usePool';
import { BoxProps } from '@chakra-ui/layout';
import { usePoolExitGetSingleAssetWithdrawForBptIn } from '~/modules/pool/withdraw/lib/usePoolExitGetSingleAssetWithdrawForBptIn';
import { usePoolExitGetBptInForSingleAssetWithdraw } from '~/modules/pool/withdraw/lib/usePoolExitGetBptInForSingleAssetWithdraw';

interface Props extends BoxProps {}

export function PoolWithdrawSingleAsset({ ...rest }: Props) {
    const { allTokens } = usePool();
    const { singleAssetWithdraw, setSingleAssetWithdrawAmount } = useWithdrawState();
    const singleAssetWithdrawForBptIn = usePoolExitGetSingleAssetWithdrawForBptIn();
    const maxAmount = singleAssetWithdrawForBptIn.data?.tokenAmount || '0';
    const bptInForSingleAssetWithdraw = usePoolExitGetBptInForSingleAssetWithdraw();
    const priceImpact = bptInForSingleAssetWithdraw.data?.priceImpact;

    const withdrawToken = allTokens.find((token) => token.address === singleAssetWithdraw?.address);

    if (!singleAssetWithdraw || !withdrawToken) {
        return null;
    }

    //TODO: precision
    const isValid =
        singleAssetWithdraw.amount === '' || parseFloat(singleAssetWithdraw.amount) <= parseFloat(maxAmount);

    return (
        <Box py={4} {...rest}>
            <InputGroup>
                <InputLeftElement pointerEvents="none" height="full" justifyContent="flex-start" ml={1}>
                    <TokenAvatar address={withdrawToken.address} size="xs" mr={2} />
                    <Text>{withdrawToken.symbol}</Text>
                </InputLeftElement>
                <Input
                    type="number"
                    placeholder={'0.0'}
                    textAlign="right"
                    size="lg"
                    value={singleAssetWithdraw.amount || ''}
                    onChange={(e) => {
                        setSingleAssetWithdrawAmount({
                            address: withdrawToken.address,
                            amount: e.target.value,
                        });
                    }}
                    isInvalid={!isValid}
                />
            </InputGroup>
            <Flex>
                <Box flex={1}>
                    <Text color="gray.500">
                        {maxAmount}
                        {parseFloat(maxAmount) > 0 ? (
                            <Link
                                ml={2}
                                color="green.300"
                                userSelect="none"
                                onClick={() => {
                                    //setInputAmount(option.poolTokenAddress, userBalance);
                                }}
                            >
                                Max
                            </Link>
                        ) : null}
                    </Text>
                </Box>
            </Flex>
            {!isValid ? <Text color="red.500">Exceeds wallet balance</Text> : null}
            <Box pt={4}>Price impact: {priceImpact}</Box>
        </Box>
    );
}
