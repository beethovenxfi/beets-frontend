import { Text, TextProps } from '@chakra-ui/react';

interface Props extends TextProps {}

export function AprText({ children, ...rest }: Props) {

    return (
        <Text px="1" variant='apr' {...rest}>
            {children}
        </Text>
    );
}
