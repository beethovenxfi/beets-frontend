import { Box } from '@chakra-ui/react';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import Image from 'next/image';
import FmoneyLogo from '~/assets/logo/fmoney-pfp.png';

export function PoolListItemStakingFmoney() {
    return (
        <BeetsTooltip label="For this pool you can deposit & stake your BPT on fMoney Markets for rewards" noImage>
            <Box ml="2" mt="1">
                <Image src={FmoneyLogo} alt="fMoney Markets" height="24px" width="24px" className="icon-shadow" />
            </Box>
        </BeetsTooltip>
    );
}
