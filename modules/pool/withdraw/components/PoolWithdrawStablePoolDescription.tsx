export function PoolWithdrawStablePoolDescription() {
    return (
        <>
            Due to the unique design of stable pools, you can withdraw proportionally or into a single token without
            encountering significant price impact.
            <br />
            <br />
            However, withdrawals that rebalance the pool into equal ratios will receive a small bonus due to the
            mechanics of the liquidity pool. Alternatively, withdrawals that cause an imbalance of ratios will incur a
            small fee.
        </>
    );
}
