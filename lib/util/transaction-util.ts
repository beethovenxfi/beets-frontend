export function transactionMessageFromError(error: Error): string {
    const unknown = error as any;

    if (unknown.reason) {
        const reason = unknown.reason as string;

        if (reason.indexOf('BAL#507') !== -1) {
            return 'Your transaction failed due to excessive slippage. You can increase your max slippage and try again. BAL#507';
        } else if (reason.indexOf('BAL#506') !== -1) {
            return 'Your transaction failed due to excessive slippage. You can increase your max slippage and try again. BAL#506';
        } else if (reason.indexOf('BAL#505') !== -1) {
            return 'Your transaction failed due to excessive slippage. You can increase your max slippage and try again. BAL#505';
        }

        return `An error occurred: ${reason}`;
    }

    if (error.message.indexOf('Connector not found') !== -1) {
        return 'Unable to connect to your wallet. Please ensure your wallet is unlocked and available.';
    }

    return `An error occurred: ${error.message}`;
}
