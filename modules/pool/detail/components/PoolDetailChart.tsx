import { Text, BoxProps } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';

interface Props extends BoxProps {}

function PoolDetailChart({ ...rest }: Props) {
    return (
        <BeetsBox display="flex" alignItems="center" justifyContent="center" h="md" {...rest}>
            <Text textStyle="h1">CHART</Text>
        </BeetsBox>
    );
}

export default PoolDetailChart;
