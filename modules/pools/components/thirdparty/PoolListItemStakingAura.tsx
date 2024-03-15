import { Box } from '@chakra-ui/react';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import Image from 'next/image';
import AuraLogo from '~/assets/logo/aura_iso_colors.png';

export function PoolListItemStakingAura() {
    return (
        <BeetsTooltip
            label="For this pool you can deposit & stake your BPT on Aura Finance for extra boosted rewards"
            noImage
        >
            <Box ml="2" mt="1">
                <Image src={AuraLogo} alt="Aura Finance" height="24px" width="24px" className="icon-shadow" />
            </Box>
        </BeetsTooltip>
    );
}
