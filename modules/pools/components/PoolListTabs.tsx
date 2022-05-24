import { Box, Flex } from '@chakra-ui/react';
import { usePoolList } from '~/modules/pools/usePoolList';
import { PoolListTabButton } from '~/modules/pools/components/PoolListTabButton';
import { useAccount } from 'wagmi';

export function PoolListTabs() {
    const { data: accountData } = useAccount();
    const connected = !!accountData?.address;
    const { state, refetch, setShowMyInvestments, showMyInvestments } = usePoolList();
    const categoryIn = state.where?.categoryIn;

    return (
        <Box>
            <Flex>
                <PoolListTabButton
                    tabPosition="left"
                    text="Incentivized pools"
                    selected={!showMyInvestments && !!categoryIn?.includes('INCENTIVIZED')}
                    onClick={() => {
                        if (!categoryIn?.includes('INCENTIVIZED') || showMyInvestments) {
                            setShowMyInvestments(false);
                            refetch({
                                ...state,
                                where: {
                                    ...state.where,
                                    categoryIn: ['INCENTIVIZED'],
                                    categoryNotIn: null,
                                },
                            });
                        }
                    }}
                />
                <PoolListTabButton
                    tabPosition="middle"
                    text="Community pools"
                    selected={!showMyInvestments && !categoryIn?.includes('INCENTIVIZED')}
                    onClick={() => {
                        if (categoryIn?.includes('INCENTIVIZED') || showMyInvestments) {
                            setShowMyInvestments(false);
                            refetch({
                                ...state,
                                where: {
                                    ...state.where,
                                    categoryIn: null,
                                    categoryNotIn: ['INCENTIVIZED'],
                                },
                            });
                        }
                    }}
                />

                <PoolListTabButton
                    tabPosition="right"
                    text="My investments"
                    selected={showMyInvestments}
                    onClick={() => {
                        if (!showMyInvestments) {
                            setShowMyInvestments(true);
                        }
                    }}
                />
            </Flex>
        </Box>
    );
}
