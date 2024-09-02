import { Text } from '@chakra-ui/react';
import { CustomTooltip } from '~/components/tooltip/CustomTooltip';

export function PoolHeaderPoints({ textString }: { textString: string }) {
    return (
        <CustomTooltip
            trigger={
                <Text mr="2" color="beets.base.50">
                    {textString}
                </Text>
            }
            content={'Liquidity providers in this pool also earn partner points'}
            border="2px"
            borderColor="beets.green"
            bg="whiteAlpha.300"
        />
    );
}
