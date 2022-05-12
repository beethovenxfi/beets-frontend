import { Button } from '@chakra-ui/button';
import { useBoolean, useMergeRefs } from '@chakra-ui/hooks';
import { Box, Flex, Heading, HStack, VStack } from '@chakra-ui/layout';
import { AnimatePresence, motion } from 'framer-motion';
import { FormEvent, memo, Ref, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GqlToken } from '~/apollo/generated/graphql-codegen-generated';
import { useGetTokens } from '~/graphql/useToken';
import Card from '../card/Card';
import BeetsInput from '../inputs/BeetsInput';
import TokenAvatar from '../token-avatar/TokenAvatar';
import { useVirtual } from 'react-virtual';

type Props = {
    containerRef?: RefObject<HTMLDivElement>;
    onToggleTokenSelect?: (isVisible: boolean) => void;
};

type TokenRowProps = GqlToken & { index: number };

const TokenRow = memo(function TokenRow({ symbol, address, index }: TokenRowProps) {
    return (
        <Button
            animate={{ opacity: 1, transition: { delay: index * 0.02 } }}
            initial={{ opacity: 0 }}
            as={motion.button}
            width="full"
            height="fit-content"
            variant="ghost"
            _hover={{ backgroundColor: 'beets.gray.400' }}
        >
            <HStack width="full" paddingY="4">
                <TokenAvatar address={address} />
                <Heading size="md" fontWeight="semibold" color="beets.gray.100">
                    {symbol}
                </Heading>
            </HStack>
        </Button>
    );
});

export default function TokenSelect({ containerRef, onToggleTokenSelect }: Props) {
    const { tokens } = useGetTokens();
    const [areTokensVisible, setAreTokensVisible] = useBoolean();
    const [searchTerm, setSearchTerm] = useState('');
    const scrollParentRef = useRef();
    const [showTokenSelect, setShowTokenSelect] = useBoolean();

    const handleSearchTermChange = (event: FormEvent<HTMLInputElement>) => setSearchTerm(event.currentTarget.value);

    // needed so the mounting of the many tokens does not jank
    // the animation, mount them as the animation completes
    const onMountAnimationComplete = () => {
        onToggleTokenSelect && onToggleTokenSelect(true);
        setTimeout(() => {
            setAreTokensVisible.on();
        }, 50);
    };

    const toggleSelect = () => {
        setShowTokenSelect.toggle();
        setAreTokensVisible.off();
        setSearchTerm('');
    };

    const filteredTokens = searchTerm
        ? tokens.filter((token) => {
              return (
                  token.address.toLowerCase() === searchTerm.toLowerCase() ||
                  token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
              );
          })
        : tokens;

    const rowVirtualiser = useVirtual({
        size: filteredTokens.length,
        parentRef: scrollParentRef,
        estimateSize: useCallback(() => 80, []),
        overscan: 8,
    });

    const SearchSection = useMemo(
        () => (
            <VStack padding="4">
                <BeetsInput
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    placeholder="0x.."
                    type="text"
                    label="Search or copy token address"
                />
            </VStack>
        ),
        [searchTerm],
    );

    const boundingRectOfContainer = useMemo(() => {
        return containerRef?.current?.getBoundingClientRect();
    }, [containerRef?.current]);

    return (
        <>
            <Box
                onClick={toggleSelect}
                position="absolute"
                zIndex="dropdown"
                right=".75rem"
                top="50%"
                transform="translateY(-50%)"
            >
                <Button backgroundColor="beets.gray.300" _hover={{ backgroundColor: 'beets.green.400' }} />
            </Box>
            <AnimatePresence>
                {showTokenSelect && (
                    <Card
                        shadow="lg"
                        title="Choose a token"
                        width="full"
                        animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 30 } }}
                        initial={{
                            scale: 0.8,
                            height: '400px',
                            opacity: 0,
                            position: 'fixed',
                            top: boundingRectOfContainer.y,
                            left: boundingRectOfContainer.x,
                            width: boundingRectOfContainer.width,
                        }}
                        exit={{ scale: 0.9, opacity: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } }}
                        onAnimationComplete={onMountAnimationComplete}
                        onClose={toggleSelect}
                        minHeight="800px"
                        zIndex="modal"
                    >
                        {SearchSection}
                        <VStack
                            overflowY="auto"
                            padding="4"
                            flexGrow={1}
                            ref={scrollParentRef as any}
                            css={{
                                '&::-webkit-scrollbar': {
                                    width: '0px !important',
                                },
                                '&::-webkit-scrollbar-track': {
                                    width: '0px !important',
                                },
                            }}
                        >
                            <Box height={`${rowVirtualiser.totalSize}px`} width="full" position="relative">
                                {areTokensVisible &&
                                    rowVirtualiser.virtualItems.map((virtualRow, i) => (
                                        <Box
                                            position="absolute"
                                            width="full"
                                            top="0"
                                            left="0"
                                            key={virtualRow.index}
                                            height={`${virtualRow.size}px`}
                                            transform={`translateY(${virtualRow.start}px)`}
                                        >
                                            <TokenRow index={i} {...filteredTokens[virtualRow.index]} />
                                        </Box>
                                    ))}
                            </Box>
                        </VStack>
                        <Box
                            position="absolute"
                            borderBottomLeftRadius="3xl"
                            borderBottomRightRadius="3xl"
                            bottom="0"
                            height="80px"
                            width="full"
                            bgGradient="linear(to-t, blackAlpha.300, rgba(0,0,0,0))"
                        />
                    </Card>
                )}
            </AnimatePresence>
        </>
    );
}
