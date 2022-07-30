import {
    Avatar,
    Flex,
    FlexProps,
    Popover,
    PopoverTrigger as OrigPopoverTrigger,
    PopoverContent,
    Text,
    Circle,
} from '@chakra-ui/react';
import { useGetTokens } from '~/lib/global/useToken';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { PoolTokenPill } from '~/components/token/PoolTokenPill';
import TokenAvatar from '~/components/token/TokenAvatar';
import numeral from 'numeral';

export interface TokenData {
    address: string;
    weight?: string | null;
}

interface Props extends FlexProps {
    tokenData: TokenData[];
    imageSize?: number;
    maxAssetsPerLine?: number;
    width: number;
    renderPopover?: boolean;
}

function TokenAvatarSet({
    width,
    tokenData,
    imageSize = 32,
    maxAssetsPerLine = 5,
    renderPopover = true,
    ...rest
}: Props) {
    // temp fix: https://github.com/chakra-ui/chakra-ui/issues/5896#issuecomment-1104085557
    const PopoverTrigger: React.FC<{ children: React.ReactNode }> = OrigPopoverTrigger;
    const { getToken } = useGetTokens();

    const addressesInput = tokenData?.map((token) => token.address);
    const addressesInputLength = addressesInput?.length || 0;
    const numTokens = Math.min(addressesInputLength, maxAssetsPerLine);

    const tokens = tokenData?.map((token) => ({ ...token }));

    const count = Math.min(addressesInputLength, maxAssetsPerLine);

    function leftOffsetFor(index: number) {
        //const spacer = (maxAssetsPerLine / addressesInputLength - 1) * imageSize;
        const spacer = -2.5 * count + imageSize / count;

        return ((width - imageSize + spacer) / (maxAssetsPerLine - 1)) * index;
    }

    const tokenContent = (
        <Flex
            {...rest}
            position={'relative'}
            //width={(imageSize - 10) * addressesInputLength}
            height={`${imageSize}px`}
            width={`${leftOffsetFor(count - 1) + imageSize + 1}px`}
        >
            {addressesInput &&
                addressesInput
                    .slice(0, maxAssetsPerLine)
                    .reverse()
                    .map((address, i) => {
                        const token = getToken(address);

                        return (
                            <Avatar
                                boxSize={`${imageSize}px`}
                                //size="sm"
                                key={i}
                                src={token?.logoURI || undefined}
                                //zIndex={10 - i}
                                left={`${leftOffsetFor(numTokens - i - 1)}px`}
                                bg={'#181729'}
                                position="absolute"
                                icon={
                                    token?.logoURI ? (
                                        <Circle size={`${imageSize}px`} backgroundColor="whiteAlpha.200" />
                                    ) : (
                                        <Jazzicon diameter={imageSize} seed={jsNumberForAddress(address)} />
                                    )
                                }
                            />
                        );
                    })}
        </Flex>
    );

    if (!renderPopover) {
        return tokenContent;
    }

    return (
        <Popover trigger="hover">
            <PopoverTrigger>
                <button>{tokenContent}</button>
            </PopoverTrigger>
            <PopoverContent w="fit-content" bgColor="beets.base.800" shadow="2xl" p="1">
                {tokens?.map((token, index) => (
                    <Flex alignItems="center" p="1" key={index}>
                        <TokenAvatar address={token.address} size="xs" />
                        <Text ml="2">{getToken(token.address)?.symbol}</Text>
                        {token.weight ? <Text ml="2">{numeral(token.weight).format('%')}</Text> : null}
                    </Flex>
                ))}
            </PopoverContent>
        </Popover>
    );
}

export default TokenAvatarSet;
