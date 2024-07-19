import { Box } from '@chakra-ui/react';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import Image from 'next/image';
import PointsIcon from '~/assets/icons/points.svg';

export function PoolListItemPoints() {
    return (
        <BeetsTooltip label="Liquidity providers in this pool also earn partner points" noImage>
            <Box ml="2" mt="1">
                <Image src={PointsIcon} alt="Points" height="24px" width="24px" />
            </Box>
        </BeetsTooltip>
    );
}
