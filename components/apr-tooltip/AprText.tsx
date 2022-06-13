import { Text, TextProps } from '@chakra-ui/react';

interface Props extends TextProps {}

export function AprText({ children, ...rest }: Props) {
    return (
        <Text px="1" color="gray.200" {...rest}>
            {children}
        </Text>
    );
}
