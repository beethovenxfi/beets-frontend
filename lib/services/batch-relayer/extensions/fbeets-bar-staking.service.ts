import { Interface } from '@ethersproject/abi';
import fBeetsBarStakingAbi from '~/lib/abi/FBeetsBarStaking.json';
import { EncodeFBeetsBarEnterInput, EncodeFBeetsBarLeaveInput } from '~/lib/services/batch-relayer/relayer-types';

export class FBeetsBarStakingService {
    public encodeEnter(params: EncodeFBeetsBarEnterInput): string {
        const fBeetsBarStakingLibrary = new Interface(fBeetsBarStakingAbi);

        return fBeetsBarStakingLibrary.encodeFunctionData('fBeetsBarEnter', [
            params.sender,
            params.recipient,
            params.amount,
            params.outputReference,
        ]);
    }

    public encodeLeave(params: EncodeFBeetsBarLeaveInput): string {
        const fBeetsBarStakingLibrary = new Interface(fBeetsBarStakingAbi);

        return fBeetsBarStakingLibrary.encodeFunctionData('fBeetsBarLeave', [
            params.sender,
            params.recipient,
            params.amount,
            params.outputReference,
        ]);
    }
}
