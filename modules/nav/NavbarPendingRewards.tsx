import StarsIcon from '~/components/apr-tooltip/StarsIcon';
import {
    Box,
    Button,
    Grid,
    GridItem,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Skeleton,
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
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

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
    const farmIds = staking.map((stake) => stake?.farm?.id || '');
    const isMasterChefOrFreshBeets = stakingType === 'MASTER_CHEF' || stakingType === 'FRESH_BEETS';
    const isMobile = useBreakpointValue({ base: true, lg: false });
    const networkConfig = useNetworkConfig();

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
                            {numberFormatUSDValue(totalPendingRewardsUSD)}
                        </Box>
                    )}
                    <Skeleton />
                </Button>
            </PopoverTrigger>
            <PopoverContent bgColor="beets.base.900" _focus={{ boxShadow: 'none' }} w="full" minW="320px">
                <PopoverArrow color="beets.base.900" />
                <PopoverCloseButton />
                <PopoverHeader borderBottomWidth="0">Liquidity incentives</PopoverHeader>
                <PopoverBody>
                    <Grid
                        gap={networkConfig.maBeetsEnabled ? '4' : '0'}
                        templateColumns={{ base: '1fr', lg: `${networkConfig.maBeetsEnabled ? '1fr 1fr' : '1fr'}` }}
                        templateAreas={{
                            base: `"pool"
                                    "reliquary"`,
                            lg: `"pool reliquary"`,
                        }}
                    >
                        {networkConfig.maBeetsEnabled && (
                            <GridItem area="reliquary">
                                <NavbarPendingRewardsReliquary />
                            </GridItem>
                        )}
                        <GridItem area="pool">
                            <VStack alignItems="stretch" spacing="4">
                                <BeetsBox px="4" py="2" flexGrow="1">
                                    <Box color="gray.200" pb="2" fontSize="sm">
                                        Pending pool rewards
                                    </Box>
                                    {pendingRewards.length > 0 ? (
                                        pendingRewards.map((item) => (
                                            <Box fontSize="xl" fontWeight="normal" lineHeight="26px" key={item.address}>
                                                {tokenFormatAmount(item.amount)} {getToken(item.address)?.symbol}
                                            </Box>
                                        ))
                                    ) : (
                                        <Box fontSize="md" fontWeight="normal" lineHeight="26px">
                                            No pending pool rewards
                                        </Box>
                                    )}
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
                                        onClick={() => harvestAll(farmIds)}
                                        width="full"
                                    >
                                        Claim all pool rewards
                                    </BeetsSubmitTransactionButton>
                                </Box>
                            </VStack>
                        </GridItem>
                    </Grid>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}
