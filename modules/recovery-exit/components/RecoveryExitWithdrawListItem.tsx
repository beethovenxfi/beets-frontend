import { BoxProps } from '@chakra-ui/layout';
import { GqlPoolMinimalFragment } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Button, Grid, GridItem, GridItemProps, Text } from '@chakra-ui/react';
import { memo } from 'react';
import { TokenAvatarSetInList, TokenAvatarSetInListTokenData } from '~/components/token/TokenAvatarSetInList';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { useDoRecoveryExit } from '~/modules/recovery-exit/lib/useDoRecoveryExit';

interface Props extends BoxProps {
    pool: GqlPoolMinimalFragment;
    poolTokens: string[];
    tokens: TokenAvatarSetInListTokenData[];
    userBalance: AmountHumanReadable;
    userBalanceValue: number;
    onSettled: () => void;
}

const MemoizedTokenAvatarSetInList = memo(TokenAvatarSetInList);

export function RecoveryExitWithdrawListItem({
    pool,
    tokens,
    userBalance,
    userBalanceValue,
    poolTokens,
    onSettled,
    ...rest
}: Props) {
    const userBalanceNum = parseFloat(userBalance);
    const { doRecoveryExit } = useDoRecoveryExit(pool, poolTokens, onSettled);

    return (
        <Box {...rest}>
            <Grid px="4" py="4" gap="0" templateColumns="70px 1fr 130px 130px 120px">
                <GridItem>
                    <MemoizedTokenAvatarSetInList imageSize={25} width={92} tokens={tokens} />
                </GridItem>
                <GridItem>
                    <Text fontSize="md" fontWeight="normal">
                        {pool.name}
                    </Text>
                </GridItem>
                <GridItem>
                    <Text fontSize="md" fontWeight="normal" textAlign="right">
                        {userBalanceNum > 0 && userBalanceNum < 0.000001
                            ? '< 0.000001'
                            : tokenFormatAmount(userBalance)}
                    </Text>
                </GridItem>
                <GridItem>
                    <Text fontSize="md" fontWeight="normal" textAlign="right">
                        {numberFormatUSDValue(userBalanceValue)}
                    </Text>
                </GridItem>

                <GridItem textAlign="right">
                    <Button
                        onClick={() => {
                            doRecoveryExit(userBalance);
                        }}
                        variant="outline"
                        size="xs"
                        color="beets.green"
                    >
                        Withdraw
                    </Button>
                </GridItem>
            </Grid>
        </Box>
    );
}
