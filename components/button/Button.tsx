import { ButtonOptions, ButtonProps } from '@chakra-ui/button';
import { Button as ChakraButton } from '@chakra-ui/react';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode | ReactNode[];
};

export default function BeetsButton({ children, ...buttonOptions }: Props & ButtonOptions & ButtonProps) {
    return (
        <ChakraButton
            {...buttonOptions}
            bg="beets.green.400"
            _hover={{
                backgroundColor: 'beets.green.200',
            }}
            _active={{ backgroundColor: 'beets.green.400' }}
            _focus={{ outline: 'none' }}
        >
            {children}
        </ChakraButton>
    );
}
