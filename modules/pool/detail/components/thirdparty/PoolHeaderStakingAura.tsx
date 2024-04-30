import { Link, HStack, Text } from '@chakra-ui/react';
import { CustomTooltip } from '~/components/tooltip/CustomTooltip';
import { networkConfig } from '~/lib/config/network-config';
import Image from 'next/image';
import AuraLogo from '~/assets/logo/aura_iso_colors.png';

export function PoolHeaderStakingAura({ poolId }: { poolId: string }) {
    const url = networkConfig.thirdPartyStakingPools.find((pool) => pool.poolId === poolId)?.url;

    return (
        <CustomTooltip
            trigger={
                <Link mr="2" href={url} isExternal style={{ textDecoration: 'none' }}>
                    <HStack>
                        <Text mr="2" color="beets.base.50">
                            Boosted rewards available on Aura
                        </Text>
                        <Image src={AuraLogo} alt="Aura Finance" height="24px" width="24px" />
                    </HStack>
                </Link>
            }
            content={'For this pool you can deposit & stake your BPT on Aura Finance for extra boosted rewards'}
            border="2px"
            borderColor="aura.pink"
            _hover={{ borderColor: 'aura.purple' }}
            bg="whiteAlpha.300"
        />
    );
}
