import { useEffect, useState } from 'react';
import { useUserAccount } from '../user/useUserAccount';

export function useWalletConnectMetadata() {
    const [walletName, setWalletName] = useState('');
    const { connector } = useUserAccount();

    useEffect(() => {
        if (!connector?.getProvider) return;
        if (connector.id !== 'walletConnect') return;
        connector.getProvider().then((provider) => {
            const walletConnectProvider = provider as any;
            try {
                setWalletName(walletConnectProvider.signer.session.peer.metadata.name);
            } catch {
                // Ignore errors in metadata
            }
        });
    }, [connector]);

    const isSafeAccountViaWalletConnect = walletName === 'Safe{Wallet}';

    return { isSafeAccountViaWalletConnect };
}
