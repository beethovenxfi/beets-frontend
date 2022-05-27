import { BeetsBox } from '~/components/box/BeetsBox';
import TokenAvatar from '~/components/token/TokenAvatar';
import { Flex, Text, BoxProps } from '@chakra-ui/react';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { tokenFormatAmount } from '~/lib/services/token/token-util';

interface Props extends BoxProps {
    address: string;
    amount: AmountHumanReadable;
}

export function TokenAmountPill({ address, amount, ...rest }: Props) {
    return (
        <BeetsBox p={2} {...rest}>
            <Flex alignItems="center">
                <TokenAvatar address={address} size={'xs'} />
                <Text ml={2}>{tokenFormatAmount(amount)}</Text>
            </Flex>
        </BeetsBox>
    );
}
