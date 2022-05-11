import { Box, Text, Container, Heading, VStack, useTheme, Flex, Button } from '@chakra-ui/react';
import { ChevronsDown } from 'react-feather';
import { useState } from 'react';
import { AnimatePresence, useAnimation, motion } from 'framer-motion';
import TokenSelect from '~/components/token-select/TokenSelect';
import { useGetTokenPricesQuery } from '~/apollo/generated/graphql-codegen-generated';
import TokenInput from '~/components/inputs/TokenInput';
import Card from '~/components/card/Card';
import BeetsButton from '~/components/button/Button';

function TradeCard() {
    const { data, loading, error } = useGetTokenPricesQuery();
    const [showTokenSelect, setShowTokenSelect] = useState(false);
    const controls = useAnimation();

    const toggleTokenSelect = async () => {
        setShowTokenSelect(!showTokenSelect);
        if (!showTokenSelect) {
            controls.set({ position: 'absolute', top: '0', height: 'fit-content' });
            controls.start({
                scale: 0.9,
                opacity: 0,
                transition: {
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                },
            });
        } else {
            controls.set({
                translateX: '0px',
                translateY: '0px',
                opacity: 1,
                position: 'absolute',
            });
            controls.start({
                scale: 1,
                opacity: 1,
                transition: {
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                },
            });
        }
    };

    console.log('show', showTokenSelect);
    const theme = useTheme();
    return (
        <Box width="full" position="relative">
            <Card animate={controls} title="Market Swap" position="relative" height="md" shadow="lg" paddingBottom="1">
                <VStack spacing="2" padding="4" width="full">
                    <Box position="relative" width="full">
                        <TokenInput toggleTokenSelect={toggleTokenSelect} label="Sell" />
                        <Button
                            justifyContent="center"
                            backgroundColor="beets.gray.600"
                            alignItems="center"
                            rounded="full"
                            border="4px"
                            padding="1"
                            borderColor="beets.gray.500"
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
                    <TokenInput toggleTokenSelect={toggleTokenSelect} label="Buy" />
                    <BeetsButton isFullWidth size="lg">
                        Preview
                    </BeetsButton>
                </VStack>
            </Card>
            <AnimatePresence>{showTokenSelect && <TokenSelect toggle={toggleTokenSelect} />}</AnimatePresence>
        </Box>
    );
}
export default TradeCard;
