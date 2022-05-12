import { Button } from '@chakra-ui/button';
import { useBoolean, useMergeRefs } from '@chakra-ui/hooks';
import { Box, Flex, Heading, HStack, VStack } from '@chakra-ui/layout';
import { motion } from 'framer-motion';
import { FormEvent, memo, useCallback, useRef, useState } from 'react';
import { GqlToken } from '~/apollo/generated/graphql-codegen-generated';
import { useGetTokens } from '~/graphql/useToken';
import Card from '../card/Card';
import BeetsInput from '../inputs/BeetsInput';
import TokenAvatar from '../token-avatar/TokenAvatar';
import { useVirtual } from 'react-virtual';

type Props = {
    toggle?: any;
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

export default function TokenSelect({ toggle }: Props) {
    const { tokens } = useGetTokens();
    const [areTokensVisible, setAreTokensVisible] = useBoolean();
    const [searchTerm, setSearchTerm] = useState('');
    const parentRef = useRef();

    const handleSearchTermChange = (event: FormEvent<HTMLInputElement>) => setSearchTerm(event.currentTarget.value);

    // needed so the mounting of the many tokens does not jank
    // the animation, mount them as the animation completes
    const onMountAnimationComplete = () => {
        setAreTokensVisible.on();
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
        parentRef: parentRef,
        estimateSize: useCallback(() => 80, []),
        overscan: 8,
    });

    return (
        <Card
            shadow="lg"
            title="Choose a token"
            width="full"
            animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 30 } }}
            initial={{ scale: 0.8, height: '400px', opacity: 0, position: 'absolute' }}
            exit={{ scale: 0.9, opacity: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } }}
            onAnimationComplete={onMountAnimationComplete}
            onClose={toggle}
            minHeight="800px"
            position="relative"
        >
            <VStack padding="4">
                <BeetsInput
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    placeholder="0x.."
                    type="text"
                    label="Search or copy token address"
                />
            </VStack>
            <VStack
                overflowY="auto"
                padding="4"
                flexGrow={1}
                ref={parentRef as any}
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
    );
}
