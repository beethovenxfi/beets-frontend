import { Box } from '@chakra-ui/react';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import Image from 'next/image';
import GyroLogo from '~/assets/logo/gyro-white.png';

export function PoolListItemInvestingGyro() {
    return (
        <BeetsTooltip label="bla bla bla" noImage>
            <Box ml="2" mt="1">
                <Image src={GyroLogo} alt="Gyro Finance" height="24px" width="24px" className="icon-shadow" />
            </Box>
        </BeetsTooltip>
    );
}
