import StarsIcon from '~/components/apr-tooltip/StarsIcon';
import {
    Box,
    Button,
    Flex,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
} from '@chakra-ui/react';
import { useUserPendingRewards } from '~/lib/user/useUserPendingRewards';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import numeral from 'numeral';
import { useGetTokens } from '~/lib/global/useToken';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import BeetsButton from '~/components/button/Button';
import { BeetsBox } from '~/components/box/BeetsBox';
import { useUserData } from '~/lib/user/useUserData';

export function NavbarPendingRewards() {
    const { pendingRewards, pendingRewardsTotalUSD } = useUserPendingRewards();
    const { stakedValueUSD } = useUserData();
    const { getToken } = useGetTokens();
    return (
        <Popover>
            {/*
            //@ts-ignore */}
            <PopoverTrigger>
                <Button
                    variant="unstyled"
                    bgColor="beets.lightAlpha.200"
                    width="54px"
                    height="40px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                >
                    <StarsIcon width={15} height={16} />
                    <Box fontSize="11px" pt="0.5">
                        {numeral(pendingRewardsTotalUSD).format('$0.00a')}
                    </Box>
                </Button>
            </PopoverTrigger>
            <PopoverContent bgColor="beets.base.900">
                <PopoverArrow color="beets.base.900" />
                <PopoverCloseButton />
                <PopoverHeader borderBottomWidth="0">Liquidity incentives</PopoverHeader>
                <PopoverBody>
                    <BeetsBox px="4" py="2">
                        <Box color="gray.200" pb="2" fontSize="sm">
                            Pending rewards
                        </Box>
                        {pendingRewards.map((item) => (
                            <Box fontSize="xl" fontWeight="normal" lineHeight="26px">
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
                            in 16 farms
                        </Box>
                    </BeetsBox>
                    <Box mt="4">
                        <BeetsButton width="full">Harvest all rewards</BeetsButton>
                    </Box>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}
