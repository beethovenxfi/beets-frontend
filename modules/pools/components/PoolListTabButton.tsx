import { Button, ButtonProps } from '@chakra-ui/react';

interface Props extends ButtonProps {
    tabPosition: 'left' | 'middle' | 'right';
    selected: boolean;
    text: string;
}

export function PoolListTabButton({ tabPosition, selected, text, ...rest }: Props) {
    return (
        <Button
            {...rest}
            borderTopLeftRadius={tabPosition === 'left' ? 'md' : 'none'}
            borderBottomLeftRadius={tabPosition === 'left' ? 'md' : 'none'}
            borderTopRightRadius={tabPosition === 'right' ? 'md' : 'none'}
            borderBottomRightRadius={tabPosition === 'right' ? 'md' : 'none'}
            bgColor={selected ? 'beets.green.500' : undefined}
            _hover={selected ? { bgColor: 'beets.green.500' } : undefined}
        >
            {text}
        </Button>
    );
}
