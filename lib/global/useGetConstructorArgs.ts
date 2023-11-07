import { Etherscan } from 'etherscan-ts';
import Web3 from 'web3';
import WeightedPoolFactoryV4 from '~/lib/abi/WeightedPoolFactoryV4.json';
import WeightedPoolV4 from '~/lib/abi/WeightedPoolV4.json';
import InputDataDecoder from 'ethereum-input-data-decoder';
import { AddressZero } from '@ethersproject/constants';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useQuery } from 'react-query';

interface DecodedPoolData {
    name: string;
    symbol: string;
    tokens: string[];
    normalizedWeights: any[];
    rateProviders: string[];
    swapFeePercentage: any;
    owner: string;
    salt: string;
}

// manually added for now
const ID = '20230320-weighted-pool-v4';
const NAME = 'WeightedPool';
const VERSION = `{"name":"${NAME}","version":${ID.slice(-1)},"deployment":"${ID}"}`;

const decodedPoolData: DecodedPoolData = {
    name: '',
    symbol: '',
    tokens: [],
    normalizedWeights: [],
    rateProviders: [],
    swapFeePercentage: null,
    owner: '',
    salt: '',
};

type DecodedPoolDataKey = keyof typeof decodedPoolData;

const etherscan = new Etherscan(
    process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || '',
    process.env.NEXT_PUBLIC_ETHERSCAN_API_URL,
);

async function getTransactionsByAddress(address: string) {
    const list = await etherscan.getInternalTrxListByAddress(address, 0, 99999999, 1, 10, 'asc');
    return list;
}

export function useGetContructorArgs(contractAddress: string) {
    const networkConfig = useNetworkConfig();
    const web3 = new Web3(new Web3.providers.HttpProvider(networkConfig.rpcUrl));
    const decoder = new InputDataDecoder(WeightedPoolFactoryV4);

    return useQuery(
        ['constructorArgs', contractAddress],
        async () => {
            const txnsFactory = await getTransactionsByAddress(networkConfig.balancer.weightedPoolFactory);
            const stampFactory = txnsFactory.result[0].timeStamp;
            const txnsPool = await getTransactionsByAddress(contractAddress);
            const stampPool = txnsPool.result[0].timeStamp;
            const inputData = (await web3.eth.getTransaction(txnsPool.result[0].hash)).input;
            const decoded = decoder.decodeData(inputData);
            decoded.names.forEach((el, index) => {
                decodedPoolData[el as DecodedPoolDataKey] = decoded.inputs[index];
            });

            console.log({ decoded });

            // times for pause/buffer
            const daysToSec = 24 * 60 * 60; // hr * min * sec
            const pauseDays = 90;
            const bufferPeriodDays = 30;

            // calculate proper durations
            const pauseWindowDurationSec = Math.max(
                pauseDays * daysToSec - (parseInt(stampPool) - parseInt(stampFactory)),
                0,
            );
            let bufferPeriodDurationSec = bufferPeriodDays * daysToSec;
            if (pauseWindowDurationSec == 0) {
                bufferPeriodDurationSec = 0;
            }

            const zero_ams: string[] = [];
            for (let i = 1; i <= decodedPoolData.tokens.length; i++) {
                zero_ams.push(AddressZero);
            }

            const args = [
                [
                    decodedPoolData.name,
                    decodedPoolData.symbol,
                    decodedPoolData.tokens,
                    decodedPoolData.normalizedWeights.map((weight) => weight.toString()),
                    decodedPoolData.rateProviders.map((address) => `0x${address}`),
                    zero_ams,
                    decodedPoolData.swapFeePercentage.toString(),
                ],
                networkConfig.balancer.vault,
                networkConfig.balancer.protocolFeePercentagesProvider,
                pauseWindowDurationSec,
                bufferPeriodDurationSec,
                decodedPoolData.owner,
                VERSION,
            ];

            const encodedPoolData = web3.eth.abi.encodeParameters(WeightedPoolV4[0].inputs, args).slice(2);

            return encodedPoolData;
        },
        { enabled: contractAddress !== '' },
    );
}
