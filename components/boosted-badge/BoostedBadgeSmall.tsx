import ReaperAaveBoosted from './assets/reaper-aave-boosted-small.png';
import ReaperAaveGranaryBoosted from './assets/reaper-aave-granary-boosted-small.png';
import ReaperSonneBoosted from './assets/reaper-sonne-boosted.png';
import OvernightBoosted from './assets/overnight-boosted-small.png';
import Image from 'next/image';
import { BoostedByType } from '~/lib/config/network-config-type';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import { Box } from '@chakra-ui/react';
import { BoostedByTooltips } from '~/components/boosted-badge/lib/boosted-by-tooltips';

interface Props {
    boostedBy: BoostedByType;
}

export function BoostedBadgeSmall({ boostedBy }: Props) {
    let image = null;

    switch (boostedBy) {
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
    }

    if (image === null) {
        return null;
    }

    return (
        <BeetsTooltip label={BoostedByTooltips[boostedBy]} noImage>
            <Box>{image}</Box>
        </BeetsTooltip>
    );
}
