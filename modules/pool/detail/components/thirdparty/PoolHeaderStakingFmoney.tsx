import { Link, HStack, Text } from '@chakra-ui/react';
import { CustomTooltip } from '~/components/tooltip/CustomTooltip';
import { networkConfig } from '~/lib/config/network-config';
import Image from 'next/image';
import FmoneyLogo from '~/assets/logo/fmoney-pfp.png';

export function PoolHeaderStakingFmoney({ poolId }: { poolId: string }) {
    const url = networkConfig.thirdPartyStakingPools.find((pool) => pool.poolId === poolId)?.url;

    return (
        <CustomTooltip
            trigger={
                <Link mr="2" href={url} isExternal style={{ textDecoration: 'none' }}>
                    <HStack>
                        <Text mr="2" color="beets.base.50">
                            Rewards available on fMoney Markets
                        </Text>
                        <Image src={FmoneyLogo} alt="fMoney Markets" height="24px" width="24px" />
                    </HStack>
                </Link>
            }
            content={'For this pool you can deposit & stake your BPT on fMoney Markets for rewards'}
            border="2px"
            borderColor="fmoney.green.100"
            _hover={{ borderColor: 'fmoney.green.400' }}
            bg="whiteAlpha.300"
        />
    );
}
