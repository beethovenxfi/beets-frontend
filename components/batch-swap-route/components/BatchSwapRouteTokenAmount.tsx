import { Box, Flex, FlexProps } from '@chakra-ui/react';
import TokenAvatar from '~/components/token/TokenAvatar';
import { tokenFormatAmount } from '~/lib/services/token/token-util';

interface Props extends FlexProps {
    token: string;
    amount: string;
}

export function BatchSwapRouteTokenAmount({ token, amount, ...rest }: Props) {
    return (
        <Flex
            flex="0.1 1 0%"
            padding="19.5px 14px"
            fontSize="xs"
            alignItems="center"
            justifyContent="flex-start"
            zIndex="1"
            {...rest}
        >
            <Flex borderRadius="lg" px="2" py="1" backgroundColor="beets.base.600" alignItems="center">
                <TokenAvatar address={token} width="20px" height="20px" />
                <Box ml="1.5">{tokenFormatAmount(amount)}</Box>
            </Flex>
        </Flex>
    );
}
