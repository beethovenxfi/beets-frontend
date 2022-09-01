import { GqlToken } from '~/apollo/generated/graphql-codegen-generated';

export async function addTokenToWallet(token: GqlToken | null) {
    const provider = window.ethereum as any;
    try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await provider.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: token?.address, // The address that the token is at.
                    symbol: token?.symbol, // A ticker symbol or shorthand, up to 5 chars.
                    decimals: token?.decimals, // The number of decimals in the token
                    image: token?.logoURI, // A string url of the token logo
                },
            },
        });
    } catch (error) {
        console.log(error);
    }
}
