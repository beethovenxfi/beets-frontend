import { Link, HStack, Text } from '@chakra-ui/react';
import { CustomTooltip } from '~/components/tooltip/CustomTooltip';
import { networkConfig } from '~/lib/config/network-config';
import Image from 'next/image';
import MerklLogo from '~/assets/logo/merkl2x.png';

export function PoolHeaderStakingMerkl({ poolId }: { poolId: string }) {
    const url = networkConfig.thirdPartyStakingPools.find((pool) => pool.poolId === poolId)?.url;

    return (
        <CustomTooltip
            trigger={
                <Link mr="2" href={url} isExternal style={{ textDecoration: 'none' }}>
                    <HStack>
                        <Text mr="2" color="beets.base.50">
                            Earn rewards on Merkl
                        </Text>
                        <Image src={MerklLogo} alt="Merkl" height="24px" width="24px" />
                    </HStack>
                </Link>
            }
            content={'For this pool you can earn rewards on Merkl'}
            border="2px"
            borderColor="merkl.melrose"
            _hover={{ borderColor: 'white' }}
            bg="whiteAlpha.300"
        />
    );
}
