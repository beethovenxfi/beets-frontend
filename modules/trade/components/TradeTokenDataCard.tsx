import {
    GqlTokenData,
    GqlTokenDynamicData,
    GqlTokenDynamicDataFragment,
} from '~/apollo/generated/graphql-codegen-generated';
import { TokenBase } from '~/lib/services/token/token-types';
import { BeetsBox } from '~/components/box/BeetsBox';
import {
    Box,
    BoxProps,
    Flex,
    Text,
    HStack,
    Link,
    useTheme,
    useDisclosure,
    ModalOverlay,
    ModalBody,
    ModalHeader,
    ModalContent,
    ModalFooter,
    ModalCloseButton,
    Modal,
} from '@chakra-ui/react';
import TokenAvatar from '~/components/token/TokenAvatar';
import { useBoolean } from '@chakra-ui/hooks';
import { AnimatePresence } from 'framer-motion';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import numeral from 'numeral';
import { ChevronDown, ChevronUp } from 'react-feather';
import { useRef, useState } from 'react';

interface Props extends BoxProps {
    token: TokenBase;
    price: number | null;
    data?: GqlTokenData | null;
    dynamicData?: GqlTokenDynamicDataFragment | null;
}

export function TradeTokenDataCard({ token, price, data, dynamicData, ...rest }: Props) {
    const [showFullText, textState] = useBoolean(false);
    const theme = useTheme();
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <BeetsBox p="4" {...rest}>
                <Flex>
                    <HStack flex={1}>
                        <TokenAvatar address={token.address} size="sm" />
                        <Text fontSize="lg" fontWeight="semibold">
                            {token.symbol}
                        </Text>
                    </HStack>
                    {price ? (
                        <Box display="flex" flexDirection="column">
                            <Text fontSize="lg" fontWeight="semibold" textAlign="right">
                                {numberFormatUSDValue(price)}
                            </Text>
                            {dynamicData ? (
                                <Flex justifyContent="flex-end" alignItems="center">
                                    <Text
                                        color={
                                            dynamicData.priceChangePercent24h < 0 ? 'beets.red.300' : 'beets.green.500'
                                        }
                                        fontSize="sm"
                                    >
                                        {numeral(dynamicData.priceChangePercent24h / 100).format('+0.[0]%')}
                                    </Text>
                                    <Text fontSize="xs" ml="1">
                                        (24h)
                                    </Text>
                                </Flex>
                            ) : null}
                        </Box>
                    ) : null}
                </Flex>
                <Box mt="4">
                    {data?.description ? (
                        <Text
                            noOfLines={showFullText ? undefined : 3}
                            dangerouslySetInnerHTML={{ __html: data?.description }}
                        />
                    ) : null}
                    <Box mt="1">
                        <Link color="beets.highlight.alpha.100" textDecoration="underline" onClick={onOpen}>
                            Read more
                        </Link>
                    </Box>
                </Box>
            </BeetsBox>
            {data?.description ? (
                <Modal onClose={onClose} isOpen={isOpen} scrollBehavior="inside">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>
                            <HStack>
                                <TokenAvatar address={token.address} size="sm" />
                                <Text fontSize="lg">{token.symbol}</Text>
                            </HStack>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Box mb="8">
                                <Text dangerouslySetInnerHTML={{ __html: data.description }} />
                            </Box>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            ) : null}
        </>
    );
}
