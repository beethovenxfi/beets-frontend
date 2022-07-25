import { Badge } from '@chakra-ui/layout';
import numeral from 'numeral';
import { BadgeProps } from '@chakra-ui/react';

interface Props extends BadgeProps {
    percentChange: number;
}

export function PercentChangeBadge({ percentChange, ...rest }: Props) {
    return (
        <Badge colorScheme={percentChange >= 0 ? 'green' : 'red'} {...rest}>
            {numeral(percentChange).format('0.00%')}
        </Badge>
    );
}
