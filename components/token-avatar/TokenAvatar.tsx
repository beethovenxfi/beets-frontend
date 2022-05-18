import { Avatar, useToken } from '@chakra-ui/react';
import { AvatarProps } from '@chakra-ui/avatar/src/avatar';
import { useGetTokens } from '~/graphql/useToken';

interface Props extends AvatarProps {
    address: string;
}

function TokenAvatar({ address, ...rest }: Props) {
    const { getToken } = useGetTokens();
    const token = getToken(address);

    return <Avatar {...rest} src={token?.logoURI || undefined} bg={'transparent'} />;
}

export default TokenAvatar;
