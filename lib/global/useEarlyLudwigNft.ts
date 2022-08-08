import { useQuery } from 'react-query';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { earlyLudwigNft } from '~/lib/services/nft/nft.service';
import axios from 'axios';

const EARLY_LUDWIG_NFTS = 'EARLY_LUDWIG_NFTS';
const cached = typeof window !== 'undefined' ? localStorage.getItem(EARLY_LUDWIG_NFTS) : null;
const cachedParsed: { [address: string]: string | null } = cached ? JSON.parse(cached) : {};

export function useEarlyLudwigNft() {
    const { userAddress, isConnected } = useUserAccount();

    return useQuery(
        ['useEarlyLudwigNft', userAddress],
        async () => {
            if (!userAddress || cachedParsed[userAddress] === null) {
                return null;
            }

            if (cachedParsed[userAddress]) {
                return cachedParsed[userAddress];
            }

            const balance = await earlyLudwigNft.balanceOf(userAddress);

            if (parseInt(balance) === 0) {
                cachedParsed[userAddress] = null;
                localStorage.setItem(EARLY_LUDWIG_NFTS, JSON.stringify(cachedParsed));

                return null;
            }

            // we just take the first nft
            const tokenId = await earlyLudwigNft.tokenOfOwnerByIndex(userAddress, 0);
            const ipfsMetadataUri = await earlyLudwigNft.tokenURI(tokenId);
            const metadataCid = ipfsMetadataUri.replace('ipfs://', '');
            const metadataResponse = await axios.get(`https://ipfs.io/ipfs/${metadataCid}`);
            const ipfsImageUri = metadataResponse.data.image;
            const imageCid = ipfsImageUri.replace('ipfs://', '');

            cachedParsed[userAddress] = `https://ipfs.io/ipfs/${imageCid}`;
            localStorage.setItem(EARLY_LUDWIG_NFTS, JSON.stringify(cachedParsed));

            return `https://ipfs.io/ipfs/${imageCid}`;
        },
        { enabled: isConnected && !!userAddress, staleTime: Infinity },
    );
}
