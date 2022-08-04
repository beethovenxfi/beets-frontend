import Image from 'next/image';
import BeetsSmart from '~/assets/icons/beetx-smarts.svg';
import { useEarlyLudwigNft } from '~/lib/global/useEarlyLudwigNft';
import { Image as ChakraImage } from '@chakra-ui/react';

export function WalletUserAvatar() {
    const { data } = useEarlyLudwigNft();

    if (data) {
        return <ChakraImage src={data} height="74px" width="74px" />;
    }

    return <Image src={BeetsSmart} width="74px" alt="your-profile" />;
}
