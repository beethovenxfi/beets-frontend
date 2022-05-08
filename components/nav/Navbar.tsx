import { Flex } from '@chakra-ui/react';
import Image from 'next/image';

import LogoFull from '~/assets/logo/logo-full.svg';

function Navbar() {
    return (
        <Flex width="full" padding="4">
            <Image src={LogoFull} alt="Logo" />
        </Flex>
    );
}

export default Navbar;
