import { ButtonOptions, ButtonProps } from '@chakra-ui/button';
import { Button as ChakraButton, LinkProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export type BeetsButtonProps = {
    children: ReactNode | ReactNode[];
    buttonType?: 'primary' | 'secondary';
} & ButtonOptions &
    ButtonProps &
    LinkProps;

export default function BeetsButton({
    children,
    buttonType = 'primary',
    isDisabled,
    ...buttonOptions
}: BeetsButtonProps) {
    const color = buttonType === 'secondary' ? 'beets.greenAlpha.300' : 'beets.green';

    return (
        <ChakraButton
            bg={color}
            color={buttonType === 'secondary' ? 'white' : 'gray.500'}
            _active={{ backgroundColor: isDisabled ? 'beets.greenAlpha.300' : color }}
            _focus={{ outline: 'none' }}
            rounded="xl"
            {...buttonOptions}
            _hover={{
                transform: isDisabled ? undefined : 'scale(1.02)',
                ...buttonOptions._hover,
            }}
            _disabled={{ bg: 'beets.greenAlpha.300', opacity: '0.5', color: 'white', cursor: 'not-allowed' }}
            isDisabled={isDisabled}
        >
            {children}
        </ChakraButton>
    );
}
