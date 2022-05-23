import { Flex } from '@chakra-ui/react';
import Image from 'next/image';

import LogoFull from '~/assets/logo/logo-full.svg';
import WalletConnectButton from '../wallet/WalletConnectButton';

function Navbar() {
    return (
        <Flex width="full" padding="4" justifyContent="space-between">
            <Image src={LogoFull} alt="Logo" />
            <WalletConnectButton />
        </Flex>
    );
}

export default Navbar;
