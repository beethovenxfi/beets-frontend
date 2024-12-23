import { GqlChain } from '~/apollo/generated/graphql-codegen-generated';
import type { NextApiRequest, NextApiResponse } from 'next';

// we're NOT in the browser, so we can expose the alchemy key here
const ALCHEMY_KEY = process.env.PRIVATE_ALCHEMY_KEY || '';

const chainToRpcMap: Record<GqlChain, string | undefined> = {
    MAINNET: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    ARBITRUM: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    OPTIMISM: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    BASE: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    POLYGON: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    AVALANCHE: `https://avax-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    FANTOM: `https://fantom-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    SEPOLIA: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    FRAXTAL: `https://frax-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    GNOSIS: `https://gnosis-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    MODE: undefined,
    ZKEVM: `https://polygonzkevm-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    SONIC: `https://sonic-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
};

function getRpcUrl(chain: string) {
    try {
        const rpc = chainToRpcMap[chain as GqlChain];
        if (!rpc) throw new Error(`Invalid chain: ${chain}`);
        return rpc;
    } catch (error) {
        throw new Error(`Invalid chain: ${chain}`);
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { chain } = req.query;

    if (!chain) {
        res.status(400).json({ error: 'Chain is required' });
        return;
    }

    const rpcUrl = getRpcUrl(chain as string);

    try {
        const rpcResponse = await fetch(rpcUrl, {
            method: 'POST',
            body: JSON.stringify(req.body),
        });

        const rpcResponseJson = await rpcResponse.json();

        res.status(200).json(rpcResponseJson);
    } catch (error) {
        res.status(500).json({ error: 'failed to load rpc data' });
    }
}
