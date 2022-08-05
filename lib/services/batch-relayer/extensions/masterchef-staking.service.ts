import { Interface } from '@ethersproject/abi';
import MasterChefStakingAbi from '~/lib/abi/MasterChefStaking.json';
import {
    EncodeMasterChefDepositInput,
    EncodeMasterChefWithdrawInput,
} from '~/lib/services/batch-relayer/relayer-types';

export class MasterChefStakingService {
    public encodeDeposit(params: EncodeMasterChefDepositInput): string {
        const masterChefStakingLibrary = new Interface(MasterChefStakingAbi);

        return masterChefStakingLibrary.encodeFunctionData('masterChefDeposit', [
            params.sender,
            params.recipient,
            params.token,
            params.pid,
            params.amount,
            params.outputReference,
        ]);
    }

    public encodeWithdraw(params: EncodeMasterChefWithdrawInput): string {
        const masterChefStakingLibrary = new Interface(MasterChefStakingAbi);

        return masterChefStakingLibrary.encodeFunctionData('masterChefWithdraw', [
            params.recipient,
            params.pid,
            params.amount,
            params.outputReference,
        ]);
    }
}
