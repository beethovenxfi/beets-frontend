import { Box, Circle, Flex } from '@chakra-ui/react';
import TokenAvatar from '~/components/token/TokenAvatar';

interface Props {
    token: string;
    position: 'start' | 'end';
}

export function BatchSwapTokenMarker({ token, position }: Props) {
    return (
        <Flex
            zIndex="1"
            pos="relative"
            alignSelf="flex-start"
            alignItems="center"
            flexDirection="column"
            bgColor="beets.base.800"
            borderRadius="xl"
        >
            <Box alignItems="center">
                <TokenAvatar address={token} w="20px" h="20px" />
            </Box>
            <Circle size="8px" marginTop="3px" backgroundColor={position === 'start' ? 'beets.green' : 'beets.red'} />
        </Flex>
    );
}
