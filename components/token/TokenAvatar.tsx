import { Avatar, useTheme } from '@chakra-ui/react';
import { AvatarProps } from '@chakra-ui/avatar/src/avatar';
import { useGetTokens } from '~/lib/global/useToken';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { AddressZero } from '@ethersproject/constants';

interface Props extends AvatarProps {
    address?: string | null;
}

function TokenAvatar({ address, size, ...rest }: Props) {
    const { getToken } = useGetTokens();
    const token = address ? getToken(address) : null;

    return (
        <Avatar
            {...rest}
            size={size}
            src={token?.logoURI || undefined}
            bg={'transparent'}
            icon={
                <Jazzicon
                    seed={jsNumberForAddress(address || AddressZero)}
                    paperStyles={{ width: '100%', height: '100%' }}
                />
            }
        />
    );
}

export default TokenAvatar;
