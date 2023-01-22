import { Interface } from '@ethersproject/abi';
import ReliquaryStakingAbi from '~/lib/abi/ReliquaryStaking.json';
import {
    EncodeReliquaryCreateRelicAndDepositInput,
    EncodeReliquaryDepositInput,
    EncodeReliquaryHarvestAllInput,
    EncodeReliquaryUpdatePositionInput,
    EncodeReliquaryWithdrawAndHarvestInput,
} from '~/lib/services/batch-relayer/relayer-types';

export class ReliquaryStakingService {
    public encodeCreateRelicAndDeposit(params: EncodeReliquaryCreateRelicAndDepositInput): string {
        const reliquaryStakingLibrary = new Interface(ReliquaryStakingAbi);

        return reliquaryStakingLibrary.encodeFunctionData('reliquaryCreateRelicAndDeposit', [
            params.sender,
            params.recipient,
            params.token,
            params.poolId,
            params.amount,
            params.outputReference,
        ]);
    }
    public encodeDeposit(params: EncodeReliquaryDepositInput): string {
        const reliquaryStakingLibrary = new Interface(ReliquaryStakingAbi);

        return reliquaryStakingLibrary.encodeFunctionData('reliquaryDeposit', [
            params.sender,
            params.token,
            params.relicId,
            params.amount,
            params.outputReference,
        ]);
    }

    public encodeWithdrawAndHarvest(params: EncodeReliquaryWithdrawAndHarvestInput): string {
        const reliquaryStakingLibrary = new Interface(ReliquaryStakingAbi);

        return reliquaryStakingLibrary.encodeFunctionData('reliquaryWithdrawAndHarvest', [
            params.recipient,
            params.relicId,
            params.amount,
            params.outputReference,
        ]);
    }

    public encodeHarvestAll(params: EncodeReliquaryHarvestAllInput): string {
        const reliquaryStakingLibrary = new Interface(ReliquaryStakingAbi);

        return reliquaryStakingLibrary.encodeFunctionData('reliquaryHarvestAll', [params.relicIds, params.recipient]);
    }
}
