import { Button, TabProps, HStack, Tab, Text, useTab, useMultiStyleConfig, Box } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { forwardRef } from 'react';
import { Eye } from 'react-feather';
import { AnimatedBox } from '~/components/animation/chakra';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

const BeetsTab = forwardRef((props: { children: any } & TabProps, ref: any) => {
    const tabProps = useTab({ ...props, ref });
    const isSelected = !!tabProps['aria-selected'];
    const { protocol } = useNetworkConfig();

    return (
        <Button className={isSelected ? 'isSelected' : ''} variant="tab" {...tabProps} {...props}>
            <HStack>
                <Box>{tabProps.children}</Box>
                {isSelected && <Eye size={16} />}
            </HStack>
        </Button>
    );
});

BeetsTab.displayName = 'BeetsTab';
export default BeetsTab;
