import { BoxProps } from '@chakra-ui/layout';
import { GqlPoolMinimalFragment } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Button, Grid, GridItem, GridItemProps, Text } from '@chakra-ui/react';
import { memo } from 'react';
import { TokenAvatarSetInList, TokenAvatarSetInListTokenData } from '~/components/token/TokenAvatarSetInList';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { useDoRecoveryExit } from '~/modules/recovery-exit/lib/useDoRecoveryExit';
import { useStakingWithdraw } from '~/lib/global/useStakingWithdraw';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';

interface Props extends BoxProps {
    pool: GqlPoolMinimalFragment;
    poolTokens: string[];
    tokens: TokenAvatarSetInListTokenData[];
    userBalance: AmountHumanReadable;
    userBalanceValue: number;
    gaugeBalance: AmountHumanReadable;
    onSettled: () => void;
    refetchGaugeBalances: () => void;
}

const MemoizedTokenAvatarSetInList = memo(TokenAvatarSetInList);

export function RecoveryExitWithdrawListItem({
    pool,
    tokens,
    userBalance,
    userBalanceValue,
    gaugeBalance,
    poolTokens,
    refetchGaugeBalances,
    onSettled,
    ...rest
}: Props) {
    const userBalanceNum = parseFloat(userBalance);
    const gaugeBalanceNum = parseFloat(gaugeBalance);
    const { doRecoveryExit } = useDoRecoveryExit(pool, poolTokens, onSettled);
    const { withdraw, ...stakingWithdrawQuery } = useStakingWithdraw(pool.staking);

    return (
        <Box {...rest}>
            <Grid px="4" py="4" gap="0" templateColumns="70px 1fr 130px 130px 130px 120px">
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
                        {gaugeBalanceNum > 0 && gaugeBalanceNum < 0.000001
                            ? '< 0.000001'
                            : tokenFormatAmount(gaugeBalance)}
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
                    {gaugeBalance !== '0.0' && (
                        <BeetsSubmitTransactionButton
                            {...stakingWithdrawQuery}
                            onClick={() => {
                                withdraw(gaugeBalance);
                            }}
                            onConfirmed={() => refetchGaugeBalances()}
                            submittingText=""
                            pendingText=""
                            variant="outline"
                            size="xs"
                            color="beets.green"
                        >
                            Unstake
                        </BeetsSubmitTransactionButton>
                    )}
                    {userBalance !== '0.0' && (
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
                    )}
                </GridItem>
            </Grid>
        </Box>
    );
}
