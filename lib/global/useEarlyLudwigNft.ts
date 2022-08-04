import { useQuery } from 'react-query';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { earlyLudwigNft } from '~/lib/services/nft/nft.service';
import axios from 'axios';

export function useEarlyLudwigNft() {
    const { userAddress, isConnected } = useUserAccount();

    return useQuery(
        ['useEarlyLudwigNft', userAddress],
        async () => {
            if (!userAddress) {
                return null;
            }

            const balance = await earlyLudwigNft.balanceOf(userAddress);

            if (parseInt(balance) === 0) {
                return null;
            }

            // we just take the first nft
            const tokenId = await earlyLudwigNft.tokenOfOwnerByIndex(userAddress, 0);
            const ipfsMetadataUri = await earlyLudwigNft.tokenURI(tokenId);
            const metadataCid = ipfsMetadataUri.replace('ipfs://', '');
            const metadataResponse = await axios.get(`https://ipfs.io/ipfs/${metadataCid}`);
            const ipfsImageUri = metadataResponse.data.image;
            const imageCid = ipfsImageUri.replace('ipfs://', '');

            return `https://ipfs.io/ipfs/${imageCid}`;
        },
        { enabled: isConnected },
    );
}
