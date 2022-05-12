import { Flex, Input, Button, Box, Heading, VStack, useBoolean } from '@chakra-ui/react';
import { AnimatePresence, useAnimation } from 'framer-motion';
import { Ref, RefObject } from 'react';
import TokenSelect from '../token-select/TokenSelect';
import BeetsInput from './BeetsInput';

type Props = {
    label?: string;
    onToggleTokenSelect?: (isVisible: boolean) => void;
    onTokenSelected?: (address: string) => void;
    containerRef?: RefObject<HTMLDivElement>
};

export default function TokenInput({ label, onToggleTokenSelect, containerRef }: Props) {
    return (
        <VStack width="full" alignItems="flex-start">
            <Box position="relative" width="full">
                <BeetsInput placeholder="0" type="number" label={label} />
                <TokenSelect onToggleTokenSelect={onToggleTokenSelect} containerRef={containerRef} />
            </Box>
        </VStack>
    );
}
