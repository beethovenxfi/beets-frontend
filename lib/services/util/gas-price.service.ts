export type GasPrice = {
    price: number;
    maxPriorityFeePerGas?: number;
    maxFeePerGas?: number;
};

export type GasPriceEstimation = {
    pricePerGwei: number;
    standardPriceGwei: number;
    fastPriceGwei: number;
    rapidPriceGwei: number;
};

export class GasPriceService {
    public async getLatest(): Promise<GasPrice | null> {
        return null;
    }

    public async getGasPriceEstimation(): Promise<GasPriceEstimation | null> {
        return null;
    }
}
