import { Avatar } from '@chakra-ui/react';
import { AvatarProps } from '@chakra-ui/avatar/src/avatar';
import { useGetTokens } from '~/lib/global/useToken';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

interface Props extends AvatarProps {
    address: string;
}

function TokenAvatar({ address, size, ...rest }: Props) {
    const { getToken } = useGetTokens();
    const token = getToken(address);

    return (
        <Avatar
            {...rest}
            size={size}
            src={token?.logoURI || undefined}
            bg={'transparent'}
            icon={<Jazzicon seed={jsNumberForAddress(address)} />}
        />
    );
}

export default TokenAvatar;
