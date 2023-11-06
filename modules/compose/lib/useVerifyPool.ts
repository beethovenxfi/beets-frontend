import { useQuery } from 'react-query';
import sourceCode from './weighted_pool_v4.json';
import axios from 'axios';

export interface EtherscanRequest {
    apikey: string;
    module: string;
    action: string;
}

export interface EtherscanVerifyRequest extends EtherscanRequest {
    contractaddress: string;
    sourceCode: string;
    codeformat: string;
    contractname: string;
    compilerversion: string;
    // This is misspelt in Etherscan's actual API parameters.
    // See: https://etherscan.io/apis#contracts
    constructorArguements: string;
}

interface Response {
    status: string;
    message: string;
    result: any;
}

/* Wrap */
async function wrapPost(url: string, req: EtherscanVerifyRequest): Promise<Response> {
    const parameters = new URLSearchParams();
    const reqKeys = Object.keys(req);
    const reqValues = Object.values(req);
    reqKeys.forEach((key, index) => parameters.append(key, reqValues[index]));
    try {
        const res = await axios.post(url, parameters);
        const json = await res.data;
        console.log({ json });
        if (json.status !== '1') {
            throw new Error(`Response status must be '1'`);
        }
        return json;
    } catch (error: any) {
        throw new Error(`Failed to fetch: ${error.message}`);
    }
}

async function postVerifySourceCode(
    url: string,
    apikey: string,
    contractaddress: string,
    sourceCode: string,
    codeformat: string,
    contractname: string,
    compilerversion: string,
    constructorArguements: string,
    licenseType: number,
): Promise<Response> {
    try {
        const params = {
            apikey,
            module: 'contract',
            action: 'verifysourcecode',
            contractaddress,
            sourceCode,
            codeformat,
            contractname,
            compilerversion,
            constructorArguements,
            licenseType,
        };

        return wrapPost(url, params);
    } catch (error: any) {
        throw new Error(`postVerifySourceCode Error: ${error.message}`);
    }
}

export function useVerifyPool(apiUrl: string, apiKey: string, constructorArguements: string, poolAddress: string) {
    return useQuery(
        ['verifyPool', poolAddress, constructorArguements],
        async () => {
            const result = await postVerifySourceCode(
                apiUrl,
                apiKey,
                poolAddress,
                JSON.stringify(sourceCode),
                'solidity-standard-json-input',
                'contracts/WeightedPool.sol:WeightedPool',
                'v0.7.1+commit.f4a555be',
                constructorArguements,
                5,
            );

            console.log({ result });

            return result;
        },
        { enabled: poolAddress !== '' && apiKey !== '' && apiUrl !== '' && constructorArguements !== '' },
    );
}
