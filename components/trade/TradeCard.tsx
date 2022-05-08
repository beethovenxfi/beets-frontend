import { Box, Text, Container, Heading, VStack, useTheme, Flex, Button } from '@chakra-ui/react';
import { useGetTokenPricesQuery } from '../../apollo/generated/graphql-codegen-generated';
import TokenInput from '../inputs/TokenInput';
import { ChevronsDown } from 'react-feather';
import TokenSelect from '../token-select/TokenSelect';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Card from '../card/Card';

function TradeCard() {
    const { data, loading, error } = useGetTokenPricesQuery();
    const [showTokenSelect, setShowTokenSelect] = useState(false);

    const toggleTokenSelect = () => {
        setShowTokenSelect(!showTokenSelect);
    };

    const theme = useTheme();
    return (
        <Card title="Market Swap" position="relative" overflow="hidden" height="md" shadow="2xl">
            <VStack spacing="2" padding="4" width="full">
                <Box position="relative" width="full" onClick={toggleTokenSelect}>
                    <TokenInput />
                    <Button
                        justifyContent="center"
                        backgroundColor="beets.gray.600"
                        alignItems="center"
                        rounded="full"
                        border="4px"
                        padding="1"
                        borderColor="beets.gray.400"
                        position="absolute"
                        bottom="-20px"
                        left="calc(50% - 20px)"
                        zIndex="2"
                        role="group"
                        _hover={{ borderColor: 'beets.green.500', cursor: 'pointer' }}
                        _active={{ backgroundColor: 'beets.gray.600' }}
                    >
                        <Box
                            marginTop="1px"
                            color="beets.gray.200"
                            css={{
                                transform: 'rotate(360deg)',
                                transition: 'transform linear .15s',
                            }}
                            _groupHover={{
                                color: 'beets.green.500',
                                cursor: 'pointer',
                                transform: 'rotate(180deg)',
                                transition: 'all linear .15s',
                            }}
                            _groupFocus={{ color: 'beets.green.500', cursor: 'pointer' }}
                        >
                            <ChevronsDown size={24} color="currentColor" />
                        </Box>
                    </Button>
                </Box>
                <TokenInput />
            </VStack>
            <AnimatePresence>{showTokenSelect && <TokenSelect />}</AnimatePresence>
        </Card>
    );
}
export default TradeCard;
