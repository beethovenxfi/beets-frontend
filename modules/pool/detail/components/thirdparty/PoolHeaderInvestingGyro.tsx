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
                            Get static aTokens on Gyro first?
                        </Text>
                        <Image src={GyroLogo} alt="Aura Finance" height="24px" width="24px" />
                    </HStack>
                </Link>
            }
            content={'bla bla bla'}
            border="2px"
            borderColor="aura.pink"
            _hover={{ borderColor: 'aura.purple' }}
            bg="whiteAlpha.300"
        />
    );
}
