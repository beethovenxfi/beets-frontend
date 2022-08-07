import { Avatar, Circle, Flex, FlexProps, Popover, PopoverContent, PopoverTrigger, Text } from '@chakra-ui/react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import numeral from 'numeral';

export interface TokenAvatarSetInListTokenData {
    address: string;
    weight?: string | null;
    logoURI?: string;
    symbol: string;
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
                    <Flex alignItems="center" p="1" key={index}>
                        <Avatar
                            size="xs"
                            src={token?.logoURI || undefined}
                            icon={
                                token?.logoURI ? (
                                    <Circle size={`${imageSize}px`} backgroundColor="whiteAlpha.200" />
                                ) : (
                                    <Jazzicon diameter={imageSize} seed={jsNumberForAddress(token.address)} />
                                )
                            }
                        />
                        <Text ml="2">{token.symbol}</Text>
                        {token.weight ? <Text ml="2">{numeral(token.weight).format('%')}</Text> : null}
                    </Flex>
                ))}
            </PopoverContent>
        </Popover>
    );
}
