import { BeetsBox } from '~/components/box/BeetsBox';
import TokenAvatar from '~/components/token/TokenAvatar';
import { Flex, Text, BoxProps } from '@chakra-ui/react';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { tokenFormatAmount, tokenFormatAmountPrecise } from '~/lib/services/token/token-util';

interface Props extends BoxProps {
    address: string;
    amount: AmountHumanReadable;
    amountFormat?: 'standard' | 'precise';
}

export function TokenAmountPill({ address, amount, amountFormat = 'standard', ...rest }: Props) {
    return (
        <BeetsBox p={2} {...rest}>
            <Flex alignItems="center">
                <TokenAvatar address={address} size={'xs'} />
                <Text ml={2}>
                    {amountFormat === 'precise' ? tokenFormatAmountPrecise(amount) : tokenFormatAmount(amount)}
                </Text>
            </Flex>
        </BeetsBox>
    );
}
