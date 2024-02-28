import ReaperAaveBoosted from './assets/reaper-aave-boosted-small.png';
import ReaperAaveGranaryBoosted from './assets/reaper-aave-granary-boosted-small.png';
import ReaperSonneBoosted from './assets/reaper-sonne-boosted.png';
import OvernightBoosted from './assets/overnight-boosted-small.png';
import ReaperBoosted from './assets/reaper-boosted.png';
import BeefyExactlyBoosted from './assets/boosted-by-beefy-exactly.png';
import GyroscopeBuilt from './assets/gyro-short.svg';
import Image from 'next/image';
import { PoolBadgeType } from '~/lib/config/network-config-type';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import { Box, Text } from '@chakra-ui/react';
import { PoolBadgeTooltips } from '~/components/pool-badge/lib/pool-badge-tooltips';
import Experimental from './assets/badge-experimental.gif';

interface Props {
    poolBadge: PoolBadgeType;
}

export function PoolBadgeSmall({ poolBadge }: Props) {
    let image = null;

    switch (poolBadge) {
        case 'reaper-aave':
            image = <Image src={ReaperAaveBoosted} alt="Reaper, AAVE boosted" height="28px" width="96px" />;
            break;
        case 'reaper-aave-granary':
            image = (
                <Image src={ReaperAaveGranaryBoosted} alt="Reaper, AAVE, Granary boosted" height="28px" width="96px" />
            );
            break;
        case 'overnight':
            image = <Image src={OvernightBoosted} alt="Overnight boosted" height="28px" width="96px" />;
            break;
        case 'reaper-sonne':
            image = <Image src={ReaperSonneBoosted} alt="Reaper, Sonne boosted" height="28px" width="96px" />;
            break;
        case 'yearn':
            return null;
        case 'reaper':
            image = <Image src={ReaperBoosted} alt="Reaper boosted" height="28px" width="96px" />;
            break;
        case 'beefy-exactly':
            image = <Image src={BeefyExactlyBoosted} alt="Beefy, Exactly boosted" height="28px" width="96px" />;
            break;
        case 'gyroscope':
            image = <Image src={GyroscopeBuilt} alt="Built by Gyroscope" height="28px" width="96px" />;
            break;
        case 'experimental':
            image = image = <Image src={Experimental} alt="Experimental" height="28px" width="96px" />;
            break;
    }

    if (image === null) {
        return null;
    }

    return (
        <BeetsTooltip label={PoolBadgeTooltips[poolBadge]} noImage>
            <Box>{image}</Box>
        </BeetsTooltip>
    );
}
