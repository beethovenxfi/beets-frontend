import { Flex } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';

import LogoFull from '~/assets/logo/logo-full.svg';
import BeetsConnectButton from '../wallet/WalletConnection';

function Navbar() {
    return (
        <Flex width="full" padding="4" justifyContent='space-between'>
            <Image src={LogoFull} alt="Logo" />
            <BeetsConnectButton />
            {/* <ConnectButton /> */}
        </Flex>
    );
}

export default Navbar;
