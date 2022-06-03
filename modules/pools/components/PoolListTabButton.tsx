import { Button, ButtonProps, HStack, Text } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { Eye } from 'react-feather';
import { AnimatedBox } from '~/components/animation/chakra';

interface Props extends ButtonProps {
    tabPosition: 'left' | 'middle' | 'right';
    selected: boolean;
    text: string;
}

export function PoolListTabButton({ tabPosition, selected, text, ...rest }: Props) {
    return (
        <Button
            {...rest}
            fontSize="sm"
            rounded="full"
            color={selected ? 'beets.gray.100' : undefined}
            bgColor={selected ? 'beets.base.300' : 'beets.base.light.alpha.200'}
            _hover={{ bgColor: selected ? 'beets.base.light.alpha.100' : 'beets.base.light.alpha.100' }}
            _focus={{ outline: 'none !important' }}
        >
            <HStack>
                <Text>{text}</Text>
                {selected && <Eye size="20" />}
            </HStack>
        </Button>
    );
}
