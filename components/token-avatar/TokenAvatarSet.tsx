import { Avatar, Flex, FlexProps } from '@chakra-ui/react';
import { AvatarProps } from '@chakra-ui/avatar/src/avatar';
import { useGetTokens } from '~/modules/global/useToken';

interface Props extends FlexProps {
    addresses: string[];
    imageSize?: number;
}

function TokenAvatarSet({ addresses, imageSize = 32, ...rest }: Props) {
    const { getToken } = useGetTokens();
    const numTokens = addresses.length;

    function leftOffsetFor(index: number) {
        //const multiplier = tokenSize === 'md' ? 4 : tokenSize === 'sm' ? 3 : 2;

        if (numTokens <= 1) {
            return 0;
        }

        return -1 * index * (numTokens * 4);
    }

    return (
        <Flex {...rest} pos={'relative'}>
            {addresses.map((address, i) => {
                const token = getToken(address);

                return (
                    <Avatar
                        boxSize={`${imageSize}px`}
                        key={i}
                        src={token?.logoURI || undefined}
                        zIndex={20 - i}
                        left={`${leftOffsetFor(i)}px`}
                        bg={'black'}
                    />
                );
            })}
        </Flex>
    );
}

export default TokenAvatarSet;
