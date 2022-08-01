export function transactionMessageFromError(error: Error): string {
    const unknown = error as any;

    if (unknown.reason) {
        return unknown.reason as string;
    }

    return error.message;
}
