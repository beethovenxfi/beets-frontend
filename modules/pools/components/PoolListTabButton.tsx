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
            color={selected ? 'beets.gray.100' : undefined}
            bgColor={selected ? 'beets.base.300' : 'beets.base.light.alpha.200'}
            _hover={{ bgColor: selected ? 'beets.base.light.alpha.100' : 'beets.base.light.alpha.100' }}
            _focus={{ outline: 'none !important' }}
        >
            {text}
        </Button>
    );
}
