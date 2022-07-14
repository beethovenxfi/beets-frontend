import { Box, BoxProps, Flex, FlexProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Props extends BoxProps {
    leftContent: ReactNode;
    rightContent: ReactNode;
    last?: boolean;
    center?: boolean;
}

export function BeetsBoxLineItem({ leftContent, rightContent, last, children, center, ...rest }: Props) {
    return (
        <Box px="3" py="2" borderBottomWidth={last ? 0 : 1} {...rest}>
            <Flex alignItems={center ? 'center' : 'flex-start'}>
                <Box flex="1" mr="4">
                    {leftContent}
                </Box>
                {rightContent}
            </Flex>
            {children}
        </Box>
    );
}
