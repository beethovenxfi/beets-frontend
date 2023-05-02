import StarsIcon from '~/components/apr-tooltip/StarsIcon';
import {
    Box,
    Button,
    Divider,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Skeleton,
    Stack,
    useBreakpointValue,
    VStack,
} from '@chakra-ui/react';
import { useUserPendingRewards } from '~/lib/user/useUserPendingRewards';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { useGetTokens } from '~/lib/global/useToken';

import { BeetsBox } from '~/components/box/BeetsBox';
import { useUserData } from '~/lib/user/useUserData';

import { useUserHarvestAllPendingRewards } from './lib/useUserHarvestAllPendingRewards';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { NavbarPendingRewardsReliquary } from './NavbarPendingRewardsReliquary';
import { useReliquaryPendingRewards } from '../reliquary/lib/useReliquaryPendingRewards';
import { sumBy } from 'lodash';

export function NavbarPendingRewards() {
    const {
        pendingRewards,
        pendingRewardsTotalUSD,
        staking,
        stakingType,
        isLoading: pendingRewardsLoading,
    } = useUserPendingRewards();
    const { stakedValueUSD, loading: userDataLoading } = useUserData();
    const { priceForAmount, getToken } = useGetTokens();
    const loading = pendingRewardsLoading || userDataLoading;
    const { harvestAll, ...harvestQuery } = useUserHarvestAllPendingRewards();
    //const farmIds = staking.map((stake) => stake?.farm?.id || '');
    const isMasterChefOrFreshBeets = stakingType === 'MASTER_CHEF' || stakingType === 'FRESH_BEETS';
    const isMobile = useBreakpointValue({ base: true, lg: false });

    const { data: pendingReliquaryRewards } = useReliquaryPendingRewards();

    const pendingReliquaryRewardsTotalUSD = sumBy(
        pendingReliquaryRewards?.rewards.map((reward) => priceForAmount(reward)),
    );

    const totalPendingRewardsUSD = pendingRewardsTotalUSD + pendingReliquaryRewardsTotalUSD;

    return (
        <Popover>
            {/*
            //@ts-ignore */}
            <PopoverTrigger>
                <Button
                    variant="navbarIconTrigger"
                    width="60px"
                    height="40px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    disabled={loading}
                    _disabled={{ opacity: 1.0, cursor: 'not-allowed' }}
                >
                    <StarsIcon width={15} height={16} />

                    {loading ? (
                        <Skeleton height="7.5px" width="36px" mt="1.5" mb="2px" />
                    ) : (
                        <Box fontSize="11px" pt="0.5">
                            {numberFormatUSDValue(totalPendingRewardsUSD)}
                        </Box>
                    )}
                    <Skeleton />
                </Button>
            </PopoverTrigger>
            <PopoverContent bgColor="beets.base.900" _focus={{ boxShadow: 'none' }} w="full">
                <PopoverArrow color="beets.base.900" />
                <PopoverCloseButton />
                <PopoverHeader borderBottomWidth="0">Liquidity incentives</PopoverHeader>
                <PopoverBody>
                    <Stack direction={['column', 'row']} minW={{ base: undefined, lg: '500px' }}>
                        <NavbarPendingRewardsReliquary
                            w={{ base: 'full', lg: '48%' }}
                            mr={{ base: undefined, lg: '2' }}
                        />
                        {isMobile && <Divider orientation="horizontal" w={{ base: 'full', lg: '2%' }} />}
                        <VStack alignItems="stretch" w={{ base: 'full', lg: '48%' }} spacing="4">
                            <BeetsBox px="4" py="2" flexGrow="1">
                                <Box color="gray.200" pb="2" fontSize="sm">
                                    Pending pool rewards
                                </Box>
                                {pendingRewards.length > 0
                                    ? pendingRewards.map((item) => (
                                          <Box fontSize="xl" fontWeight="normal" lineHeight="26px" key={item.address}>
                                              {tokenFormatAmount(item.amount)} {getToken(item.address)?.symbol}
                                          </Box>
                                      ))
                                    : 'No pending pool rewards'}
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
                                    in {staking.length} {isMasterChefOrFreshBeets ? 'farm(s)' : 'gauge(s)'}
                                </Box>
                            </BeetsBox>

                            <Box mt="4" justifySelf="flex-end">
                                <BeetsSubmitTransactionButton
                                    {...harvestQuery}
                                    isDisabled={pendingRewardsTotalUSD < 0.01 || !isMasterChefOrFreshBeets}
                                    onClick={() => harvestAll([])}
                                    width="full"
                                >
                                    Claim all pool rewards
                                </BeetsSubmitTransactionButton>
                            </Box>
                        </VStack>
                    </Stack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}
