import StarsIcon from '~/components/apr-tooltip/StarsIcon';
import {
    Box,
    Button,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Skeleton,
} from '@chakra-ui/react';
import { useUserPendingRewards } from '~/lib/user/useUserPendingRewards';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import numeral from 'numeral';
import { useGetTokens } from '~/lib/global/useToken';

import { BeetsBox } from '~/components/box/BeetsBox';
import { useUserData } from '~/lib/user/useUserData';

import { useUserHarvestAllPendingRewards } from './lib/useUserHarvestAllPendingRewards';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';

export function NavbarPendingRewards() {
    const {
        pendingRewards,
        pendingRewardsTotalUSD,
        staking,
        stakingType,
        isLoading: pendingRewardsLoading,
    } = useUserPendingRewards();
    const { stakedValueUSD, loading: userDataLoading } = useUserData();
    const { getToken } = useGetTokens();
    const loading = pendingRewardsLoading || userDataLoading;
    const { harvestAll, ...harvestQuery } = useUserHarvestAllPendingRewards();
    const farmIds = staking.map((stake) => stake?.farm?.id || '');

    return (
        <Popover>
            {/*
            //@ts-ignore */}
            <PopoverTrigger>
                <Button
                    bgColor="beets.lightAlpha.200"
                    width="60px"
                    height="40px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    disabled={loading}
                    _disabled={{ opacity: 1.0, cursor: 'not-allowed' }}
                    _hover={{ transform: 'scale(1.1)' }}
                >
                    <StarsIcon width={15} height={16} />

                    {loading ? (
                        <Skeleton height="7.5px" width="36px" mt="1.5" mb="2px" />
                    ) : (
                        <Box fontSize="11px" pt="0.5">
                            {numeral(pendingRewardsTotalUSD).format('$0.00a')}
                        </Box>
                    )}
                    <Skeleton />
                </Button>
            </PopoverTrigger>
            <PopoverContent bgColor="beets.base.900" _focus={{ boxShadow: 'none' }}>
                <PopoverArrow color="beets.base.900" />
                <PopoverCloseButton />
                <PopoverHeader borderBottomWidth="0">Liquidity incentives</PopoverHeader>
                <PopoverBody>
                    <BeetsBox px="4" py="2">
                        <Box color="gray.200" pb="2" fontSize="sm">
                            Pending rewards
                        </Box>
                        {pendingRewards.map((item) => (
                            <Box fontSize="xl" fontWeight="normal" lineHeight="26px" key={item.address}>
                                {numeral(item.amount).format('0.0000')} {getToken(item.address)?.symbol}
                            </Box>
                        ))}
                        <Box pt="2" color="gray.200">
                            {numberFormatUSDValue(pendingRewardsTotalUSD)}
                        </Box>
                    </BeetsBox>
                    <BeetsBox mt="4" px="4" py="2">
                        <Box color="gray.200" pb="2" fontSize="sm">
                            Total staked
                        </Box>
                        <Box fontSize="xl" fontWeight="normal" lineHeight="26px">
                            {numberFormatUSDValue(stakedValueUSD)}
                        </Box>
                        <Box color="gray.200" pt="2" fontSize="sm">
                            in {staking.length} {stakingType === 'MASTER_CHEF' ? 'farm(s)' : 'gauge(s)'}
                        </Box>
                    </BeetsBox>
                    <Box mt="4">
                        <BeetsSubmitTransactionButton
                            {...harvestQuery}
                            isDisabled={pendingRewardsTotalUSD < 0.01}
                            onClick={() => harvestAll(farmIds)}
                            width="full"
                        >
                            Claim all rewards
                        </BeetsSubmitTransactionButton>
                    </Box>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}
