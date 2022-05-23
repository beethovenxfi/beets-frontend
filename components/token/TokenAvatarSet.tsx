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
    const { getToken } = useGetTokens();

    function leftOffsetFor(index: number) {
        const spacer = (maxAssetsPerLine / addresses.length - 1) * imageSize;

        return ((width - imageSize + spacer) / (maxAssetsPerLine - 1)) * index;
    }

    return (
        <Flex
            {...rest}
            position={'relative'}
            //bgColor="orange"
            //width={(imageSize - 10) * addresses.length}
            height={imageSize}
        >
            {addresses.slice(0, maxAssetsPerLine).map((address, i) => {
                const token = getToken(address);

                return (
                    <Avatar
                        boxSize={`${imageSize}px`}
                        //size="sm"
                        key={i}
                        src={token?.logoURI || undefined}
                        zIndex={20 - i}
                        left={`${leftOffsetFor(i)}px`}
                        bg={'#181729'}
                        position="absolute"
                    />
                );
            })}
        </Flex>
    );
}

export default TokenAvatarSet;
