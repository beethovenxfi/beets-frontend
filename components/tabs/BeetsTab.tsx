import { Button, TabProps, HStack, Tab, Text, useTab, useMultiStyleConfig } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { forwardRef } from 'react';
import { Eye } from 'react-feather';
import { AnimatedBox } from '~/components/animation/chakra';

const BeetsTab = forwardRef((props: { children: any }, ref: any) => {
    const tabProps = useTab({ ...props, ref });
    const isSelected = !!tabProps['aria-selected'];
    const styles = useMultiStyleConfig('Tabs', tabProps);

    return (
        <Button
            {...tabProps}
            fontSize="sm"
            rounded="full"
            color={isSelected ? 'gray.100' : 'white'}
            bgColor={isSelected ? 'beets.base.300' : 'beets.lightAlpha.200'}
            _hover={{ bgColor: 'beets.light' }}
            _focus={{ outline: 'none !important' }}
        >
            <HStack>
                <Text>{tabProps.children}</Text>
                {isSelected && <Eye size={18} />}
            </HStack>
        </Button>
    );
});

BeetsTab.displayName = 'BeetsTab';
export default BeetsTab;
