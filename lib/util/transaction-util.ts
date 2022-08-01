export function transactionMessageFromError(error: Error): string {
    const unknown = error as any;

    if (unknown.reason) {
        const reason = unknown.reason as string;

        if (reason.indexOf('BAL#507') !== -1) {
            return 'Your transaction failed due to excessive slippage. You can increase your max slippage and try again. BAL#507';
        }

        return `An error occurred: ${reason}`;
    }

    return `An error occurred: ${error.message}`;
}
