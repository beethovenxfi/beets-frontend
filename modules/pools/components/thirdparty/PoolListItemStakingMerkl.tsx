import { Box } from '@chakra-ui/react';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import Image from 'next/image';
import MerklLogo from '~/assets/logo/merkl-32x32.png';

export function PoolListItemStakingMerkl() {
    return (
        <BeetsTooltip label="For this pool you can earn rewards on Merkl" noImage>
            <Box ml="2" mt="1">
                <Image src={MerklLogo} alt="Merkl" height="24px" width="24px" />
            </Box>
        </BeetsTooltip>
    );
}
