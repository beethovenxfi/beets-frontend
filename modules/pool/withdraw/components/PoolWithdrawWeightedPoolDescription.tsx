export function PoolWithdrawWeightedPoolDescription() {
    return (
        <>
            Withdrawing proportionally from this pool ensures you will NOT be subject to the potential fees and/or
            impermanent loss caused by price impact.
            <br />
            <br />
            Alternatively, you can withdraw a single asset. However, this action may shift the pool out of balance,
            impacting your withdrawal with possible fees and impermanent loss caused by price impact.
            <br />
            <br />
            When withdrawing from a liquidity pool, your BPT tokens are exchanged for the underlying pool assets.
        </>
    );
}
