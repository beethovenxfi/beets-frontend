export type BeetsTransactionType =
    | 'SWAP'
    | 'JOIN'
    | 'EXIT'
    | 'HARVEST'
    | 'STAKE'
    | 'UNSTAKE'
    | 'APPROVE'
    | 'WRAP'
    | 'UNWRAP'
    | 'LEVEL_UP'
    | 'BURN'
    | 'MIGRATE'
    | 'CHECKPOINT'
    | 'CREATE_POOL';

export type ToastTransactionStatus = 'PENDING' | 'CONFIRMED' | 'ERROR';
export type ToastHeadlines = Record<ToastTransactionStatus, string>;
const TRANSACTION_HEADLINES: Record<BeetsTransactionType, ToastHeadlines> = {
    JOIN: {
        PENDING: 'Invest pending',
        CONFIRMED: 'Invest confirmed',
        ERROR: 'Invest error',
    },
    SWAP: {
        PENDING: 'Swap pending',
        CONFIRMED: 'Swap confirmed',
        ERROR: 'Swap error',
    },
    EXIT: {
        PENDING: 'Withdraw pending',
        CONFIRMED: 'Withdraw confirmed',
        ERROR: 'Withdraw error',
    },
    HARVEST: {
        PENDING: 'Harvest pending',
        CONFIRMED: 'Harvest confirmed',
        ERROR: 'Harvest error',
    },
    STAKE: {
        PENDING: 'Stake pending',
        CONFIRMED: 'Stake confirmed',
        ERROR: 'Stake error',
    },
    UNSTAKE: {
        PENDING: 'Unstake pending',
        CONFIRMED: 'Unstake confirmed',
        ERROR: 'Unstake error',
    },
    APPROVE: {
        PENDING: 'Approve pending',
        CONFIRMED: 'Approve confirmed',
        ERROR: 'Approve error',
    },
    WRAP: {
        PENDING: 'Wrap pending',
        CONFIRMED: 'Wrap confirmed',
        ERROR: 'Wrap error',
    },
    UNWRAP: {
        PENDING: 'Unwrap pending',
        CONFIRMED: 'Unwrap confirmed',
        ERROR: 'Unwrap error',
    },
    LEVEL_UP: {
        PENDING: 'Level up relic pending',
        CONFIRMED: 'Level up relic confirmed',
        ERROR: 'Level up relic error',
    },
    BURN: {
        PENDING: 'Burn relic pending',
        CONFIRMED: 'Burn relic confirmed',
        ERROR: 'Burn relic error',
    },
    MIGRATE: {
        PENDING: 'Migrate pending',
        CONFIRMED: 'Migrate confirmed',
        ERROR: 'Migrate error',
    },
    CHECKPOINT: {
        PENDING: 'Checkpoint pending',
        CONFIRMED: 'Checkpoint confirmed',
        ERROR: 'Checkpoint error',
    },
    CREATE_POOL: {
        PENDING: 'Create pool pending',
        CONFIRMED: 'Create pool confirmed',
        ERROR: 'Create pool error',
    },
};

export function getToastTransactionHeadline(type: BeetsTransactionType, status: ToastTransactionStatus) {
    return TRANSACTION_HEADLINES[type][status] || 'Missing headline';
}
