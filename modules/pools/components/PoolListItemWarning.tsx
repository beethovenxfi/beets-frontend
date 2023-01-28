import { AlertTriangle } from 'react-feather';
import { Box, BoxProps } from '@chakra-ui/react';
import { BoostedByTooltips } from '~/components/boosted-badge/lib/boosted-by-tooltips';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';

interface Props extends BoxProps {
    message: string;
}

export function PoolListItemWarning({ message, ...rest }: Props) {
    return (
        <Box {...rest}>
            <BeetsTooltip label={message} noImage>
                <Box color="yellow.500">
                    <AlertTriangle size={18} />
                </Box>
            </BeetsTooltip>
        </Box>
    );
}
