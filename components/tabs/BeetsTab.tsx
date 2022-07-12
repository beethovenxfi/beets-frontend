import { Button, TabProps, HStack, Tab, Text, useTab, useMultiStyleConfig, Box } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { forwardRef } from 'react';
import { Eye } from 'react-feather';
import { AnimatedBox } from '~/components/animation/chakra';

const BeetsTab = forwardRef((props: { children: any } & TabProps, ref: any) => {
    const tabProps = useTab({ ...props, ref });
    const isSelected = !!tabProps['aria-selected'];

    return (
        <Button
            fontSize="sm"
            rounded="full"
            color={isSelected ? 'gray.100' : 'white'}
            bgColor={isSelected ? 'beets.base.300' : 'beets.lightAlpha.300'}
            _hover={{ bgColor: 'beets.light' }}
            _focus={{ outline: 'none !important' }}
            height="fit-content"
            paddingY="3"
            paddingX="4"
            {...tabProps}
            {...props}
        >
            <HStack>
                <Box>{tabProps.children}</Box>
                {isSelected && <Eye size={16} />}
            </HStack>
        </Button>
    );
});

BeetsTab.displayName = 'BeetsTab';
export default BeetsTab;
