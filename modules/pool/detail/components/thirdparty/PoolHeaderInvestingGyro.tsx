import { Link, HStack, Text } from '@chakra-ui/react';
import { CustomTooltip } from '~/components/tooltip/CustomTooltip';
import { networkConfig } from '~/lib/config/network-config';
import Image from 'next/image';
import GyroLogo from '~/assets/logo/gyro-white.png';

export function PoolHeaderInvestingGyro({ poolId }: { poolId: string }) {
    const url = networkConfig.thirdPartyStakingPools.find((pool) => pool.poolId === poolId)?.url;

    return (
        <CustomTooltip
            trigger={
                <Link mr="2" href={url} isExternal style={{ textDecoration: 'none' }}>
                    <HStack>
                        <Text mr="2" color="beets.base.50">
                            Join & manage this pool on Gyroscope
                        </Text>
                        <Image src={GyroLogo} alt="Gyroscope" height="24px" width="24px" />
                    </HStack>
                </Link>
            }
            content="Go to Gyroscope to join & manage this pool using the underlying token(s), aToken(s) or static aToken(s)"
            border="2px"
            borderColor="aura.pink"
            _hover={{ borderColor: 'aura.purple' }}
            bg="whiteAlpha.300"
        />
    );
}
