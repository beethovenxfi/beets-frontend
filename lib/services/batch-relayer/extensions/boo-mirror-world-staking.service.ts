import { Interface } from '@ethersproject/abi';
import booMirrorWorldStakingAbi from '~/lib/abi/BooMirrorWorldStaking.json';
import {
    EncodeBooMirrorWorldEnterInput,
    EncodeBooMirrorWorldLeaveInput,
} from '~/lib/services/batch-relayer/relayer-types';

export class BooMirrorWorldStakingService {
    public encodeEnter(params: EncodeBooMirrorWorldEnterInput): string {
        const booMirrorWorldStakingLibrary = new Interface(booMirrorWorldStakingAbi);

        return booMirrorWorldStakingLibrary.encodeFunctionData('booMirrorWorldEnter', [
            params.sender,
            params.recipient,
            params.amount,
            params.outputReference,
        ]);
    }

    public encodeLeave(params: EncodeBooMirrorWorldLeaveInput): string {
        const booMirrorWorldStakingLibrary = new Interface(booMirrorWorldStakingAbi);

        return booMirrorWorldStakingLibrary.encodeFunctionData('booMirrorWorldLeave', [
            params.sender,
            params.recipient,
            params.amount,
            params.outputReference,
        ]);
    }
}
