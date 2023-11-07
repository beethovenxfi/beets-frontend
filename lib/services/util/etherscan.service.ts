import axios from 'axios';
import { type } from 'os';
import sourceCode from '~/lib/sourceCode/weighted_pool_v4.json';

export interface EtherscanRequestBase {
    apikey: string;
    module: string;
    action: string;
}

export interface EtherscanVerificationStatusInput {
    guid: string;
}

export interface EtherscanVerifyInputBase {
    contractaddress: string;
    // This is misspelt in Etherscan's actual API parameters.
    // See: https://etherscan.io/apis#contracts
    constructorArguements: string;
}

export interface EtherscanVerifyInput extends EtherscanVerifyInputBase {
    sourceCode: string;
    codeformat: string;
    compilerversion: string;
    contractname: string;
    licenseType: number;
}

export type EtherscanVerifyRequest = EtherscanRequestBase & EtherscanVerifyInput;
export type EtherscanVerificationStatusRequest = EtherscanRequestBase & EtherscanVerificationStatusInput;
export type EtherscanRequest = EtherscanVerifyRequest | EtherscanVerificationStatusRequest;

export interface Response {
    status: string;
    message: string;
    result: any;
}

export class EtherscanService {
    private url = process.env.NEXT_PUBLIC_ETHERSCAN_API_URL || '';
    private apikey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || '';

    /* Wrap */
    private async wrapPost(req: EtherscanVerifyRequest): Promise<Response> {
        const parameters = new URLSearchParams();
        const reqKeys = Object.keys(req);
        const reqValues = Object.values(req);
        reqKeys.forEach((key, index) => parameters.append(key, reqValues[index]));
        try {
            const res = await axios.post(this.url, parameters);
            const json = await res.data;
            if (json.status !== '1') {
                throw new Error(`Response status must be '1'`);
            }
            return json;
        } catch (error: any) {
            throw new Error(`Failed to fetch: ${error.message}`);
        }
    }

    private async wrapGet(req: EtherscanVerificationStatusRequest): Promise<Response> {
        try {
            const res = await axios.get(this.url, { params: req });
            const json = await res.data;
            if (json.status !== '1') {
                throw new Error(`Response status must be '1'`);
            }
            return json;
        } catch (error: any) {
            throw new Error(`Failed to fetch: ${error.message}`);
        }
    }

    public async verifySourceCode(verifySCInputParams: EtherscanVerifyInputBase): Promise<Response> {
        try {
            const params = {
                apikey: this.apikey,
                // default settings are for WeightedPoolV4, if we're going to support more than this pool this will need be dynamic
                module: 'contract',
                action: 'verifysourcecode',
                sourceCode: JSON.stringify(sourceCode),
                codeformat: 'solidity-standard-json-input',
                contractname: 'contracts/WeightedPool.sol:WeightedPool',
                compilerversion: 'v0.7.1+commit.f4a555be',
                licenseType: 5,
                ...verifySCInputParams,
            };

            return this.wrapPost(params);
        } catch (error: any) {
            throw new Error(`verifySourceCode Error: ${error.message}`);
        }
    }

    public async checkVerifyStatus(verifyStatusInputParams: EtherscanVerificationStatusInput): Promise<Response> {
        try {
            const params = {
                apikey: this.apikey,
                module: 'contract',
                action: 'verifysourcecode',
                ...verifyStatusInputParams,
            };

            return this.wrapGet(params);
        } catch (error: any) {
            throw new Error(`verifySourceCode Error: ${error.message}`);
        }
    }
}

export const etherscanService = new EtherscanService();
