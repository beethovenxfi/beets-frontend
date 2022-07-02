import { ButtonOptions, ButtonProps } from '@chakra-ui/button';
import { Button as ChakraButton, LinkProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode | ReactNode[];
    buttonType?: 'primary' | 'secondary';
};

export default function BeetsButton({
    children,
    buttonType = 'primary',
    ...buttonOptions
}: Props & ButtonOptions & ButtonProps & LinkProps) {
    const color = buttonType === 'secondary' ? 'beets.greenAlpha.300' : 'beets.green';

    return (
        <ChakraButton
            bg={color}
            color={buttonType === 'secondary' ? 'white' : 'gray.500'}
            _active={{ backgroundColor: color }}
            _focus={{ outline: 'none' }}
            rounded="xl"
            {...buttonOptions}
            _hover={{
                transform: 'scale(1.02)',
                ...buttonOptions._hover,
            }}
        >
            {children}
        </ChakraButton>
    );
}
