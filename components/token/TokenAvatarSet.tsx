import { Avatar, Flex, FlexProps } from '@chakra-ui/react';
import { AvatarProps } from '@chakra-ui/avatar/src/avatar';
import { useGetTokens } from '~/lib/global/useToken';

interface Props extends FlexProps {
    addresses: string[];
    imageSize?: number;
    maxAssetsPerLine?: number;
    width: number;
}

function TokenAvatarSet({ width, addresses, imageSize = 32, maxAssetsPerLine = 5, ...rest }: Props) {
    const numTokens = Math.min(addresses.length, maxAssetsPerLine);
    const { getToken } = useGetTokens();

    function leftOffsetFor(index: number) {
        const spacer = (maxAssetsPerLine / addresses.length - 1) * imageSize;

        return ((width - imageSize + spacer) / (maxAssetsPerLine - 1)) * index;
    }

    return (
        <Flex
            {...rest}
            position={'relative'}
            //width={(imageSize - 10) * addresses.length}
            height={imageSize}
        >
            {addresses
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
                        />
                    );
                })}
        </Flex>
    );
}

export default TokenAvatarSet;
