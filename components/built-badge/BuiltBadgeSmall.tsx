import GyroscopeBuilt from './assets/built-by-gyroscope.png';
import Image from 'next/image';
import { BuiltByType } from '~/lib/config/network-config-type';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import { Box } from '@chakra-ui/react';
import { BuiltByTooltips } from '~/components/built-badge/lib/built-by-tooltips';

interface Props {
    builtBy: BuiltByType;
}

export function BuiltBadgeSmall({ builtBy }: Props) {
    let image = null;

    switch (builtBy) {
        case 'gyroscope':
            image = <Image src={GyroscopeBuilt} alt="Built by Gyroscope" height="28px" width="96px" />;
            break;
    }

    if (image === null) {
        return null;
    }

    return (
        <BeetsTooltip label={BuiltByTooltips[builtBy]} noImage>
            <Box>{image}</Box>
        </BeetsTooltip>
    );
}
