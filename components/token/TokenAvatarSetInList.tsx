import { Avatar, Box, Circle, Flex, FlexProps, Popover, PopoverContent, PopoverTrigger, Text } from '@chakra-ui/react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import numeral from 'numeral';

export interface TokenAvatarSetInListTokenData {
    address: string;
    weight?: string | null;
    logoURI?: string;
    symbol: string;
    nestedTokens?: {
        address: string;
        logoURI?: string;
        symbol: string;
    }[];
}

interface Props extends FlexProps {
    tokens: TokenAvatarSetInListTokenData[];
    imageSize?: number;
    maxAssetsPerLine?: number;
    width: number;
}

export function TokenAvatarSetInList({ width, tokens, imageSize = 32, maxAssetsPerLine = 5, ...rest }: Props) {
    const numTokens = Math.min(tokens.length, maxAssetsPerLine);
    const count = Math.min(tokens.length, maxAssetsPerLine);

    function leftOffsetFor(index: number) {
        const spacer = -2.5 * count + imageSize / count;

        return ((width - imageSize + spacer) / (maxAssetsPerLine - 1)) * index;
    }

    return (
        <Popover trigger="hover">
            <PopoverTrigger>
                <button>
                    <Flex
                        {...rest}
                        position={'relative'}
                        height={`${imageSize}px`}
                        width={`${leftOffsetFor(count - 1) + imageSize + 1}px`}
                    >
                        {tokens
                            .slice(0, maxAssetsPerLine)
                            .reverse()
                            .map((token, i) => {
                                return (
                                    <Avatar
                                        boxSize={`${imageSize}px`}
                                        key={i}
                                        src={token?.logoURI || undefined}
                                        left={`${leftOffsetFor(numTokens - i - 1)}px`}
                                        bg={'#181729'}
                                        position="absolute"
                                        icon={
                                            token?.logoURI ? (
                                                <Circle size={`${imageSize}px`} backgroundColor="whiteAlpha.200" />
                                            ) : (
                                                <Jazzicon
                                                    diameter={imageSize}
                                                    seed={jsNumberForAddress(token.address)}
                                                />
                                            )
                                        }
                                    />
                                );
                            })}
                    </Flex>
                </button>
            </PopoverTrigger>
            <PopoverContent w="fit-content" bgColor="beets.base.800" shadow="2xl" p="1">
                {tokens?.map((token, index) => (
                    <Box key={index}>
                        <Flex alignItems="center" p="1">
                            <Avatar
                                size="xs"
                                src={token?.logoURI || undefined}
                                icon={
                                    token?.logoURI ? (
                                        <Circle size={`${imageSize}px`} />
                                    ) : (
                                        <Jazzicon diameter={imageSize} seed={jsNumberForAddress(token.address)} />
                                    )
                                }
                            />
                            <Text ml="2">{token.symbol}</Text>
                            {token.weight ? <Text ml="2">{numeral(token.weight).format('%')}</Text> : null}
                        </Flex>
                        {token.nestedTokens &&
                            token.nestedTokens.map((nestedToken, index) => {
                                const isSubItemIndexZero = index === 0;
                                const isSubItemsLengthOne = token.nestedTokens?.length === 1;

                                return (
                                    <Flex alignItems="center" p="1" key={`${index}-${nestedToken.address}`} ml="8px">
                                        <Box
                                            w="1px"
                                            m="0.25rem"
                                            h={isSubItemsLengthOne ? '0.8rem' : isSubItemIndexZero ? '1rem' : '2rem'}
                                            mt={
                                                isSubItemsLengthOne
                                                    ? '-0.5rem'
                                                    : isSubItemIndexZero
                                                    ? '-0.3rem'
                                                    : '-1.7rem'
                                            }
                                            bgColor="gray.100"
                                        />
                                        <Box h="1px" w="0.75rem" mr="0.25rem" ml="-0.25rem" bgColor="gray.100" />
                                        <Avatar
                                            size="xs"
                                            src={nestedToken?.logoURI || undefined}
                                            icon={
                                                nestedToken?.logoURI ? (
                                                    <Circle size={`${imageSize}px`} backgroundColor="whiteAlpha.200" />
                                                ) : (
                                                    <Jazzicon
                                                        diameter={imageSize}
                                                        seed={jsNumberForAddress(nestedToken.address)}
                                                    />
                                                )
                                            }
                                        />
                                        <Text ml="2">{nestedToken.symbol}</Text>
                                    </Flex>
                                );
                            })}
                    </Box>
                ))}
            </PopoverContent>
        </Popover>
    );
}
